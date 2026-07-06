import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, LogIn, PiggyBank, ReceiptText, ScanLine, ShieldCheck, TrendingUp } from 'lucide-react';
import { route } from 'ziggy-js';

import TraceItLogo from "../../../public/traceitLogo.png";
import TraceItLogoColor from "../../../public/traceitLogoColor.png";
import "../../css/app.css";


type SharedProps = {
    auth: {
        user?: {
            id: number;
            name: string;
        };
    };
};

const demoRows = [
    { detail: 'Groceries', category: 'Grocery', amount: 'रु 42.80', date: 'Today', status: 'Spent' },
    { detail: 'Salary reserve', category: 'Savings', amount: 'रु 350.00', date: 'Today', status: 'Saved' },
    { detail: 'Notebook set', category: 'Stationery', amount: 'रु 18.25', date: 'Yesterday', status: 'Spent' },
];

export default function Welcome() {
    const { auth } = usePage<SharedProps>().props;
    const dashboardHref = auth.user ? route('dashboard') : route('login');

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-6');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="TraceIt" />

            <div className="trackit-preloader" aria-hidden="true">
                <div className="trackit-preloader__panel trackit-preloader__panel--up" />
                <div className="trackit-preloader__mark">
                    <img src={TraceItLogo} width="100px" alt='TraceIt Logo' />
                </div>
            </div>

            <main className="min-h-screen bg-[#f7f7f2] text-[#17201b] pt-24 lg:pt-28">
                <nav className="fixed inset-x-0 top-0 z-30 mx-auto flex max-w-[1700px] items-center justify-between px-6 py-5 lg:px-8 bg-[#1c2721] backdrop-blur-xl text-white rounded-b-[20px] shadow-xl shadow-[#17201b]/45">
                        {/* logo */}
                        <Link href={route('home')} className=" h-full w-[110px]">
                            <img src={TraceItLogo} alt="logo" />
                        </Link>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 rounded-md bg-[#17201b] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#26342c]"
                                >
                                    Dashboard
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        <LogIn className="size-4" />
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#1d4f36] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#173f2b]"
                                    >
                                        Sign up
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                <section className="relative mt-[-20px] z-10 isolate min-h-screen overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(247,247,242,0.96)_0%,rgba(247,247,242,0.84)_42%,rgba(247,247,242,0.14)_100%)]" />


                    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-[1600px] items-center gap-10 px-6 pb-16 pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
                        

                        {/* left side */}
                        <div className="mx-auto flex max-w-2xl flex-col items-start gap-10 lg:mx-0">

                            <div className="w-full" id="title-container">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#d6dbc8] bg-white/75 px-3 py-2 text-sm font-medium text-[#1d4f36] shadow-sm backdrop-blur">
                                    <ShieldCheck className="size-4" />
                                    Personal savings and spending tracking for everyday money
                                </div>
                                <h1 className="max-w-3xl text-5xl leading-[0.95] font-semibold tracking-tight text-[#142019] sm:text-6xl lg:text-8xl">
                                    TraceIt
                                </h1>
                                <p className="mt-6 w-full text-lg leading-7 text-[#465149]">
                                    Record daily expenses and savings, then see where your money goes across days, weeks, months, and years.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href={dashboardHref}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#1d4f36] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d4f36]/20 transition hover:bg-[#173f2b]"
                                    >
                                        Start tracking
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <a
                                        href="#preview"
                                        className="inline-flex items-center gap-2 rounded-md border border-[#cbd2bd] bg-white/70 px-5 py-3 text-sm font-semibold text-[#17201b] backdrop-blur transition hover:bg-white"
                                    >
                                        <ScanLine className="size-4" />
                                        View workflow
                                    </a>
                                </div>
                            </div>

                            <div id="preview" className="w-full">
                                <div className="rounded-lg border border-white/70 bg-white/84 p-4 shadow-2xl shadow-[#17201b]/15 backdrop-blur-md">
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-md bg-[#f0f6ef] p-4">
                                            <PiggyBank className="mb-3 size-5 text-[#1d4f36]" />
                                            <p className="text-2xl font-semibold">रु 1.2k</p>
                                            <p className="text-sm text-[#5b665d]">saved this month</p>
                                        </div>
                                        <div className="rounded-md bg-[#fff8df] p-4">
                                            <ReceiptText className="mb-3 size-5 text-[#997000]" />
                                            <p className="text-2xl font-semibold text-[#6f5100]">रु 286</p>
                                            <p className="text-sm text-[#675d3c]">spent this week</p>
                                        </div>
                                        <div className="rounded-md bg-[#eef7ff] p-4">
                                            <TrendingUp className="mb-3 size-5 text-[#315f9f]" />
                                            <p className="text-2xl font-semibold">रु 914</p>
                                            <p className="text-sm text-[#4d5e72]">net balance</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 overflow-hidden rounded-md border border-[#e1e4d8] bg-white">
                                        {demoRows.map((row) => (
                                            <div key={`${row.detail}-${row.date}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#edf0e7] p-4 last:border-b-0 sm:grid-cols-[1.2fr_0.9fr_0.7fr_0.7fr_0.7fr]">
                                                <p className="font-medium">{row.detail}</p>
                                                <p className="hidden text-[#5b665d] sm:block">{row.category}</p>
                                                <p className="text-right font-semibold sm:text-left">{row.amount}</p>
                                                <p className="hidden text-[#5b665d] sm:block">{row.date}</p>
                                                <p className={row.status === 'Spent' ? 'font-semibold text-[#c87900]' : 'text-[#1d4f36]'}>
                                                    {row.status}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col w-full gap-4 lg:h-full" id="image-container">
                            <section
                                className="sm:hidden flex h-[50px] w-full items-center justify-center rounded-lg bg-[#f7f7f2] shadow-xl shadow-[#17201b]/10 border border-[#17201b]/5"
                            >
                                <span className="font-bold text-[#17201b] tracking-wider text-sm uppercase">
                                    TraceIt
                                </span>
                            </section>

                            <section
                                className="relative flex-1 overflow-hidden rounded-[30px] bg-[#f7f7f2] shadow-2xl shadow-[#17201b]/15 backdrop-blur-md"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1800&q=85')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#07110d]/85 via-transparent to-transparent" />
                                <div className="absolute inset-x-0 bottom-0">
                                    <div className="w-full rounded-2xl bg-black/20 p-5 shadow-lg shadow-black/20 backdrop-blur-sm">
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/90">Money pulse</p>
                                        <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">Keep savings growing and spending visible.</h2>
                                        <p className="mt-3 mb-3 text-sm leading-6 text-white/75">
                                            See daily records, category totals, and long-term trends from one polished dashboard.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>

                <section id="features" data-scroll-reveal className="relative z-20 opacity-0 translate-y-6 transition-all duration-700 ease-out mx-auto w-[1600px] px-6 py-16 lg:px-8 -mt-16 lg:-mt-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="text-sm uppercase tracking-[0.24em] text-[#1d4f36]/80">Built for personal money clarity</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#142019] sm:text-4xl">Everything you need to understand savings and spendings.</h2>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <div data-scroll-reveal className="opacity-0 translate-y-6 transition-all duration-2000 ease-out rounded-[28px] border border-[#e7eadc] bg-white p-7 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff9ef] text-[#1c4d33]">
                                <BarChart3 className="size-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-[#142019]">Clear money insights</h3>
                            <p className="mt-3 text-sm leading-6 text-[#5b665d]">
                                Track savings and expenses by category so everyday decisions are easier to understand.
                            </p>
                        </div>

                        <div data-scroll-reveal className="opacity-0 translate-y-6 transition-all duration-2000 ease-out rounded-[28px] border border-[#e7eadc] bg-white p-7 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5e2] text-[#8f6a02]">
                                <ReceiptText className="size-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-[#142019]">Daily expense records</h3>
                            <p className="mt-3 text-sm leading-6 text-[#5b665d]">
                                Log grocery, stationery, transport, and other spending with details that stay easy to edit.
                            </p>
                        </div>

                        <div data-scroll-reveal className="opacity-0 translate-y-6 transition-all duration-700 ease-out rounded-[28px] border border-[#e7eadc] bg-white p-7 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f4ff] text-[#1d4f36]">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-[#142019]">Simple saving workflows</h3>
                            <p className="mt-3 text-sm leading-6 text-[#5b665d]">
                                Capture income, deposits, gifts, or planned savings and compare them against spendings over time.
                            </p>
                        </div>
                    </div>
                </section>

                <section data-scroll-reveal className="relative z-20 opacity-0 translate-y-6 transition-all duration-2000 ease-out mx-auto w-[1600px] px-6 py-16 lg:px-8 -mt-12 lg:-mt-16">
                    <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <div className="rounded-[30px] border border-[#dfe2d5] bg-white p-10 shadow-sm">
                            <span className="inline-flex rounded-full bg-[#e8f4e8] px-4 py-2 text-sm font-semibold text-[#1d4f36]">How it works</span>
                            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#142019] sm:text-4xl">Track, compare, and plan with confidence.</h2>
                            <p className="mt-5 text-base leading-7 text-[#465149]">
                                Use TraceIt to capture daily money details, monitor trends, and keep savings goals in view.
                            </p>
                            <div className="mt-10 space-y-6">
                                <div className="rounded-3xl border border-[#e7eadc] bg-[#f8faf6] p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">1. Add savings quickly</p>
                                    <p className="mt-2 text-sm leading-6 text-[#5b665d]">Log income, deposits, and saved amounts with category, amount, date, and notes.</p>
                                </div>
                                <div className="rounded-3xl border border-[#e7eadc] bg-[#fff9ec] p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f6a02]/80">2. Record spendings</p>
                                    <p className="mt-2 text-sm leading-6 text-[#5b665d]">Track grocery, stationery, bills, transport, and other expenses as they happen.</p>
                                </div>
                                <div className="rounded-3xl border border-[#e7eadc] bg-[#eef7ff] p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">3. Review trends</p>
                                    <p className="mt-2 text-sm leading-6 text-[#5b665d]">Compare your day, week, month, and year to understand your net balance.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-[30px] bg-[#1d4f36] p-8 text-white shadow-lg shadow-[#17201b]/10">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b7d8b1]">Save more</p>
                                <h3 className="mt-4 text-2xl font-semibold">Build stronger saving habits.</h3>
                                <p className="mt-3 text-sm leading-6 text-[#d2e9c8]">See the gap between what you save and what you spend before it gets blurry.</p>
                            </div>
                            <div className="rounded-[30px] bg-[#f3f7f0] p-8 text-[#142019] shadow-lg shadow-[#17201b]/5">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4f6f55]">Stay organized</p>
                                <h3 className="mt-4 text-2xl font-semibold">Give your money a single source of truth.</h3>
                                <p className="mt-3 text-sm leading-6 text-[#465149]">Shift from scattered notes and guesses to a focused personal money process.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section data-scroll-reveal className="relative z-20 opacity-0 translate-y-6 transition-all duration-2000 ease-out mx-auto w-[1600px] px-6 py-16 lg:px-8 -mt-12 lg:-mt-16">
                    <div className="rounded-[30px] border border-[#dfe2d5] bg-[#f7f7f2] p-10 shadow-sm">
                        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                            <div>
                                <span className="inline-flex rounded-full bg-[#d5eed4] px-4 py-2 text-sm font-semibold text-[#1d4f36]">Trusted workflow</span>
                                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#142019] sm:text-4xl">Designed for retail, cafés, and home kitchens.</h2>
                                <p className="mt-5 text-base leading-7 text-[#465149]">
                                    TraceIt helps every kind of stock manager see what’s on hand, what’s expiring, and what to reorder—without complex spreadsheets.
                                </p>
                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                                        <p className="text-3xl font-semibold text-[#1d4f36]">85%</p>
                                        <p className="mt-2 text-sm text-[#5b665d]">Fewer expired products</p>
                                    </div>
                                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                                        <p className="text-3xl font-semibold text-[#1d4f36]">2x</p>
                                        <p className="mt-2 text-sm text-[#5b665d]">Faster stock checks</p>
                                    </div>
                                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                                        <p className="text-3xl font-semibold text-[#1d4f36]">100%</p>
                                        <p className="mt-2 text-sm text-[#5b665d]">Ready for teams of any size</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-[30px] bg-[#e2f1e3] p-8 text-[#142019] shadow-lg shadow-[#17201b]/10">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">Easy setup</p>
                                <h3 className="mt-4 text-2xl font-semibold">Get started without a steep learning curve.</h3>
                                <p className="mt-3 text-sm leading-6 text-[#425147]">A streamlined onboarding flow means your team can begin logging stock and receiving alerts in just a few minutes.</p>
                                <div className="mt-6 space-y-4 text-sm text-[#465149]">
                                    <p>• Add products and batches instantly.</p>
                                    <p>• Set expiration reminders and priority rules.</p>
                                    <p>• Monitor inventory health from one dashboard.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer id="About" className="border-t border-[#dfe2d5] bg-[#eef1e8] text-[#17201b]">
                    <div className="mx-auto flex flex-col gap-10 px-6 py-14 lg:flex-row lg:items-start lg:justify-between lg:px-8">
                        <div className="max-w-xl">
                            <a href="#About" className="inline-flex items-center gap-3 text-lg font-semibold text-[#142019]">
                                <img src={TraceItLogoColor} width="25%" alt="TraceIt Logo" />
                            </a>
                            <p className="mt-5 max-w-lg text-sm leading-6 text-[#465149]">
                                An inventory and expiry tracking tool crafted to help shops, cafés, and kitchens keep stock lean, fresh, and profitable.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">Product</h3>
                                <ul className="mt-5 space-y-3 text-sm">
                                    <li><Link href={route('login')} className="transition hover:text-[#1d4f36]">Login</Link></li>
                                    <li><Link href={route('register')} className="transition hover:text-[#1d4f36]">Sign up</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">Resources</h3>
                                <ul className="mt-5 space-y-3 text-sm">
                                    <li><a href="#preview" className="transition hover:text-[#1d4f36]">Workflow preview</a></li>
                                    <li><a href="#features" className="transition hover:text-[#1d4f36]">Benefits</a></li>
                                    <li><a href="#About" className="transition hover:text-[#1d4f36]">About</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d4f36]/80">Contact</h3>
                                <ul className="mt-5 space-y-3 text-sm">
                                    <li>support@traceit.app</li>
                                    <li>+1 (555) 123-4567</li>
                                    <li>123 Inventory Ave, Suite 200</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#dfe2d5] px-6 py-5 text-center text-sm text-[#5b665d] lg:px-8">
                        © 2026 TraceIt. Designed for better stock control and fewer surprises at checkout.
                    </div>
                </footer>
            </main>
        </>
    );
}
