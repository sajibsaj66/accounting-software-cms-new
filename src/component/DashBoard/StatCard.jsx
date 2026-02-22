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
            color: "blue",
        },
        {
            title: "Total Visits",
            value: totalVisits,
            icon: Briefcase,
            color: "green",
        },
        {
            title: "Upcoming Follow-ups",
            value: upcomingFollowups,
            icon: Calendar,
            color: "orange",
        },
        {
            title: "This Month Visits",
            value: thisMonthVisits,
            icon: DollarSign,
            color: "purple",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div
                        key={index}
                        className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-start">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-xl bg-${item.color}-50 text-${item.color}-600`}
                            >
                                <Icon size={22} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-6 text-zinc-900">
                            {item.value}
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            {item.title}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
