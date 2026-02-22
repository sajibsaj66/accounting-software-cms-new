"use client";

import { useState } from "react";
import Header from "@/component/Header";
import SideNav from "@/component/SideNav";

export default function ClientLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">

            {/* OVERLAY (phone + tablet) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR DRAWER */}
            <div
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:z-auto
        `}
            >
                <SideNav closeSidebar={() => setSidebarOpen(false)} />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex flex-col flex-1 min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}
