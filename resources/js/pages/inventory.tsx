import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Head } from '@inertiajs/react';
import { AlertTriangle, CalendarClock, Check, Save, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEvent, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', url: '/inventory' },
];

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
    summary: {
        items: number;
        batches: number;
        lowStock: number;
        expiringSoon: number;
        expired: number;
    };
};

type RowErrors = {
    name?: string;
    quantity?: string;
    expires_at?: string;
};

type SectionKey = 'overview' | 'create' | 'update' | 'delete';
type TimeframeKey = 'day' | 'week' | 'month' | 'year';

const emptyRow = (): InventoryRow => ({
    item_id: null,
    batch_id: null,
    name: '',
    category: '',
    unit: 'units',
    low_stock_threshold: 5,
    batch_code: '',
    quantity: 0,
    received_at: new Date().toISOString().slice(0, 10),
    expires_at: '',
});

export default function Inventory({ inventoryRows, summary }: DashboardProps) {
    const initialRows = inventoryRows.length > 0 ? inventoryRows : [emptyRow()];
    const form = useForm<{ rows: InventoryRow[] }>({ rows: initialRows });
    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('day');
    const [newRow, setNewRow] = useState<InventoryRow>(emptyRow());

    const totals = useMemo(() => {
        return form.data.rows.reduce(
            (carry, row) => {
                const key = row.item_id ? `id-${row.item_id}` : row.name.trim().toLowerCase();
                const current = carry.itemTotals.get(key) ?? 0;
                carry.itemTotals.set(key, current + Number(row.quantity || 0));
                return carry;
            },
            { itemTotals: new Map<string, number>() },
        );
    }, [form.data.rows]);

    const setRow = (index: number, field: keyof InventoryRow, value: string | number) => {
        form.setData(
            'rows',
            form.data.rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)),
        );
    };

    const addRow = () => form.setData('rows', [...form.data.rows, emptyRow()]);

    const removeRow = (index: number) => {
        form.setData(
            'rows',
            form.data.rows.filter((_, rowIndex) => rowIndex !== index),
        );
    };

    const updateNewRow = (field: keyof InventoryRow, value: string | number) => {
        setNewRow((current) => ({ ...current, [field]: value }));
    };

    const createNewRow = (event: FormEvent) => {
        event.preventDefault();
        form.setData('rows', [...form.data.rows, newRow]);
        setNewRow(emptyRow());
        setActiveSection('update');
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('inventory.bulk-update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            {/* top breadcrumbs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 px-6 pb-5">
                <Metric label="Items" value={summary.items} />
                <Metric label="Batches" value={summary.batches} />
                <Metric label="Low stock" value={summary.lowStock} tone="danger" />
                <Metric label="Expiring soon" value={summary.expiringSoon} tone="warning" />
                <Metric label="Expired" value={summary.expired} tone="danger" />
            </div>

            {/* buttons i.e. overveiw, create, update, and delete */}
            <div className="flex flex-wrap gap-2 border-b border-[#e6e9df] bg-[#f7f8f3] p-4 dark:border-sidebar-border">
                {(['overview', 'create', 'update', 'delete'] as SectionKey[]).map((section) => (
                    <button
                        key={section}
                        type="button"
                        onClick={() => setActiveSection(section)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === section ? 'bg-[#1d4f36] text-white' : 'bg-white text-[#17201b] shadow-sm'
                            }`}
                    >
                        {section === 'overview' ? 'Overview' : section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeSection === 'overview' && (
                <div className="p-6">
                    <h2 className="text-lg font-semibold">Inventory overview</h2>
                    <p className="mt-2 text-sm text-[#5b665d]">Review current batches, stock levels, and expiry status before making updates.</p>


                    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e6e9df] bg-white p-4">
                        <table className="w-full min-w-[1120px] text-sm">
                            <thead className="bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase dark:bg-sidebar-accent">
                                <tr>
                                    <Th>Item</Th>
                                    <Th>Category</Th>
                                    <Th>Batch</Th>
                                    <Th>Qty</Th>
                                    <Th>Expires</Th>
                                    <Th>Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.data.rows.map((row, index) => {
                                    const itemKey = row.item_id ? `id-${row.item_id}` : row.name.trim().toLowerCase();
                                    const totalQuantity = totals.itemTotals.get(itemKey) ?? Number(row.total_quantity || row.quantity || 0);
                                    const isLowStock = totalQuantity <= Number(row.low_stock_threshold || 0);
                                    return (
                                        <tr
                                            key={`${row.item_id ?? 'new'}-${row.batch_id ?? index}`}
                                            className={isLowStock ? 'bg-[#fff1f1] text-[#4d0d12]' : 'border-t border-[#eef0e8] dark:border-sidebar-border'}
                                        >
                                            <Td>{row.name || '—'}</Td>
                                            <Td>{row.category || '—'}</Td>
                                            <Td>{row.batch_code || '—'}</Td>
                                            <Td>{totalQuantity}</Td>
                                            <Td>{row.expires_at || '—'}</Td>
                                            <Td><StatusBadge row={row} totalQuantity={totalQuantity} isLowStock={isLowStock} /></Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create */}
            {activeSection === 'create' && (
                <form onSubmit={createNewRow} className="space-y-6 p-6">
                    <div>
                        <h2 className="text-lg font-semibold">Add new batch</h2>
                        <p className="mt-2 text-sm text-[#5b665d]">Create a new inventory record and add it to the dashboard.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="Item name" value={newRow.name} onChange={(value) => updateNewRow('name', value)} />
                        <InputField label="Category" value={newRow.category} onChange={(value) => updateNewRow('category', value)} />
                        <InputField label="Batch code" value={newRow.batch_code} onChange={(value) => updateNewRow('batch_code', value)} />
                        <InputField label="Quantity" type="number" value={String(newRow.quantity)} onChange={(value) => updateNewRow('quantity', Number(value))} />
                        <InputField label="Unit" value={newRow.unit} onChange={(value) => updateNewRow('unit', value)} />
                        <InputField label="Low stock threshold" type="number" value={String(newRow.low_stock_threshold)} onChange={(value) => updateNewRow('low_stock_threshold', Number(value))} />
                        <InputField label="Received date" type="date" value={newRow.received_at} onChange={(value) => updateNewRow('received_at', value)} />
                        <InputField label="Expiry date" type="date" value={newRow.expires_at} onChange={(value) => updateNewRow('expires_at', value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" className="bg-[#1d4f36] cursor-pointer hover:bg-[#20342a]">Create batch</Button>
                        <Button type="button" className="cursor-pointer hover:border-red-400 hover:text-red-600 hover:bg-red-100" variant="outline" onClick={() => setNewRow(emptyRow())}>Reset</Button>
                    </div>
                </form>
            )}

            {/* Update */}
            {activeSection === 'update' && (
                <form onSubmit={submit} className="p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Update inventory</h2>
                            <p className="mt-2 text-sm text-[#5b665d]">Edit prices, quantities, thresholds, and expiry dates before saving changes.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" className="cursor-pointer hover:border-[#1d4f36] hover:text-[#1d4f36] transition-all duration-600" variant="outline" onClick={addRow}>Add row</Button>
                            <Button type="submit" className="bg-[#1d4f36] cursor-pointer hover:bg-[#20342a]" disabled={form.processing}>
                                {form.recentlySuccessful ? <Check className="size-4" /> : <Save className="size-4" />}
                                {form.processing ? 'Saving' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e6e9df] bg-white">
                        <table className="w-full min-w-[1120px] border-collapse text-sm">
                            <thead className="bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase dark:bg-sidebar-accent">
                                <tr>
                                    <Th>Item</Th>
                                    <Th>Category</Th>
                                    <Th>Batch</Th>
                                    <Th>Qty</Th>
                                    <Th>Unit</Th>
                                    <Th>Low threshold</Th>
                                    <Th>Received</Th>
                                    <Th>Expires</Th>
                                    <Th>Status</Th>
                                    <Th />
                                </tr>
                            </thead>
                            <tbody>
                                {form.data.rows.map((row, index) => {
                                    const itemKey = row.item_id ? `id-${row.item_id}` : row.name.trim().toLowerCase();
                                    const totalQuantity = totals.itemTotals.get(itemKey) ?? Number(row.total_quantity || row.quantity || 0);
                                    const isLowStock = totalQuantity <= Number(row.low_stock_threshold || 0);
                                    const errorsByKey = form.errors as Record<string, string | undefined>;
                                    const rowErrors: RowErrors = {
                                        name: errorsByKey[`rows.${index}.name`],
                                        quantity: errorsByKey[`rows.${index}.quantity`],
                                        expires_at: errorsByKey[`rows.${index}.expires_at`],
                                    };
                                    return (
                                        <tr
                                            key={`${row.item_id ?? 'new'}-${row.batch_id ?? index}`}
                                            className={isLowStock ? 'bg-[#fff1f1] text-[#4d0d12]' : 'border-t border-[#eef0e8] dark:border-sidebar-border'}
                                        >
                                            <Td>
                                                <Input value={row.name} onChange={(event) => setRow(index, 'name', event.target.value)} placeholder="Milk cartons" />
                                                <InputError message={rowErrors.name} className="mt-1" />
                                            </Td>
                                            <Td>
                                                <Input value={row.category} onChange={(event) => setRow(index, 'category', event.target.value)} placeholder="Dairy" />
                                            </Td>
                                            <Td>
                                                <Input value={row.batch_code} onChange={(event) => setRow(index, 'batch_code', event.target.value)} placeholder="Batch code" />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.quantity}
                                                    onChange={(event) => setRow(index, 'quantity', Number(event.target.value))}
                                                />
                                                <InputError message={rowErrors.quantity} className="mt-1" />
                                            </Td>
                                            <Td>
                                                <Input value={row.unit} onChange={(event) => setRow(index, 'unit', event.target.value)} />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.low_stock_threshold}
                                                    onChange={(event) => setRow(index, 'low_stock_threshold', Number(event.target.value))}
                                                />
                                            </Td>
                                            <Td>
                                                <Input type="date" value={row.received_at} onChange={(event) => setRow(index, 'received_at', event.target.value)} />
                                            </Td>
                                            <Td>
                                                <Input type="date" value={row.expires_at} onChange={(event) => setRow(index, 'expires_at', event.target.value)} />
                                                <InputError message={rowErrors.expires_at} className="mt-1" />
                                            </Td>
                                            <Td>
                                                <StatusBadge row={row} totalQuantity={totalQuantity} isLowStock={isLowStock} />
                                            </Td>
                                            <Td>
                                                {!row.batch_id && form.data.rows.length > 1 ? (
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(index)} aria-label="Remove unsaved row">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                ) : null}
                                            </Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </form>
            )}

            {/* Delete */}
            {activeSection === 'delete' && (
                <div className="p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Delete batch entries</h2>
                            <p className="mt-2 text-sm text-[#5b665d]">Remove unsaved rows or clear the current inventory list.</p>
                        </div>
                        <Button type="button" className="cursor-pointer" variant="destructive" onClick={() => form.setData('rows', [])}>
                            <Trash2 className="size-4" />
                            Clear all
                        </Button>
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e6e9df] bg-white p-4">
                        <table className="w-full min-w-[1120px] text-sm">
                            <thead className="bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase dark:bg-sidebar-accent">
                                <tr>
                                    <Th>Item</Th>
                                    <Th>Batch</Th>
                                    <Th>Qty</Th>
                                    <Th>Expires</Th>
                                    <Th />
                                </tr>
                            </thead>
                            <tbody>
                                {form.data.rows.map((row, index) => (
                                    <tr key={`${row.item_id ?? 'new'}-${row.batch_id ?? index}`} className="border-t border-[#eef0e8] dark:border-sidebar-border">
                                        <Td>{row.name || '—'}</Td>
                                        <Td>{row.batch_code || '—'}</Td>
                                        <Td>{row.quantity}</Td>
                                        <Td>{row.expires_at || '—'}</Td>
                                        <Td>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(index)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function InputField({ label, type = 'text', value, onChange }: { label: string; type?: 'text' | 'number' | 'date'; value: string; onChange: (value: string) => void }) {
    return (
        <label className="space-y-2 text-sm text-[#17201b]">
            <span className="font-medium">{label}</span>
            <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full" />
        </label>
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

function StatusBadge({ row, totalQuantity, isLowStock }: { row: InventoryRow; totalQuantity: number; isLowStock: boolean }) {
    if (isLowStock) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#d8212c] px-2.5 py-1 text-xs font-semibold text-white">
                <AlertTriangle className="size-3.5" />
                Low stock ({totalQuantity})
            </span>
        );
    }
    if (row.expiry_status === 'expired') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#4d0d12] px-2.5 py-1 text-xs font-semibold text-white">
                <CalendarClock className="size-3.5" />
                Expired
            </span>
        );
    }
    if (row.expiry_status === 'soon') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#fff0b8] px-2.5 py-1 text-xs font-semibold text-[#6f5100]">
                <CalendarClock className="size-3.5" />
                Expires soon
            </span>
        );
    }
    return <span className="inline-flex rounded-md bg-[#e8f4e8] px-2.5 py-1 text-xs font-semibold text-[#1d4f36]">Healthy</span>;
}

function Th({ children }: { children?: React.ReactNode }) {
    return <th className="px-3 py-3">{children}</th>;
}

function Td({ children }: { children?: React.ReactNode }) {
    return <td className="align-top px-3 py-3">{children}</td>;
}