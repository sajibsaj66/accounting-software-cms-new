import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export default function Statcard({ visits = [] }) {
    const isReschedule = (value) => String(value || "").trim().toLowerCase() === "reschedule";
    const isComplete = (value) => String(value || "").trim().toLowerCase() === "complete";

    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Scheduled Follow-ups = total status Complete
    const scheduled = visits.filter((v) => {
        return isComplete(v.status);
    }).length;

    // Overdue = total status Reschedule
    const overdue = visits.filter((v) => {
        return isReschedule(v.status);
    }).length;

    // Completed This Week = status Complete + current week range
    const completedWeek = visits.filter((v) => {
        if (!isComplete(v.status)) return false;
        const completedDate = new Date(v.updated_at || v.visit_date);
        if (Number.isNaN(completedDate.getTime())) return false;
        return completedDate >= startOfWeek && completedDate <= endOfWeek;
    }).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Scheduled */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4">
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
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4">
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
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4">
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
