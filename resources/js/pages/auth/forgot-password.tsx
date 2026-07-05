// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle,Boxes } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import {Link} from "@inertiajs/react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <nav className="fixed inset-x-0 top-1 z-30 mx-auto flex max-w-[1700px] items-center justify-between px-6 py-5 lg:px-8 bg-[#17201b]/95 backdrop-blur-xl text-white rounded-b-[20px] shadow-2xl shadow-black/10">
                <Link href={route('home')} className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#1d4f36] text-white">
                        <Boxes className="size-5" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">TraceIt</span>
                </Link>
            </nav>

            <div className=" min-h-screen bg-[#f7f7f2] flex items-center justify-center">
                <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
                    <Head title="Forgot password" />

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                    <div className="space-y-6">
                        <form onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start ">
                                <Button className="w-full bg-[#1d4f36] hover:bg-[#173f2b] cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Email password reset link
                                </Button>
                            </div>
                        </form>

                        <div className="text-muted-foreground space-x-1 text-center text-sm">
                            <span>Or, return to</span>
                            <TextLink href={route('login')}>log in</TextLink>
                        </div>
                    </div>
                </AuthLayout>
            </div>
        </>
    );
}
