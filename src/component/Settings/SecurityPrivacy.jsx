import { Shield } from "lucide-react";

export default function SecurityPrivacy() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <Shield size={18} className="text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">
                    Security & Privacy
                </h3>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">

                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Current Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 border rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* New + Confirm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Action */}
                <div>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-medium rounded-xl">
                        Update Password
                    </button>
                </div>

            </div>
        </div>
    );
}
