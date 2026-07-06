<?php

namespace App\Http\Controllers;

use App\Models\MoneyRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $records = $request->user()
            ->moneyRecords()
            ->orderBy('recorded_at')
            ->get();

        $chartData = collect(['day', 'week', 'month', 'year'])
            ->mapWithKeys(fn (string $timeframe) => [
                $timeframe => [
                    'line' => $this->lineChartData($records, $timeframe),
                    'pie' => $this->pieChartData($records, $timeframe),
                ],
            ])
            ->toArray();

        $totalSavings = (float) $records->where('type', MoneyRecord::TYPE_SAVING)->sum('amount');
        $totalSpendings = (float) $records->where('type', MoneyRecord::TYPE_SPENDING)->sum('amount');

        return Inertia::render('dashboard', [
            'chartData' => $chartData,
            'summary' => [
                'savings' => $totalSavings,
                'spendings' => $totalSpendings,
                'balance' => $totalSavings - $totalSpendings,
                'entries' => $records->count(),
                'todaySavings' => (float) $records
                    ->filter(fn (MoneyRecord $record) => $record->type === MoneyRecord::TYPE_SAVING && $record->recorded_at->isToday())
                    ->sum('amount'),
                'todaySpendings' => (float) $records
                    ->filter(fn (MoneyRecord $record) => $record->type === MoneyRecord::TYPE_SPENDING && $record->recorded_at->isToday())
                    ->sum('amount'),
            ],
        ]);
    }

    /**
     * @param  Collection<int, MoneyRecord>  $records
     * @return array<int, array<int, float|string>>
     */
    private function lineChartData(Collection $records, string $timeframe): array
    {
        $filtered = $this->recordsForTimeframe($records, $timeframe);
        $rows = $filtered
            ->groupBy(fn (MoneyRecord $record) => $this->bucketLabel($record->recorded_at, $timeframe))
            ->map(fn (Collection $group, string $label) => [
                $label,
                (float) $group->where('type', MoneyRecord::TYPE_SAVING)->sum('amount'),
                (float) $group->where('type', MoneyRecord::TYPE_SPENDING)->sum('amount'),
                (float) $group->where('type', MoneyRecord::TYPE_SAVING)->sum('amount')
                    - (float) $group->where('type', MoneyRecord::TYPE_SPENDING)->sum('amount'),
            ])
            ->values();

        if ($rows->isEmpty()) {
            $rows->push([$this->emptyLabel($timeframe), 0, 0, 0]);
        }

        return $rows->prepend(['Period', 'Savings', 'Spendings', 'Net'])->toArray();
    }

    /**
     * @param  Collection<int, MoneyRecord>  $records
     * @return array<int, array<int, float|string>>
     */
    private function pieChartData(Collection $records, string $timeframe): array
    {
        $filtered = $this->recordsForTimeframe($records, $timeframe);
        $savings = (float) $filtered->where('type', MoneyRecord::TYPE_SAVING)->sum('amount');
        $spendings = (float) $filtered->where('type', MoneyRecord::TYPE_SPENDING)->sum('amount');

        return [
            ['Type', 'Amount'],
            ['Savings', $savings],
            ['Spendings', $spendings],
        ];
    }

    /**
     * @param  Collection<int, MoneyRecord>  $records
     * @return Collection<int, MoneyRecord>
     */
    private function recordsForTimeframe(Collection $records, string $timeframe): Collection
    {
        $now = Carbon::today();

        [$start, $end] = match ($timeframe) {
            'day' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
            'week' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
            'month' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            'year' => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
            default => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
        };

        return $records->filter(fn (MoneyRecord $record) => $record->recorded_at->betweenIncluded($start, $end))->values();
    }

    private function bucketLabel(Carbon $date, string $timeframe): string
    {
        return match ($timeframe) {
            'day' => $date->format('M j'),
            'week' => $date->format('D, M j'),
            'month' => $date->format('M j'),
            'year' => $date->format('M'),
            default => $date->toDateString(),
        };
    }

    private function emptyLabel(string $timeframe): string
    {
        return match ($timeframe) {
            'day' => today()->format('M j'),
            'week' => 'This week',
            'month' => today()->format('M Y'),
            'year' => today()->format('Y'),
            default => 'No records',
        };
    }
}
