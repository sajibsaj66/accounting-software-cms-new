import { Database } from "lucide-react";

export default function DataExport() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <Database size={18} className="text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">
                    Data & Export
                </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

                {/* Export Customer Data */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-zinc-900">
                            Export Customer Data
                        </p>
                        <p className="text-sm text-zinc-500">
                            Download all customer information as CSV
                        </p>
                    </div>

                    <button className="px-4 py-2 border rounded-xl text-sm
                             font-medium hover:bg-zinc-50">
                        Export
                    </button>
                </div>

                {/* Export Sales Reports */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-zinc-900">
                            Export Sales Reports
                        </p>
                        <p className="text-sm text-zinc-500">
                            Download complete sales activity reports
                        </p>
                    </div>

                    <button className="px-4 py-2 border rounded-xl text-sm
                             font-medium hover:bg-zinc-50">
                        Export
                    </button>
                </div>

            </div>
        </div>
    );
}
