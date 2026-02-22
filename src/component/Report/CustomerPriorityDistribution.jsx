"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Priority A", value: 35, color: "#ef4444" }, // red
    { name: "Priority B", value: 45, color: "#f97316" }, // orange
    { name: "Priority C", value: 20, color: "#10b981" }, // green
];

export default function CustomerPriorityDistribution() {
    return (
        <div className="bg-white border rounded-2xl p-6 mt-5">

            {/* Header */}
            <h3 className="font-semibold text-zinc-900 mb-6">
                Customer Priority Distribution
            </h3>

            {/* Chart */}
            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={85}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Labels (same placement style) */}
                <div className="absolute top-6 right-6 text-sm font-medium text-red-500">
                    Priority A: 35%
                </div>

                <div className="absolute left-6 bottom-10 text-sm font-medium text-orange-500">
                    Priority B: 45%
                </div>

                <div className="absolute right-6 bottom-10 text-sm font-medium text-green-500">
                    Priority C: 20%
                </div>
            </div>

        </div>
    );
}
