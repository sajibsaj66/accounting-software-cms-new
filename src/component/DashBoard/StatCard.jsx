import { Users, Briefcase, Calendar, DollarSign } from "lucide-react";

export default function StatCard({ visits = [], totalCustomers, totalQuotations = 0 }) {
    const safeVisits = Array.isArray(visits) ? visits : [];
    const now = new Date();
    const parseFollowUpDate = (value) => {
        if (!value) return null;
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(year, month - 1, day);
        }
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    // ✅ Total Unique Customers
    const uniqueCustomersFromVisits = [
        ...new Set(safeVisits.map((v) => v.customer_name)),
    ].length;
    const uniqueCustomers = Number.isFinite(totalCustomers)
        ? totalCustomers
        : uniqueCustomersFromVisits;

    // ✅ Total Visits
    const totalVisits = safeVisits.length;

    // ✅ Upcoming Followups
    const upcomingFollowups = safeVisits.filter((v) => {
        const followDate = parseFollowUpDate(v?.next_followup_date);
        if (!followDate) return false;
        const overdueAt = new Date(followDate.getTime() + 24 * 60 * 60 * 1000);
        return now < overdueAt;
    }).length;

    const stats = [
        {
            title: "Total Customers",
            value: uniqueCustomers,
            icon: Users,
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
            trend: "+12%",
            trendColor: "text-emerald-600",
        },
        {
            title: "Total Visits",
            value: totalVisits,
            icon: Briefcase,
            iconBg: "bg-green-100",
            iconText: "text-green-600",
            trend: "+8%",
            trendColor: "text-emerald-600",
        },
        {
            title: "Total Upcoming Follow-ups",
            value: upcomingFollowups,
            icon: Calendar,
            iconBg: "bg-orange-100",
            iconText: "text-orange-600",
            trend: "-5%",
            trendColor: "text-red-500",
        },
        {
            title: "Total Quotation Invoices",
            value: Number.isFinite(totalQuotations) ? totalQuotations : 0,
            icon: DollarSign,
            iconBg: "bg-violet-100",
            iconText: "text-violet-600",
            trend: "+18%",
            trendColor: "text-emerald-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div key={index} className="bg-white border border-zinc-200 rounded-2xl p-6">
                        <div className="flex justify-between items-start">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.iconBg} ${item.iconText}`}>
                                <Icon size={22} />
                            </div>
                            <span className={`text-sm font-medium ${item.trendColor}`}>{item.trend}</span>
                        </div>

                        <h2 className="text-4xl font-bold mt-5 text-zinc-900">
                            {item.value}
                        </h2>

                        <p className="text-sm text-zinc-500 mt-2">
                            {item.title}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
