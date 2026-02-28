export default function UpcomingFollowUps({ visits = [] }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = visits.filter((v) => {
        if (!v.next_followup_date) return false;

        const followDate = new Date(v.next_followup_date);
        followDate.setHours(0, 0, 0, 0);

        return followDate >= today;
    });

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200">
                <h3 className="font-semibold text-[34px] leading-none text-zinc-900">
                    Upcoming Follow-ups
                </h3>
            </div>

            <div className="divide-y">
                {upcoming.length === 0 && (
                    <div className="p-6 text-sm text-zinc-500 text-center">
                        No upcoming follow-ups
                    </div>
                )}

                {upcoming.slice(0, 5).map((item, i) => (
                    <div
                        key={i}
                        className="px-6 py-4 flex justify-between items-start hover:bg-zinc-50 transition"
                    >
                        <div>
                            <p className="font-medium text-zinc-900">
                                {item.customer_name}
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">
                                {item.next_plan || "Follow-up"} •{" "}
                                {new Date(item.next_followup_date)
                                    .toISOString()
                                    .split("T")[0]}
                            </p>
                        </div>

                        <span
                            className={`text-xs px-3 py-1 rounded-full font-medium
                ${item.customer_priority === "A"
                                    ? "bg-red-100 text-red-600"
                                    : item.customer_priority === "B"
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-green-100 text-green-600"
                                }
              `}
                        >
                            Priority {item.customer_priority}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
