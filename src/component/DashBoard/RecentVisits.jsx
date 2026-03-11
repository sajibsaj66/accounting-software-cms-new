export default function RecentVisits({ visits = [] }) {
    const safeVisits = Array.isArray(visits) ? visits : [];

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200">
                <h3 className="font-semibold text-[34px] leading-none text-zinc-900">
                    Recent Sales Visits
                </h3>
            </div>

            <div className="divide-y">
                {safeVisits.slice(0, 5).map((item, i) => (
                    <div key={i} className="px-6 py-4 flex justify-between items-start">
                        <div>
                            <p className="font-medium text-zinc-900">
                                {item.customer_name}
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">
                                {item.sales_person_name} •{" "}
                                {new Date(item.visit_date).toISOString().split("T")[0]}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                                Area: {item.sales_person_area || "-"}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <span
                                className={`text-xs px-3 py-1 rounded-full font-medium
                  ${item.customer_priority === "A"
                                        ? "bg-red-100 text-red-600"
                                        : item.customer_priority === "B"
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                            >
                                Priority {item.customer_priority}
                            </span>

                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${String(item.status || "").toLowerCase() === "complete" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
