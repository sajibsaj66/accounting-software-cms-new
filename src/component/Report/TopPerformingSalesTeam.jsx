export default function TopPerformingSalesTeam() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden mt-5">

            {/* Header */}
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-zinc-900">
                    Top Performing Sales Team
                </h3>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead className="text-zinc-500 bg-zinc-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">Rank</th>
                        <th className="px-6 py-3 text-left font-medium">Sales Person</th>
                        <th className="px-6 py-3 text-left font-medium">Total Visits</th>
                        <th className="px-6 py-3 text-left font-medium">
                            Revenue Generated
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Conversion Rate
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {[
                        {
                            rank: 1,
                            name: "John Doe",
                            visits: 45,
                            revenue: "₹78.5L",
                            rate: 68,
                            color: "bg-yellow-100 text-yellow-700",
                        },
                        {
                            rank: 2,
                            name: "Jane Smith",
                            visits: 42,
                            revenue: "₹72.3L",
                            rate: 65,
                            color: "bg-zinc-100 text-zinc-700",
                        },
                        {
                            rank: 3,
                            name: "Mike Johnson",
                            visits: 38,
                            revenue: "₹65.8L",
                            rate: 62,
                            color: "bg-orange-100 text-orange-700",
                        },
                        {
                            rank: 4,
                            name: "Sarah Williams",
                            visits: 35,
                            revenue: "₹58.2L",
                            rate: 60,
                            color: "bg-blue-100 text-blue-700",
                        },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50">

                            {/* Rank */}
                            <td className="px-6 py-4">
                                <span
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${row.color}`}
                                >
                                    {row.rank}
                                </span>
                            </td>

                            {/* Name */}
                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.name}
                            </td>

                            {/* Visits */}
                            <td className="px-6 py-4 text-zinc-700">
                                {row.visits}
                            </td>

                            {/* Revenue */}
                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.revenue}
                            </td>

                            {/* Conversion */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-28 h-2 bg-zinc-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-600 rounded-full"
                                            style={{ width: `${row.rate}%` }}
                                        />
                                    </div>
                                    <span className="text-zinc-700 font-medium">
                                        {row.rate}%
                                    </span>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
