import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Boxes } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import {Link} from "@inertiajs/react";

type ResetPasswordProps = {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
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
                <AuthLayout title="Reset password" description="Please enter your new password below">
                    <Head title="Reset password" />

                    <form onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-4 w-full bg-[#1d4f36] hover:bg-[#173f2b] cursor-pointer" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Reset password
                            </Button>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </>
    );
}
