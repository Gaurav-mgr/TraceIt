import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, PiggyBank, ReceiptText, Save, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

type RecordType = 'saving' | 'spending';

type MoneyRecordRow = {
    id: number | null;
    title: string;
    category: string;
    amount: number;
    recorded_at: string;
    notes: string;
};

type MoneyRecordProps = {
    recordType: RecordType;
    records: MoneyRecordRow[];
    summary: {
        entries: number;
        total: number;
        today: number;
        categories: number;
    };
};

type RowErrors = {
    title?: string;
    amount?: string;
    recorded_at?: string;
};

type SectionKey = 'overview' | 'create' | 'update' | 'delete';

const emptyRow = (): MoneyRecordRow => ({
    id: null,
    title: '',
    category: '',
    amount: 0,
    recorded_at: new Date().toISOString().slice(0, 10),
    notes: '',
});

const money = (value: number) =>
    `रु ${new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value||0))}`;

export default function MoneyRecords({ recordType, records }: MoneyRecordProps) {
    const isSaving = recordType === 'saving';
    const pageTitle = isSaving ? 'Savings' : 'Spendings';
    const initialRows = records.length > 0 ? records : [emptyRow()];
    const form = useForm<{ rows: MoneyRecordRow[] }>({ rows: initialRows });
    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [newRow, setNewRow] = useState<MoneyRecordRow>(emptyRow());

    const breadcrumbs: BreadcrumbItem[] = [{ title: pageTitle, url: isSaving ? '/savings' : '/spendings' }];

    const liveSummary = useMemo(() => {
        const validRows = form.data.rows.filter((row) => row.title.trim() !== '' || Number(row.amount) > 0);
        const categories = new Set(validRows.map((row) => row.category.trim()).filter(Boolean));

        return {
            entries: validRows.length,
            total: validRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
            today: validRows
                .filter((row) => row.recorded_at === new Date().toISOString().slice(0, 10))
                .reduce((sum, row) => sum + Number(row.amount || 0), 0),
            categories: categories.size,
        };
    }, [form.data.rows]);

    const setRow = (index: number, field: keyof MoneyRecordRow, value: string | number) => {
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

    const updateNewRow = (field: keyof MoneyRecordRow, value: string | number) => {
        setNewRow((current) => ({ ...current, [field]: value }));
    };

    const createNewRow = (event: FormEvent) => {
        event.preventDefault();
        form.setData('rows', [...form.data.rows.filter((row) => row.title.trim() !== '' || Number(row.amount) > 0), newRow]);
        setNewRow(emptyRow());
        setActiveSection('update');
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(route('money.bulk-update', { type: recordType }), {
            preserveScroll: true,
        });
    };

    const bg = pageTitle == 'Savings' ? 'bg-[#edf8ed]' : "bg-[#fdf4f4]";

    const border = pageTitle == "Savings" ? "border-[#1d4f36]/20" : "border-[#ff0000]/15";
    const moneyColor = pageTitle == "Savings" ? 'text-[#1d4f36]' : 'text-red-800';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="mt-6 grid grid-cols-2 gap-3 px-6 pb-5 sm:grid-cols-3">
                <div className={`md:col-span-3 flex items-center ${bg} justify-between rounded-lg border-b ${border} p-4 shadow-sm dark:border-sidebar-border dark:bg-sidebar`}>
                    <span className={`text-[16px] text-black uppercase`}>Total {pageTitle}:</span>
                    <h1 className={`text-3xl font-bold ${moneyColor}`}>{money(liveSummary.total)}</h1>
                </div>
                <Metric label="Entries" value={liveSummary.entries} />
                <Metric label="Today" value={money(liveSummary.today)} tone={isSaving ? 'positive' : 'warning'} />
                <Metric label="Categories" value={liveSummary.categories} />
            </div>

            <div className="dark:border-sidebar-border flex flex-wrap gap-2 border-b border-[#e6e9df] bg-[#f7f8f3] p-4">
                {(['overview', 'create', 'update', 'delete'] as SectionKey[]).map((section) => (
                    <button
                        key={section}
                        type="button"
                        onClick={() => setActiveSection(section)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                            activeSection === section ? 'bg-[#1c2721] text-white' : 'bg-white text-[#17201b] shadow-sm'
                        }`}
                    >
                        {section === 'overview' ? 'Overview' : section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </div>

            {activeSection === 'overview' && (
                <div className="p-6">
                    <h2 className="text-lg font-semibold">{pageTitle} overview</h2>
                    <p className="mt-2 text-sm text-[#5b665d]">
                        Review daily {isSaving ? 'saving deposits' : 'expense records'} with category, amount, date, and details.
                    </p>

                    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e6e9df] bg-white p-4">
                        <table className="w-full min-w-[980px] text-sm">
                            <thead className="dark:bg-sidebar-accent bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase">
                                <tr>
                                    <Th>Details</Th>
                                    <Th>Category</Th>
                                    <Th>Amount</Th>
                                    <Th>Date</Th>
                                    <Th>Notes</Th>
                                    <Th>Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.data.rows.map((row, index) => (
                                    <tr key={`${row.id ?? 'new'}-${index}`} className="dark:border-sidebar-border border-t border-[#eef0e8]">
                                        <Td>{row.title || '-'}</Td>
                                        <Td>{row.category || '-'}</Td>
                                        <Td>{money(row.amount)}</Td>
                                        <Td>{row.recorded_at || '-'}</Td>
                                        <Td>{row.notes || '-'}</Td>
                                        <Td>
                                            <StatusBadge isSaving={isSaving} />
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSection === 'create' && (
                <form onSubmit={createNewRow} className="space-y-6 p-6">
                    <div>
                        <h2 className="text-lg font-semibold">Add new {isSaving ? 'saving' : 'spending'}</h2>
                        <p className="mt-2 text-sm text-[#5b665d]">
                            Create a daily {isSaving ? 'saving record' : 'expense record'} and add it to the dashboard.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="Details" value={newRow.title} onChange={(value) => updateNewRow('title', value)} />
                        <InputField
                            label="Category"
                            value={newRow.category}
                            onChange={(value) => updateNewRow('category', value)}
                            placeholder={isSaving ? 'Salary, bonus, gift' : 'Grocery, stationery, transport'}
                        />
                        <InputField
                            label="Amount"
                            type="number"
                            value={String(newRow.amount)}
                            onChange={(value) => updateNewRow('amount', Number(value))}
                        />
                        <InputField label="Date" type="date" value={newRow.recorded_at} onChange={(value) => updateNewRow('recorded_at', value)} />
                        <InputField label="Notes" value={newRow.notes} onChange={(value) => updateNewRow('notes', value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="submit" className="cursor-pointer bg-[#1d4f36] hover:bg-[#20342a]">
                            Add {isSaving ? 'saving' : 'spending'}
                        </Button>
                        <Button
                            type="button"
                            className="cursor-pointer hover:border-red-400 hover:bg-red-100 hover:text-red-600"
                            variant="outline"
                            onClick={() => setNewRow(emptyRow())}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            )}

            {activeSection === 'update' && (
                <form onSubmit={submit} className="p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Update {pageTitle.toLowerCase()}</h2>
                            <p className="mt-2 text-sm text-[#5b665d]">Edit details, categories, amounts, and dates before saving changes.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                className="cursor-pointer transition-all duration-300 hover:border-[#1d4f36] hover:text-[#1d4f36]"
                                variant="outline"
                                onClick={addRow}
                            >
                                Add row
                            </Button>
                            <Button type="submit" className="cursor-pointer bg-[#1d4f36] hover:bg-[#20342a]" disabled={form.processing}>
                                {form.recentlySuccessful ? <Check className="size-4" /> : <Save className="size-4" />}
                                {form.processing ? 'Saving' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                    <EditableTable rows={form.data.rows} formErrors={form.errors} setRow={setRow} removeRow={removeRow} />
                </form>
            )}

            {activeSection === 'delete' && (
                <form onSubmit={submit} className="p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Delete {pageTitle.toLowerCase()} entries</h2>
                            <p className="mt-2 text-sm text-[#5b665d]">Remove records from the list, then save the remaining entries.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" className="cursor-pointer" variant="destructive" onClick={() => form.setData('rows', [])}>
                                <Trash2 className="size-4" />
                                Clear all
                            </Button>
                            <Button type="submit" className="cursor-pointer bg-[#1d4f36] hover:bg-[#20342a]" disabled={form.processing}>
                                <Save className="size-4" />
                                Save changes
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e6e9df] bg-white p-4">
                        <table className="w-full min-w-[860px] text-sm">
                            <thead className="dark:bg-sidebar-accent bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase">
                                <tr>
                                    <Th>Details</Th>
                                    <Th>Category</Th>
                                    <Th>Amount</Th>
                                    <Th>Date</Th>
                                    <Th />
                                </tr>
                            </thead>
                            <tbody>
                                {form.data.rows.map((row, index) => (
                                    <tr key={`${row.id ?? 'new'}-${index}`} className="dark:border-sidebar-border border-t border-[#eef0e8]">
                                        <Td>{row.title || '-'}</Td>
                                        <Td>{row.category || '-'}</Td>
                                        <Td>{money(row.amount)}</Td>
                                        <Td>{row.recorded_at || '-'}</Td>
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
                </form>
            )}
        </AppLayout>
    );
}

function EditableTable({
    rows,
    formErrors,
    setRow,
    removeRow,
}: {
    rows: MoneyRecordRow[];
    formErrors: Partial<Record<string, string>>;
    setRow: (index: number, field: keyof MoneyRecordRow, value: string | number) => void;
    removeRow: (index: number) => void;
}) {
    return (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white border border-[#dfe3d6] p-4">
            <table className="w-full min-w-[1120px] border-collapse text-sm">
                <thead className="dark:bg-sidebar-accent bg-[#f5f7ef] text-left text-xs font-semibold tracking-wide text-[#566155] uppercase">
                    <tr>
                        <Th>Details</Th>
                        <Th>Category</Th>
                        <Th>Amount</Th>
                        <Th>Date</Th>
                        <Th>Notes</Th>
                        <Th />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const rowErrors: RowErrors = {
                            title: formErrors[`rows.${index}.title`],
                            amount: formErrors[`rows.${index}.amount`],
                            recorded_at: formErrors[`rows.${index}.recorded_at`],
                        };

                        return (
                            <tr key={`${row.id ?? 'new'}-${index}`} className="dark:border-sidebar-border border-t border-[#eef0e8]">
                                <Td>
                                    <Input
                                        value={row.title}
                                        onChange={(event) => setRow(index, 'title', event.target.value)}
                                        placeholder="Grocery run"
                                    />
                                    <InputError message={rowErrors.title} className="mt-1" />
                                </Td>
                                <Td>
                                    <Input
                                        value={row.category}
                                        onChange={(event) => setRow(index, 'category', event.target.value)}
                                        placeholder="Grocery"
                                    />
                                </Td>
                                <Td>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={row.amount}
                                        onChange={(event) => setRow(index, 'amount', Number(event.target.value))}
                                    />
                                    <InputError message={rowErrors.amount} className="mt-1" />
                                </Td>
                                <Td>
                                    <Input
                                        type="date"
                                        value={row.recorded_at}
                                        onChange={(event) => setRow(index, 'recorded_at', event.target.value)}
                                    />
                                    <InputError message={rowErrors.recorded_at} className="mt-1" />
                                </Td>
                                <Td>
                                    <Input
                                        value={row.notes}
                                        onChange={(event) => setRow(index, 'notes', event.target.value)}
                                        placeholder="Optional note"
                                    />
                                </Td>
                                <Td>
                                    {!row.id || rows.length > 1 ? (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(index)} aria-label="Remove row">
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
    );
}

function InputField({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
}: {
    label: string;
    type?: 'text' | 'number' | 'date';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="space-y-2 text-sm text-[#17201b]">
            <span className="font-medium">{label}</span>
            <Input
                type={type}
                step={type === 'number' ? '0.01' : undefined}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full"
            />
        </label>
    );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string | number; tone?: 'neutral' | 'positive' | 'warning' }) {
    const toneClass =
        tone === 'positive'
            ? 'border-[#cce8cd] bg-[#edf8ed] text-[#1d4f36]'
            : tone === 'warning'
              ? 'border-[#ff0000]/10 bg-[#fdf4f4] text-red-800'
              : 'border-[#dfe3d6] bg-white text-[#17201b]';

    return (
        <div className={`dark:border-sidebar-border dark:bg-sidebar rounded-lg border p-3 shadow-sm flex flex-col justify-center ${toneClass}`}>
            <p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p>
            <p className="text-[22px] font-semibold">{value}</p>
        </div>
    );
}

function StatusBadge({ isSaving }: { isSaving: boolean }) {
    if (isSaving) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f4e8] px-2.5 py-1 text-xs font-semibold text-[#1d4f36]">
                <PiggyBank className="size-3.5" />
                Saved
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#fdf4f4] px-2.5 py-1 text-xs font-semibold text-red-800">
            <ReceiptText className="size-3.5" />
            Spent
        </span>
    );
}

function Th({ children }: { children?: React.ReactNode }) {
    return <th className="px-3 py-3">{children}</th>;
}

function Td({ children }: { children?: React.ReactNode }) {
    return <td className="px-3 py-3 align-top">{children}</td>;
}
