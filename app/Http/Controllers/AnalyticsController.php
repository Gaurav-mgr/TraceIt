<?php

namespace App\Http\Controllers;

use App\Models\InventoryBatch;
use App\Models\InventoryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $today = Carbon::today();
        $soon = $today->copy()->addDays(14);

        $items = $request->user()
            ->inventoryItems()
            ->with(['batches' => fn ($query) => $query->orderBy('expires_at')->orderBy('id')])
            ->orderBy('name')
            ->get();

        $rows = $items->flatMap(function (InventoryItem $item) use ($today, $soon) {
            return $item->batches->map(function (InventoryBatch $batch) use ($item, $today, $soon) {
                $totalQuantity = $item->total_quantity;

                return [
                    'item_id' => $item->id,
                    'batch_id' => $batch->id,
                    'name' => $item->name,
                    'category' => $item->category ?? '',
                    'unit' => $item->unit,
                    'low_stock_threshold' => $item->low_stock_threshold,
                    'batch_code' => $batch->batch_code ?? '',
                    'quantity' => $batch->quantity,
                    'received_at' => $batch->received_at?->toDateString() ?? '',
                    'expires_at' => $batch->expires_at->toDateString(),
                    'total_quantity' => $totalQuantity,
                    'is_low_stock' => $totalQuantity <= $item->low_stock_threshold,
                    'expiry_status' => $batch->expires_at->lt($today)
                        ? 'expired'
                        : ($batch->expires_at->lte($soon) ? 'soon' : 'fresh'),
                ];
            });
        })->values();
        // Prepare line chart data: aggregate total quantity by received date (YYYY-MM-DD)
        $lineChartData = $rows
            ->groupBy(fn($row) => $row['received_at'] ?? $row['expires_at'])
            ->map(fn($group, $date) => [
                $date,
                $group->sum('quantity'),
            ])
            ->sortBy(0)
            ->values()
            ->prepend(['Date', 'Quantity'])
            ->toArray();

        // Prepare pie chart data: distribution of total quantity by category
        $pieChartData = $rows
            ->groupBy('category')
            ->map(fn($group, $category) => [
                $category ?: 'Uncategorized',
                $group->sum('quantity'),
            ])
            ->values()
            ->prepend(['Category', 'Quantity'])
            ->toArray();

        return Inertia::render('dashboard', [
            'inventoryRows' => $rows,
            'lineChartData' => $lineChartData,
            'pieChartData' => $pieChartData,
            'summary' => [
                'items' => $items->count(),
                'batches' => $rows->count(),
                'lowStock' => $items->filter(fn (InventoryItem $item) => $item->total_quantity <= $item->low_stock_threshold)->count(),
                'expiringSoon' => $rows->where('expiry_status', 'soon')->count(),
                'expired' => $rows->where('expiry_status', 'expired')->count(),
            ],
        ]);
    }

    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.item_id' => ['nullable', 'integer'],
            'rows.*.batch_id' => ['nullable', 'integer'],
            'rows.*.name' => ['required', 'string', 'max:255'],
            'rows.*.category' => ['nullable', 'string', 'max:255'],
            'rows.*.unit' => ['required', 'string', 'max:50'],
            'rows.*.low_stock_threshold' => ['required', 'integer', 'min:0', 'max:1000000'],
            'rows.*.batch_code' => ['nullable', 'string', 'max:255'],
            'rows.*.quantity' => ['required', 'integer', 'min:0', 'max:1000000'],
            'rows.*.received_at' => ['nullable', 'date'],
            'rows.*.expires_at' => ['required', 'date'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            foreach ($validated['rows'] as $row) {
                $item = $this->resolveItem($request, $row);

                $item->fill([
                    'name' => trim($row['name']),
                    'category' => filled($row['category'] ?? null) ? trim($row['category']) : null,
                    'unit' => trim($row['unit']),
                    'low_stock_threshold' => $row['low_stock_threshold'],
                ])->save();

                $batch = $this->resolveBatch($item, $row);

                $batch->fill([
                    'batch_code' => filled($row['batch_code'] ?? null) ? trim($row['batch_code']) : null,
                    'quantity' => $row['quantity'],
                    'received_at' => $row['received_at'] ?? null,
                    'expires_at' => $row['expires_at'],
                ])->save();
            }
        });

        return back()->with('status', 'Inventory saved.');
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function resolveItem(Request $request, array $row): InventoryItem
    {
        if (! empty($row['item_id'])) {
            $item = $request->user()
                ->inventoryItems()
                ->whereKey($row['item_id'])
                ->first();

            if (! $item) {
                throw ValidationException::withMessages([
                    'rows' => 'One or more inventory rows could not be found.',
                ]);
            }

            return $item;
        }

        return $request->user()->inventoryItems()->firstOrNew([
            'name' => trim((string) $row['name']),
        ]);
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function resolveBatch(InventoryItem $item, array $row): InventoryBatch
    {
        if (! empty($row['batch_id'])) {
            $batch = $item->batches()
                ->whereKey($row['batch_id'])
                ->first();

            if (! $batch) {
                throw ValidationException::withMessages([
                    'rows' => 'One or more inventory batches could not be found.',
                ]);
            }

            return $batch;
        }

        return $item->batches()->make();
    }
}
