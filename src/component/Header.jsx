"use client";

import { Menu } from "lucide-react";

export default function Header({ onMenuClick }) {
    return (
        <header className="h-14 sm:h-16 bg-white border-b flex items-center px-3 sm:px-4 md:px-6 gap-3">

            {/* MENU BUTTON (hidden on desktop) */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
                <Menu size={20} />
            </button>

            <h1 className="text-base sm:text-lg font-semibold truncate">
                Dashboard
            </h1>

            <div className="ml-auto">
                {/* profile / logout later */}
            </div>

        </header>
    );
}
