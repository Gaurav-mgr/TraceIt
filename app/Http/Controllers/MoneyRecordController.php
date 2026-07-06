<?php

namespace App\Http\Controllers;

use App\Models\MoneyRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MoneyRecordController extends Controller
{
    public function index(Request $request, string $type): Response
    {
        $type = $this->normalizeType($type);
        $records = $request->user()
            ->moneyRecords()
            ->where('type', $type)
            ->orderByDesc('recorded_at')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('money-records', [
            'recordType' => $type,
            'records' => $records->map(fn (MoneyRecord $record) => $this->recordRow($record))->values(),
            'summary' => [
                'entries' => $records->count(),
                'total' => (float) $records->sum('amount'),
                'today' => (float) $records->filter(fn (MoneyRecord $record) => $record->recorded_at->isToday())->sum('amount'),
                'categories' => $records->pluck('category')->filter()->unique()->count(),
            ],
        ]);
    }

    public function bulkUpdate(Request $request, string $type): RedirectResponse
    {
        $type = $this->normalizeType($type);

        $validated = $request->validate([
            'rows' => ['present', 'array'],
            'rows.*.id' => ['nullable', 'integer'],
            'rows.*.title' => ['required', 'string', 'max:255'],
            'rows.*.category' => ['nullable', 'string', 'max:255'],
            'rows.*.amount' => ['required', 'numeric', 'min:0.01', 'max:999999999.99'],
            'rows.*.recorded_at' => ['required', 'date'],
            'rows.*.notes' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($request, $type, $validated) {
            $keptIds = [];

            foreach ($validated['rows'] as $row) {
                $record = $this->resolveRecord($request, $type, $row);

                $record->fill([
                    'type' => $type,
                    'title' => trim($row['title']),
                    'category' => filled($row['category'] ?? null) ? trim($row['category']) : null,
                    'amount' => $row['amount'],
                    'recorded_at' => $row['recorded_at'],
                    'notes' => filled($row['notes'] ?? null) ? trim($row['notes']) : null,
                ])->save();

                $keptIds[] = $record->id;
            }

            $request->user()
                ->moneyRecords()
                ->where('type', $type)
                ->when($keptIds !== [], fn ($query) => $query->whereNotIn('id', $keptIds))
                ->delete();
        });

        return back()->with('status', ucfirst($type).' records saved.');
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function resolveRecord(Request $request, string $type, array $row): MoneyRecord
    {
        if (! empty($row['id'])) {
            $record = $request->user()
                ->moneyRecords()
                ->where('type', $type)
                ->whereKey($row['id'])
                ->first();

            if (! $record) {
                throw ValidationException::withMessages([
                    'rows' => 'One or more money records could not be found.',
                ]);
            }

            return $record;
        }

        return $request->user()->moneyRecords()->make();
    }

    private function normalizeType(string $type): string
    {
        if (! in_array($type, MoneyRecord::types(), true)) {
            abort(404);
        }

        return $type;
    }

    /**
     * @return array<string, mixed>
     */
    private function recordRow(MoneyRecord $record): array
    {
        return [
            'id' => $record->id,
            'title' => $record->title,
            'category' => $record->category ?? '',
            'amount' => (float) $record->amount,
            'recorded_at' => $record->recorded_at->toDateString(),
            'notes' => $record->notes ?? '',
        ];
    }
}
