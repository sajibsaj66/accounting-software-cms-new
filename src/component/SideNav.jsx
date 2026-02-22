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
    Settings
} from "lucide-react";

const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/customer", icon: Users },
    { label: "Sales Visits", href: "/sales-visits", icon: CalendarCheck },
    { label: "Follow-ups", href: "/follow-up", icon: PhoneCall },
    // { label: "Orders / PO", href: "/orders-po", icon: ShoppingCart },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Reports", href: "/reports", icon: BarChart3 }
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <aside className="h-screen w-64 bg-white border-r flex flex-col">

            {/* LOGO */}
            <div className="h-16 flex items-center px-6 border-b">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <span className="font-semibold text-lg">CRM Pro</span>
                </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 px-3 py-4 space-y-1">
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
            <div className="px-3 py-4 border-t">
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
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
