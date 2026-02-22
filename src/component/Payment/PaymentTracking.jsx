export default function PaymentTracking() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-zinc-900">
                    Payment Tracking
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">
                                Invoice No.
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                PO Number
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Invoice Date
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Due Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {[
                            {
                                invoice: "INV-2026-001",
                                customer: "Tata Motors Ltd.",
                                po: "PO-2026-001",
                                date: "2026-02-01",
                                amount: "₹12,45,000",
                                due: "2026-02-16",
                                overdue: false,
                            },
                            {
                                invoice: "INV-2026-002",
                                customer: "Mahindra & Mahindra",
                                po: "PO-2026-002",
                                date: "2026-01-28",
                                amount: "₹8,75,000",
                                due: "2026-02-12",
                                overdue: false,
                            },
                            {
                                invoice: "INV-2026-003",
                                customer: "Ashok Leyland",
                                po: "PO-2026-003",
                                date: "2026-01-25",
                                amount: "₹15,20,000",
                                due: "2026-02-03",
                                overdue: false,
                            },
                            {
                                invoice: "INV-2025-145",
                                customer: "Bajaj Auto",
                                po: "PO-2025-145",
                                date: "2025-12-20",
                                amount: "₹4,55,000",
                                due: "2026-01-04",
                                overdue: "31 days overdue",
                            },
                            {
                                invoice: "INV-2026-004",
                                customer: "Hero MotoCorp",
                                po: "PO-2026-005",
                                date: "2026-01-20",
                                amount: "₹18,90,000",
                                due: "2026-02-18",
                                overdue: false,
                            },
                            {
                                invoice: "INV-2025-148",
                                customer: "TVS Motors",
                                po: "PO-2025-148",
                                date: "2025-12-28",
                                amount: "₹6,30,000",
                                due: "2026-01-12",
                                overdue: "23 days overdue",
                            },
                        ].map((row, i) => (
                            <tr
                                key={i}
                                className={`${row.overdue ? "bg-red-50" : "hover:bg-zinc-50"
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {row.invoice}
                                    </a>
                                </td>

                                <td className="px-6 py-4 text-zinc-900">
                                    {row.customer}
                                </td>

                                <td className="px-6 py-4 text-zinc-600">
                                    {row.po}
                                </td>

                                <td className="px-6 py-4 text-zinc-600">
                                    {row.date}
                                </td>

                                <td className="px-6 py-4 font-medium text-zinc-900">
                                    {row.amount}
                                </td>

                                <td className="px-6 py-4 text-zinc-600">
                                    {row.due}
                                    {row.overdue && (
                                        <div className="text-xs text-red-600 font-medium mt-1">
                                            {row.overdue}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
