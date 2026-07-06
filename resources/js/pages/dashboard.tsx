import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Chart from 'react-google-charts';

type TimeframeKey = 'day' | 'week' | 'month' | 'year';

type DashboardProps = {
    chartData: Record<TimeframeKey, { line: any[]; pie: any[] }>;
    summary: {
        savings: number;
        spendings: number;
        balance: number;
        entries: number;
        todaySavings: number;
        todaySpendings: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
    },
];

const money = (value: number) =>
    `रु ${new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value||0))}`;

export default function Dashboard({ chartData, summary }: DashboardProps) {
    const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('day');
    const activeCharts = chartData[activeTimeframe];

    const net = summary.todaySavings - summary.todaySpendings
    const netTone = net > 0 ? "positive" : "warning";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2">
                    <div className="md:col-span-4 flex items-center bg-[#1c2721] justify-between rounded-lg border-b border-[#dfe3d6] p-4 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <span className="text-[16px] text-white">BALANCE:</span>
                        <h1 className="text-3xl font-bold text-white">{money(summary.balance)}</h1>
                    </div>
                    <Metric label="Savings" value={money(summary.savings)} tone="positive" />
                    <Metric label="Spendings" value={money(summary.spendings)} tone="warning" />
                    <Metric label="Entries" value={summary.entries} />
                    <Metric label="Today net" value={money(net)} tone={netTone} />
                </div>
                <div className="dark:border-sidebar-border dark:bg-sidebar flex-1 overflow-hidden rounded-lg border border-[#dfe3d6] bg-white shadow-sm">
                    <div className="flex h-full flex-col gap-3 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">Dashboard analytics</h2>
                                <p className="mt-2 text-sm text-[#5b665d]">Visualize savings and spendings for today, this week, month, or year.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(['day', 'week', 'month', 'year'] as TimeframeKey[]).map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        type="button"
                                        onClick={() => setActiveTimeframe(timeframe)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                                            activeTimeframe === timeframe ? 'bg-[#1c2721] text-white' : 'bg-white text-[#17201b] shadow-sm'
                                        }`}
                                    >
                                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5 grid flex-1 gap-4 lg:grid-cols-2">
                            <div className="rounded-xl border border-[#e6e9df] bg-[#f9faf5] py-4 px-5">
                                <h3 className="text-sm font-semibold tracking-wide text-[#566155] uppercase">Money activity</h3>
                                <div className="mt-4 h-[340px] rounded-2xl bg-white p-4 shadow-sm">
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="100%"
                                        data={activeCharts.line}
                                        options={{
                                            title: `Savings and Spendings (${activeTimeframe})`,
                                            legend: { position: 'bottom' },
                                            colors: ['#09c419', '#fd4f4f', '#315f9f'],
                                            curveType: 'function',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl border border-[#e6e9df] bg-[#f9faf5] py-4 px-5">
                                <h3 className="text-sm font-semibold tracking-wide text-[#566155] uppercase">Savings vs spendings</h3>
                                <div className="mt-4 h-[340px] rounded-2xl bg-white p-4 shadow-sm">
                                    <Chart
                                        chartType="PieChart"
                                        width="100%"
                                        height="100%"
                                        data={activeCharts.pie}
                                        options={{
                                            title: `Money Composition (${activeTimeframe})`,
                                            pieHole: 0.6,
                                            legend: { position: 'right' },
                                            colors: ['#09c419', '#fd4f4f'],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-4 lg:grid-cols-3">
                            <Metric label="Today savings" value={money(summary.todaySavings)} tone="positive" />
                            <Metric label="Today spendings" value={money(summary.todaySpendings)} tone="warning" />
                            <Metric label="Today balance" value={money(summary.todaySavings - summary.todaySpendings)} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string | number; tone?: 'neutral' | 'danger' | 'warning' | 'positive' }) {
    const toneClass =
        tone === 'danger'
            ? 'border-[#ffc9c9] bg-[#fff1f1] text-[#b91520]'
            : tone === 'warning'
              ? 'border-[#ff0000]/15 bg-[#fdf4f4] text-red-800'
              : tone === 'positive'
                ? 'border-[#cce8cd] bg-[#edf8ed] text-[#1d4f36]'
                : 'border-[#dfe3d6] bg-white text-[#17201b]';

    return (
        <div className={`dark:border-sidebar-border dark:bg-sidebar rounded-lg border p-3 shadow-sm flex flex-col justify-center ${toneClass}`}>
            <p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p>
            <p className="text-[22px] font-semibold">{value}</p>
        </div>
    );
}
