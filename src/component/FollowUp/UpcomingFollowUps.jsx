import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-BD", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString("en-BD", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function UpcomingFollowUps({ visits = [] }) {
    const router = useRouter();
    const priorityOrder = { A: 1, B: 2, C: 3 };

    const upcoming = visits
        .filter((v) => {
            const status = String(v.status || "").trim().toLowerCase();
            if (status !== "complete") return false;
            return true;
        })
        .sort((a, b) => {
            const aPriority = priorityOrder[String(a.customer_priority || "").toUpperCase()] || 999;
            const bPriority = priorityOrder[String(b.customer_priority || "").toUpperCase()] || 999;

            if (aPriority !== bPriority) return aPriority - bPriority;

            return new Date(a.next_followup_date || 0) - new Date(b.next_followup_date || 0);
        });

    const handleEdit = (item) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("salesVisitPrefill", JSON.stringify(item));
        }
        router.push(`/sales-visits?editId=${item?.id || ""}`);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900">
                    Upcoming Follow-ups
                </h3>
            </div>

            <div className="divide-y">
                {upcoming.map((item, i) => (
                    <div
                        key={i}
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

                            <div className="text-xs text-zinc-500 mt-2 flex gap-3">
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
                            <button className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                Complete
                            </button>
                        </div>
                    </div>
                ))}

                {upcoming.length === 0 && (
                    <p className="p-6 text-sm text-zinc-500">
                        No upcoming follow-ups
                    </p>
                )}
            </div>
        </div>
    );
}
