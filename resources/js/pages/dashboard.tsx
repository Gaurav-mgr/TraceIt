import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Chart from 'react-google-charts';

type InventoryRow = {
    item_id: number | null;
    batch_id: number | null;
    name: string;
    category: string;
    unit: string;
    low_stock_threshold: number;
    batch_code: string;
    quantity: number;
    received_at: string;
    expires_at: string;
    total_quantity?: number;
    is_low_stock?: boolean;
    expiry_status?: 'expired' | 'soon' | 'fresh';
};

type DashboardProps = {
    inventoryRows: InventoryRow[];
    lineChartData: any[];
    pieChartData: any[];
    summary: {
        items: number;
        batches: number;
        lowStock: number;
        expiringSoon: number;
        expired: number;
    };
};

type TimeframeKey = 'day' | 'week' | 'month' | 'year';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
    },
];


export default function Dashboard({ inventoryRows, lineChartData, pieChartData, summary }: DashboardProps) {
    const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('day');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="grid gap-3 md:grid-cols-5">
                    <Metric label="Items" value={summary.items} />
                    <Metric label="Batches" value={summary.batches} />
                    <Metric label="Low stock" value={summary.lowStock} tone="danger" />
                    <Metric label="Expiring soon" value={summary.expiringSoon} tone="warning" />
                    <Metric label="Expired" value={summary.expired} tone="danger" />
                </div>
                <div className="flex-1 overflow-hidden rounded-lg border border-[#dfe3d6] bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="p-6 h-full flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">Dashboard analytics</h2>
                                <p className="mt-2 text-sm text-[#5b665d]">Visualize inventory activity for today, this week, month, or year.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(['day', 'week', 'month', 'year'] as TimeframeKey[]).map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        type="button"
                                        onClick={() => setActiveTimeframe(timeframe)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTimeframe === timeframe ? 'bg-[#1d4f36] text-white' : 'bg-white text-[#17201b] shadow-sm'
                                            }`}
                                    >
                                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 lg:grid-cols-2 flex-1">
                            <div className="rounded-xl border border-[#e6e9df] bg-[#f9faf5] p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#566155]">Inventory activity</h3>
                                <div className="mt-4 h-[360px] rounded-2xl bg-white p-4 shadow-sm ">
                                 <Chart
                                   chartType="LineChart"
                                   width="100%"
                                   height="100%"
                                   data={lineChartData}
                                   options={{
                                     title: `Inventory Activity (${activeTimeframe})`,
                                     legend: { position: 'bottom' },
                                   }}
                                 />
                                </div>
                            </div>
                            <div className="rounded-xl border border-[#e6e9df] bg-[#f9faf5] p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#566155]">Stock composition</h3>
                                <div className="mt-4 h-[360px] rounded-2xl bg-white p-4 shadow-sm">
                                 <Chart
                                   chartType="PieChart"
                                   width="100%"
                                   height="100%"
                                   data={pieChartData}
                                   options={{
                                     title: `Stock Composition (${activeTimeframe})`,
                                     pieHole: 0.6,
                                     legend: { position: 'right' },
                                   }}
                                 />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 lg:grid-cols-3">
                            <Metric label="Active items" value={summary.items} />
                            <Metric label="Batches live" value={summary.batches} />
                            <Metric label="Low stock" value={summary.lowStock} tone="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: number; tone?: 'neutral' | 'danger' | 'warning' }) {
    const toneClass =
        tone === 'danger'
            ? 'border-[#ffc9c9] bg-[#fff1f1] text-[#b91520]'
            : tone === 'warning'
                ? 'border-[#ffe2a3] bg-[#fff8df] text-[#6f5100]'
                : 'border-[#dfe3d6] bg-white text-[#17201b]';
    return (
        <div className={`rounded-lg border p-4 shadow-sm dark:border-sidebar-border dark:bg-sidebar ${toneClass}`}>
            <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
    );
}