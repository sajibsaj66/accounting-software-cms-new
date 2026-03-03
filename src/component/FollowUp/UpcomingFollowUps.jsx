import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function formatDate(value) {
    const date = parseFollowUpDate(value);
    if (!date) return "-";

    return date.toLocaleDateString("en-BD", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatTime(value) {
    const date = parseFollowUpDate(value);
    if (!date) return "-";

    return date.toLocaleTimeString("en-BD", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function parseFollowUpDate(value) {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default function UpcomingFollowUps({ visits = [] }) {
    const router = useRouter();
    const priorityOrder = { A: 1, B: 2, C: 3 };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const dayAfterTomorrowStart = new Date(tomorrowStart);
    dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 1);

    const upcoming = visits
        .filter((v) => parseFollowUpDate(v.next_followup_date))
        .sort((a, b) => {
            const aDate = parseFollowUpDate(a.next_followup_date);
            const bDate = parseFollowUpDate(b.next_followup_date);
            const aTime = aDate ? aDate.getTime() : Number.MAX_SAFE_INTEGER;
            const bTime = bDate ? bDate.getTime() : Number.MAX_SAFE_INTEGER;
            if (aTime !== bTime) return aTime - bTime;

            const aPriority = priorityOrder[String(a.customer_priority || "").toUpperCase()] || 999;
            const bPriority = priorityOrder[String(b.customer_priority || "").toUpperCase()] || 999;

            if (aPriority !== bPriority) return aPriority - bPriority;
            return 0;
        });

    const todayFollowUps = upcoming.filter((item) => {
        const date = parseFollowUpDate(item.next_followup_date);
        return date && date >= todayStart && date < tomorrowStart;
    });

    const tomorrowFollowUps = upcoming.filter((item) => {
        const date = parseFollowUpDate(item.next_followup_date);
        return date && date >= tomorrowStart && date < dayAfterTomorrowStart;
    });

    const handleEdit = (item) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("salesVisitPrefill", JSON.stringify(item));
        }
        router.push(`/sales-visits?editId=${item?.id || ""}`);
    };

    const FollowUpRow = ({ item }) => (
        <div
            className="px-6 py-5 flex justify-between items-start gap-4"
        >
            <div>
                <div className="flex items-center gap-2">
                    <p className="font-medium text-zinc-900">
                        {item.customer_name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.customer_priority === "A"
                            ? "bg-red-100 text-red-600"
                            : item.customer_priority === "B"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-green-100 text-green-600"
                    }`}>
                        Priority {item.customer_priority}
                    </span>
                </div>

                <div className="mt-2 font-bold text-sm text-green-500 flex gap-3">
                    <span>Next Follow-up:</span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(item.next_followup_date)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(item.next_followup_date)}
                    </span>
                    <span>{item.sales_person_name}</span>
                </div>

                <p className="text-sm text-zinc-700 mt-2">
                    <span className="font-medium">Action:</span>{" "}
                    {item.next_action_plan}
                </p>
                <p className="text-sm text-zinc-700 mt-1">
                    <span className="font-medium">Previous Feedback:</span>{" "}
                    {item.previous_feedback || "-"}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 text-xs border rounded-lg hover:bg-zinc-50"
                >
                    Edit
                </button>
                <span
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
                        String(item.status || "").toLowerCase() === "complete"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
                    {item.status || "-"}
                </span>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900">
                    Upcoming Follow-ups
                </h3>
                <div className="mt-3 flex gap-2 text-xs font-medium">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        Today: {todayFollowUps.length}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        Tomorrow: {tomorrowFollowUps.length}
                    </span>
                </div>
            </div>

            <div className="divide-y">
                <div className="px-6 py-3 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-700">
                    Today ({todayFollowUps.length})
                </div>
                {todayFollowUps.length > 0 ? (
                    todayFollowUps.map((item, i) => <FollowUpRow key={`today-${item?.id || i}`} item={item} />)
                ) : (
                    <p className="px-6 py-4 text-sm text-zinc-500">
                        No follow-ups for today
                    </p>
                )}

                <div className="px-6 py-3 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-700">
                    Tomorrow ({tomorrowFollowUps.length})
                </div>
                {tomorrowFollowUps.length > 0 ? (
                    tomorrowFollowUps.map((item, i) => <FollowUpRow key={`tomorrow-${item?.id || i}`} item={item} />)
                ) : (
                    <p className="px-6 py-4 text-sm text-zinc-500">
                        No follow-ups for tomorrow
                    </p>
                )}

                {todayFollowUps.length === 0 && tomorrowFollowUps.length === 0 && (
                    <div className="px-6 py-4 bg-zinc-50 text-xs text-zinc-500">
                        Showing only Today and Tomorrow follow-ups.
                    </div>
                )}
            </div>
        </div>
    );
}
