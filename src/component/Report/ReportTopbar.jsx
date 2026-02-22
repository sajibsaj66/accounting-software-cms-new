import { Calendar, Download } from "lucide-react";

export default function ReportsTopbar() {
    return (
        <div className="flex items-center justify-between">

            {/* Left: Date Range */}
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                <Calendar size={16} className="text-zinc-500" />
                Last 6 Months
            </button>

            {/* Right: Export */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl">
                <Download size={16} />
                Export Report
            </button>

        </div>
    );
}
