"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();



    const {   register,
    handleSubmit,  formState: { errors } } = useForm();

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


    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <div className="w-full max-w-md bg-white rounded-xl border p-8 space-y-6">

                {/* TITLE */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">
                        C
                    </div>
                    <h1 className="text-2xl font-semibold mt-2">CRM Pro</h1>
                    <p className="text-sm text-gray-500">Login to your dashboard</p>
                </div>

                {/* EMAIL */}
                <form onSubmit={handleSubmit(handleLogin)}>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="admin@demo.com"
                    />
                    {errors.email && <span className="text-red-400 text-xs">Email field is required</span>}
                    {/* PASSWORD */}
                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                           {...register("password", { required: true })}
                            className="w-full border rounded-lg px-3 py-2 pr-10 text-sm"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    </div>
                    {errors.password && <span className="text-red-400 text-xs">Password field is required</span>}
                     {/* LOGIN BUTTON */}
                <button
                  type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
                >
              {loading ? "Logging in..." : "Log in"}
                </button>
                </form>

                

               

            </div>
        </div>
    );
}
