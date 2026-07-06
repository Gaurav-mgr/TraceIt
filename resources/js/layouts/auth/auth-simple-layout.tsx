import { Link } from '@inertiajs/react';

import BgImage from '../../../../public/loginimage.png';
import TraceItLogoColor from "../../../../public/traceitLogoColor.png";


interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background flex w-full max-w-[1100px] flex-col items-stretch justify-center gap-6 rounded-lg shadow-2xl shadow-[#17201b]/15 backdrop-blur-md p-6 md:p-10 md:flex-row">
            {/* left side - login form */}
            <div id="login-container" className="flex w-full flex-col items-center justify-center gap-6 rounded-[28px] bg-white/90 p-6 md:w-1/2 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-13">
                        <div className="flex flex-col items-center gap-5">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium w-[110px]">
                                <img src={TraceItLogoColor} alt="TraceIt logo" />
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-muted-foreground text-center text-sm">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* right side - image container */}
            <div className="h-[70vh] w-full md:w-1/2 ">
                <div
                    className="relative h-full overflow-hidden rounded-[10px] bg-[#f7f7f2] shadow-2xl shadow-[#17201b]/15 backdrop-blur-md border-l border-[#17201b]/15"
                    style={{
                        backgroundImage: `url(${BgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#07110d]/85 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0">
                        <div className="w-full rounded-2xl bg-black/20 p-5 shadow-lg shadow-black/20 backdrop-blur-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/90">Inventory pulse</p>
                            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">Keep every item visible, fresh, and ready to sell.</h2>
                            <p className="mt-3 mb-6 text-sm leading-6 text-white/75">
                                See stock levels, expirations, and batch status at a glance—from one polished dashboard.
                            </p>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
}
