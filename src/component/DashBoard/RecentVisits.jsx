export default function RecentVisits({ visits }) {
    return (
        <div className="max-w-md bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-4">
                <h3 className="font-semibold text-zinc-900">
                    Recent Sales Visits
                </h3>
            </div>

            <div className="divide-y">
                {visits.slice(0, 5).map((item, i) => (
                    <div key={i} className="px-6 py-4 flex justify-between items-start">
                        <div>
                            <p className="font-medium text-zinc-900">
                                {item.customer_name}
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">
                                {item.sales_person_name} •{" "}
                                {new Date(item.visit_date).toISOString().split("T")[0]}
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

                            <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-600">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
