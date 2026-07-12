import { Head, Link } from '@inertiajs/react';

import BgLoginImage from '../../../../public/loginimage.png';
import BgRegisterImage from "../../../../public/signupimage.png"
import TraceItLogoColor from "../../../../public/traceitLogoColor.png";
import "../../../css/app.css"


interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const image = title == "Log in to your account" ? BgLoginImage : BgRegisterImage;

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
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                </div>
            </div>
        </div>
    );
}
