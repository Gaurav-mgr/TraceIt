import {Link} from "@inertiajs/react";
import TraceItLogo from '../../../public/traceitLogo.png'

export default function AppLogo() {
    return (
        <>
            <div className="ml-1 grid flex-1 text-left text-sm">
                {/* logo */}
                <Link href={route('dashboard')} className=" h-full w-[90px]">
                    <img src={TraceItLogo} alt="logo" />
                </Link>
            </div>
        </>
    );
}
