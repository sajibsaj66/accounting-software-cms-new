"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleLogin = async (data) => {
        const email = data.email;
        const password = data.password;

        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                alert("Login failed. Please check your credentials.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(error?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-zinc-300 bg-white px-11 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <div className="min-h-screen bg-[#eef1f5] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="mx-auto w-full max-w-5xl">
                <div className="grid w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:grid-cols-2">
                    <div className="relative hidden p-10 text-white md:block bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700">
                        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-[1px]" />
                        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-[1px]" />

                        <div className="relative flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl font-bold">
                                C
                            </div>
                            <h1 className="text-4xl font-semibold leading-none">CRM Pro</h1>
                        </div>
                        <p className="relative mt-8 max-w-sm text-base text-blue-100 leading-relaxed">
                            Manage customers, sales visits and follow-ups from one clean dashboard.
                        </p>
                        <div className="relative mt-10 space-y-3 text-sm text-blue-100">
                            <p>Track sales activity in real time</p>
                            <p>Stay on top of follow-up pipelines</p>
                            <p>Keep team updates centralized</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        <div className="mb-8 text-center md:text-left">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white md:mx-0 md:hidden">
                                C
                            </div>
                            <h2 className="text-4xl font-semibold text-zinc-900">Welcome Back</h2>
                            <p className="mt-2 text-sm text-zinc-500">Sign in to continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
                                <div className="relative">
                                    <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Enter a valid email address",
                                            },
                                        })}
                                        className={inputClass}
                                        placeholder="admin@demo.com"
                                    />
                                </div>
                                {errors.email && (
                                    <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
                                <div className="relative">
                                    <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        })}
                                        className={inputClass}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:bg-zinc-100"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Log in"}
                                {!loading && <ArrowRight size={16} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
