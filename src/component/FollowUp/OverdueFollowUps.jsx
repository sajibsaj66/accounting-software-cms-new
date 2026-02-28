import { AlertTriangle, Calendar, Clock } from "lucide-react";

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

export default function OverdueFollowUps({ visits = [] }) {
    const priorityOrder = { A: 1, B: 2, C: 3 };

    const overdue = visits
        .filter((v) => {
            const status = String(v.status || "").trim().toLowerCase();
            if (status !== "reschedule") return false;
            return true;
        })
        .sort((a, b) => {
            const aPriority = priorityOrder[String(a.customer_priority || "").toUpperCase()] || 999;
            const bPriority = priorityOrder[String(b.customer_priority || "").toUpperCase()] || 999;

            if (aPriority !== bPriority) return aPriority - bPriority;

            return new Date(a.next_followup_date) - new Date(b.next_followup_date);
        });

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-200">
                <AlertTriangle size={18} className="text-red-500" />
                <h3 className="font-semibold text-zinc-900">
                    Overdue Follow-ups
                </h3>
            </div>

            <div className="divide-y">
                {overdue.map((item, i) => (
                    <div
                        key={i}
                        className="px-6 py-4 flex justify-between items-start gap-4 hover:bg-zinc-50 transition"
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

                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100">
                            Reschedule
                        </button>
                    </div>
                ))}

                {overdue.length === 0 && (
                    <p className="px-6 py-6 text-sm text-zinc-500">
                        No overdue follow-ups 🎉
                    </p>
                )}
            </div>
        </div>
    );
}
