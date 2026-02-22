export default function RecentPurchaseOrders() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-zinc-900">
                    Recent Purchase Orders
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-500">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">
                                PO Number
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Order Date
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Delivery Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {[
                            {
                                po: "PO-2026-001",
                                customer: "Tata Motors Ltd.",
                                date: "2026-02-01",
                                items: "Bearings (SKF 6205), Lubrication Oil",
                                amount: "₹12,45,000",
                                delivery: "2026-02-15",
                            },
                            {
                                po: "PO-2026-002",
                                customer: "Mahindra & Mahindra",
                                date: "2026-01-28",
                                items: "Industrial Belts, Bearings (FAG 6206)",
                                amount: "₹8,75,000",
                                delivery: "2026-02-12",
                            },
                            {
                                po: "PO-2026-003",
                                customer: "Ashok Leyland",
                                date: "2026-01-25",
                                items: "Complete Bearing Set, Lubrication",
                                amount: "₹15,20,000",
                                delivery: "2026-02-03",
                            },
                            {
                                po: "PO-2026-004",
                                customer: "TVS Motors",
                                date: "2026-01-22",
                                items: "Bearings (NTN 6207), V-Belts",
                                amount: "₹6,30,000",
                                delivery: "2026-02-10",
                            },
                            {
                                po: "PO-2026-005",
                                customer: "Hero MotoCorp",
                                date: "2026-01-20",
                                items: "Bearings Bulk Order, Industrial Lubrication",
                                amount: "₹18,90,000",
                                delivery: "2026-02-18",
                            },
                            {
                                po: "PO-2026-006",
                                customer: "Bajaj Auto",
                                date: "2026-01-18",
                                items: "Timing Belts, Bearings (Koyo 6208)",
                                amount: "₹4,55,000",
                                delivery: "2026-01-30",
                            },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-zinc-50">

                                <td className="px-6 py-4">
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {row.po}
                                    </a>
                                </td>

                                <td className="px-6 py-4 text-zinc-900">
                                    {row.customer}
                                </td>

                                <td className="px-6 py-4 text-zinc-600">
                                    {row.date}
                                </td>

                                <td className="px-6 py-4 text-zinc-600 max-w-xs">
                                    {row.items}
                                </td>

                                <td className="px-6 py-4 font-medium text-zinc-900">
                                    {row.amount}
                                </td>

                                <td className="px-6 py-4 text-zinc-600">
                                    {row.delivery}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
