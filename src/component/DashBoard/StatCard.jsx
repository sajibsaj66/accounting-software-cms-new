import { Users, Briefcase, Calendar, DollarSign } from "lucide-react";

export default function StatCard({ visits = [] }) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // ✅ Total Unique Customers
    const uniqueCustomers = [
        ...new Set(visits.map((v) => v.customer_name)),
    ].length;

    // ✅ Total Visits
    const totalVisits = visits.length;

    // ✅ Upcoming Followups
    const upcomingFollowups = visits.filter((v) => {
        if (!v.next_followup_date) return false;
        const followDate = new Date(v.next_followup_date);
        return followDate >= today;
    }).length;

    // ✅ This Month Visit Report
    const thisMonthVisits = visits.filter((v) => {
        const visitDate = new Date(v.visit_date);
        return (
            visitDate.getMonth() === currentMonth &&
            visitDate.getFullYear() === currentYear
        );
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
            title: "Pending Follow-ups",
            value: upcomingFollowups,
            icon: Calendar,
            iconBg: "bg-orange-100",
            iconText: "text-orange-600",
            trend: "-5%",
            trendColor: "text-red-500",
        },
        {
            title: "Revenue (Lakhs)",
            value: thisMonthVisits,
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
