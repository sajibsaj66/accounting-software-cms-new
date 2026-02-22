import { AlertTriangle, Calendar } from "lucide-react";

export default function OverdueFollowUps({ visits = [] }) {
    const today = new Date();

    const overdue = visits.filter((v) => {
        if (!v.next_followup_date) return false;
        return new Date(v.next_followup_date) < today;
    });

    return (
        <div className="bg-red-50 border border-red-200 rounded-2xl mt-5 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-red-200">
                <AlertTriangle size={18} className="text-red-600" />
                <h3 className="font-semibold text-red-700">
                    Overdue Follow-ups
                </h3>
            </div>

            <div className="p-6 space-y-4">
                {overdue.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white border rounded-xl p-4 flex justify-between items-start"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-zinc-900">
                                    {item.customer_name}
                                </p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                                    Priority {item.customer_priority}
                                </span>
                            </div>

                            <div className="text-xs text-zinc-500 mt-2 flex gap-3">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(item.next_followup_date)
                                        .toISOString()
                                        .split("T")[0]}
                                </span>
                                <span>{item.sales_person_name}</span>
                            </div>

                            <p className="text-sm text-zinc-700 mt-2">
                                <span className="font-medium">Action:</span>{" "}
                                {item.next_plan}
                            </p>
                        </div>

                        <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                            Reschedule
                        </button>
                    </div>
                ))}

                {overdue.length === 0 && (
                    <p className="text-sm text-red-600">
                        No overdue follow-ups 🎉
                    </p>
                )}
            </div>
        </div>
    );
}
