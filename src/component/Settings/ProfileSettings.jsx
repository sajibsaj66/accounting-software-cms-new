import { User } from "lucide-react";

export default function ProfileSettings() {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <User size={18} className="text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">
                    Profile Settings
                </h3>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            defaultValue="john.doe@company.com"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            defaultValue="+91 98765 43210"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Department
                        </label>
                        <input
                            type="text"
                            defaultValue="Sales"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Action */}
                <div>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl">
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}
