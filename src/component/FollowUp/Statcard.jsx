import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export default function Statcard({ visits = [] }) {
    const today = new Date();

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Scheduled (Future)
    const scheduled = visits.filter((v) => {
        if (!v.next_followup_date) return false;
        return new Date(v.next_followup_date) >= today;
    }).length;

    // Overdue (Past)
    const overdue = visits.filter((v) => {
        if (!v.next_followup_date) return false;
        return new Date(v.next_followup_date) < today;
    }).length;

    // Completed This Week (Visit Done This Week)
    const completedWeek = visits.filter((v) => {
        const visitDate = new Date(v.visit_date);
        return visitDate >= startOfWeek;
    }).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Scheduled */}
            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Calendar size={18} />
                </div>
                <div>
                    <p className="text-lg font-semibold">{scheduled}</p>
                    <p className="text-sm text-zinc-500">
                        Scheduled Follow-ups
                    </p>
                </div>
            </div>

            {/* Overdue */}
            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <AlertTriangle size={18} />
                </div>
                <div>
                    <p className="text-lg font-semibold">{overdue}</p>
                    <p className="text-sm text-zinc-500">
                        Overdue Follow-ups
                    </p>
                </div>
            </div>

            {/* Completed */}
            <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CheckCircle size={18} />
                </div>
                <div>
                    <p className="text-lg font-semibold">{completedWeek}</p>
                    <p className="text-sm text-zinc-500">
                        Completed This Week
                    </p>
                </div>
            </div>
        </div>
    );
}
