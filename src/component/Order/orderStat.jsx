import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function OrderStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Total Orders */}
            <div className="bg-white border rounded-2xl p-6">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Package size={20} />
                </div>

                <p className="text-2xl font-semibold mt-5">24</p>
                <p className="text-sm text-zinc-500 mt-1">
                    Total Orders
                </p>
            </div>

            {/* Processing */}
            <div className="bg-white border rounded-2xl p-6">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Clock size={20} />
                </div>

                <p className="text-2xl font-semibold mt-5">8</p>
                <p className="text-sm text-zinc-500 mt-1">
                    Processing
                </p>
            </div>

            {/* Delivered */}
            <div className="bg-white border rounded-2xl p-6">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CheckCircle size={20} />
                </div>

                <p className="text-2xl font-semibold mt-5">14</p>
                <p className="text-sm text-zinc-500 mt-1">
                    Delivered
                </p>
            </div>

            {/* Total Value */}
            <div className="bg-white border rounded-2xl p-6">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <TrendingUp size={20} />
                </div>

                <p className="text-2xl font-semibold mt-5">₹2.84Cr</p>
                <p className="text-sm text-zinc-500 mt-1">
                    Total Value
                </p>
            </div>
        </div>
    );
}