import { AlertCircle } from "lucide-react";

export default function ActionRequiredCard() {
    return (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 flex gap-3 items-start mt-5">

            {/* Icon */}
            <div className="text-orange-500 mt-0.5">
                <AlertCircle size={20} />
            </div>

            {/* Content */}
            <div>
                <p className="font-semibold text-orange-700">
                    Action Required
                </p>
                <p className="text-sm text-orange-600 mt-1">
                    You have <span className="font-medium">12 overdue follow-ups</span> and{" "}
                    <span className="font-medium">5 pending payment collections</span> that
                    need immediate attention.
                </p>
            </div>

        </div>
    );
}
