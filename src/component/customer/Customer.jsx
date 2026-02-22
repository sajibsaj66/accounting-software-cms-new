export default function Customer({ customers = [], search = "" }) {
    // Filter customers
    const filteredCustomers = customers.filter((c) =>
        c.customer_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white border rounded-2xl overflow-hidden mt-5">
            <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-zinc-500">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">
                            Customer Name
                        </th>
                        <th className="px-6 py-3 text-left font-medium">Type</th>
                        <th className="px-6 py-3 text-left font-medium">
                            Priority
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Last Visit
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Next Follow-up
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {filteredCustomers.map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50">
                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.customer_name}
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {row.customer_type}
                            </td>

                            <td className="px-6 py-4">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium
                  ${row.customer_priority === "A"
                                            ? "bg-red-100 text-red-600"
                                            : row.customer_priority === "B"
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {row.customer_priority}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {new Date(row.visit_date)
                                    .toISOString()
                                    .split("T")[0]}
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {row.next_followup_date
                                    ? new Date(row.next_followup_date)
                                        .toISOString()
                                        .split("T")[0]
                                    : "-"}
                            </td>

                            <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-zinc-500"
                            >
                                No customers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
