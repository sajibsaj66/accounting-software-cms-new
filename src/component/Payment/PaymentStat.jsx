import { DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function PaymentsStat() {
    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Pending */}
                <div className="bg-white border rounded-2xl p-6">
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <DollarSign size={20} />
                    </div>
                    <p className="text-2xl font-semibold mt-5">₹50.95L</p>
                    <p className="text-sm text-zinc-500 mt-1">Total Pending</p>
                </div>

                {/* Overdue Payments */}
                <div className="bg-white border rounded-2xl p-6">
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-2xl font-semibold mt-5">₹10.85L</p>
                    <p className="text-sm text-zinc-500 mt-1">Overdue Payments</p>
                </div>

                {/* Collected This Month */}
                <div className="bg-white border rounded-2xl p-6">
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <CheckCircle size={20} />
                    </div>
                    <p className="text-2xl font-semibold mt-5">₹284.5L</p>
                    <p className="text-sm text-zinc-500 mt-1">
                        Collected This Month
                    </p>
                </div>

                {/* Avg Collection Days */}
                <div className="bg-white border rounded-2xl p-6">
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <Clock size={20} />
                    </div>
                    <p className="text-2xl font-semibold mt-5">18</p>
                    <p className="text-sm text-zinc-500 mt-1">
                        Days Avg Collection
                    </p>
                </div>

            </div>

            {/* Urgent Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex gap-3 items-start">
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
                <div>
                    <p className="font-semibold text-red-700">
                        Urgent: Overdue Payments
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                        You have <span className="font-medium">2 overdue invoices</span>{" "}
                        totaling <span className="font-medium">₹10.85L</span>. Immediate
                        collection action required.
                    </p>
                </div>
            </div>

        </div>
    );
}
