import { AlertCircle } from "lucide-react";

export default function ActionRequiredCard() {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 flex gap-3 items-start">

            {/* Icon */}
            <div className="text-amber-600 mt-0.5">
                <AlertCircle size={20} />
            </div>

            {/* Content */}
            <div>
                <p className="font-semibold text-amber-800 text-xl">
                    Action Required
                </p>
                <p className="text-sm text-amber-700 mt-1">
                    You have <span className="font-medium">12 overdue follow-ups</span> and{" "}
                    <span className="font-medium">5 pending payment collections</span> that
                    need immediate attention.
                </p>
            </div>

        </div>
    );
}
