"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email and password required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signin2`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                // ✅ Save token in cookie
                document.cookie = `token=${data.token}; path=/`;

                // ✅ Redirect properly
                window.location.href = "/dashboard";
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
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
                <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="admin@demo.com"
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                {/* LOGIN BUTTON */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </div>
        </div>
    );
}
