"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Header({ onMenuClick }) {
    const { logout } = useAuth();
    const pathname = usePathname();
    const pageTitle = pathname?.split("/").filter(Boolean).pop() || "Dashboard";
    const title = pageTitle
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

    return (
        <header className="h-14 sm:h-16 bg-[#f7f8fb] border-b border-zinc-200 flex items-center px-3 sm:px-4 md:px-6 gap-3">

            {/* MENU BUTTON (hidden on desktop) */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
                <Menu size={20} />
            </button>

            <h1 className="text-base sm:text-[40px] leading-none font-semibold text-zinc-800 truncate">
                {title}
            </h1>

            <div className="ml-auto flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-300 bg-white min-w-[250px]">
                    <Search size={16} className="text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 outline-none"
                    />
                </div>
                <button className="h-9 w-9 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50">
                    <Bell size={16} />
                </button>
                <div className="h-9 w-9 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                    JD
                </div>
                <button
                    onClick={() => logout()}
                    className="py-2 px-3 cursor-pointer border border-zinc-300 bg-white text-zinc-700 rounded-lg hover:bg-zinc-100"
                >
                    logout
                </button>
            </div>

        </header>
    );
}
