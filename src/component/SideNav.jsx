"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    PhoneCall,
    ShoppingCart,
    CreditCard,
    BarChart3,
    Settings,
    NotebookTabs
} from "lucide-react";


const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/customer", icon: Users },
    { label: "Quotation", href: "/quotation", icon: NotebookTabs },
    { label: "Sales Visits", href: "/sales-visits", icon: CalendarCheck },
    { label: "Follow-ups", href: "/follow-up", icon: PhoneCall }
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-64 bg-[#f7f8fb] border-r border-zinc-200 flex flex-col">

            {/* LOGO */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-200">
                <span className="font-semibold text-[28px] leading-none text-zinc-800">Salis ERP</span>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-3 py-4 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <NavItem
                            key={item.href}
                            href={item.href}
                            icon={<Icon size={18} />}
                            label={item.label}
                            active={isActive}
                        />
                    );
                })}
            </nav>

            {/* SETTINGS */}
            <div className="px-3 py-4 border-t border-zinc-200">
                <NavItem
                    href="/settings"
                    icon={<Settings size={18} />}
                    label="Settings"
                    active={pathname.startsWith("/settings")}
                />
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
        ${active
                    ? "bg-blue-100/60 text-blue-600 font-medium"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
