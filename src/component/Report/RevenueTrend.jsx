"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
    { month: "Aug", revenue: 180 },
    { month: "Sep", revenue: 210 },
    { month: "Oct", revenue: 195 },
    { month: "Nov", revenue: 235 },
    { month: "Dec", revenue: 265 },
    { month: "Jan", revenue: 290 },
];

export default function RevenueTrend() {
    return (
        <div className="bg-white border rounded-2xl p-6 mt-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-zinc-900">
                    Revenue Trend (Lakhs)
                </h3>

                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp size={16} />
                    +18% vs last period
                </div>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={48}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(37, 99, 235, 0.05)" }}
                            contentStyle={{
                                borderRadius: "8px",
                                borderColor: "#e5e7eb",
                            }}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#2563eb"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
