"use client";

import { LogOut, Menu } from "lucide-react";
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
                <button
                    onClick={() => logout()}
                    className="inline-flex items-center gap-2 py-2 px-4 cursor-pointer border border-red-200 bg-red-600 text-white rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors"
                >
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>

        </header>
    );
}
