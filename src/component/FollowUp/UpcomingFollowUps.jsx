import { Calendar } from "lucide-react";

export default function UpcomingFollowUps({ visits = [] }) {
    const today = new Date();

    const upcoming = visits.filter((v) => {
        if (!v.next_followup_date) return false;
        return new Date(v.next_followup_date) >= today;
    });

    return (
        <div className="bg-white border rounded-2xl mt-5 overflow-hidden">
            <div className="px-6 py-4 border-b">
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
                                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">
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

                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs border rounded-lg hover:bg-zinc-50">
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
