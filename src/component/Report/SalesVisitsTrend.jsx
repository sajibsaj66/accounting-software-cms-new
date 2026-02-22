"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { month: "Aug", visits: 120 },
    { month: "Sep", visits: 135 },
    { month: "Oct", visits: 128 },
    { month: "Nov", visits: 148 },
    { month: "Dec", visits: 155 },
    { month: "Jan", visits: 160 },
];

export default function SalesVisitsTrend() {
    return (
        <div className="bg-white border rounded-2xl p-6 mt-5">

            {/* Header */}
            <h3 className="font-semibold text-zinc-900 mb-6">
                Sales Visits Trend
            </h3>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#9ca3af" }}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#9ca3af" }}
                            tickLine={false}
                        />

                        <Tooltip
                            cursor={{ stroke: "#2563eb", strokeDasharray: "3 3" }}
                            contentStyle={{
                                borderRadius: "8px",
                                borderColor: "#e5e7eb",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 5, fill: "#2563eb" }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
