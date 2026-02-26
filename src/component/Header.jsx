"use client";

import useAuth from "@/hooks/useAuth";
import { Menu } from "lucide-react";

export default function Header({ onMenuClick }) {

    const { logout} = useAuth();

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
                <button
                onClick={()=> logout()}
                className="py-2 px-3 cursor-pointer border-2 border-white p-2 rounded-lg hover:bg-gray-100"
            >
                    {/* <Menu size={20} /> */}
                    logout
            </button>
            </div>

        </header>
    );
}
