import { AlertCircle } from "lucide-react";

function parseDate(value) {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default function ActionRequiredCard({ visits = [] }) {
    const safeVisits = Array.isArray(visits) ? visits : [];
    const now = new Date();

    const overdueFollowUps = safeVisits.filter((v) => {
        const followUpDate = parseDate(v?.next_followup_date);
        if (!followUpDate) return false;
        const overdueAt = new Date(followUpDate.getTime() + 24 * 60 * 60 * 1000);
        return now >= overdueAt;
    }).length;

    const totalVisits = safeVisits.length;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 flex gap-3 items-start">

            {/* Icon */}
            <div className="text-amber-600 mt-0.5">
                <AlertCircle size={20} />
            </div>

            {/* Content */}
            <div>
                <p className="font-semibold text-amber-800 text-xl">
                    Action Required
                </p>
                <p className="text-sm text-amber-700 mt-1">
                    You have <span className="font-medium">{overdueFollowUps} overdue follow-ups</span>.
                </p>
                <p className="text-sm text-amber-700">
                    Total visits: <span className="font-medium">{totalVisits}</span>.
                </p>
            </div>

        </div>
    );
}
