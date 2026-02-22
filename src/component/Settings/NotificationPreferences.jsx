"use client";

import { Bell, Mail, Smartphone } from "lucide-react";
import { useState } from "react";

export default function NotificationPreferences() {
    const [email, setEmail] = useState(true);
    const [push, setPush] = useState(false);
    const [followup, setFollowup] = useState(true);

    return (
        <div className="bg-white border rounded-2xl overflow-hidden max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <Bell size={18} className="text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">
                    Notification Preferences
                </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">

                {/* Email Notifications */}
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Mail size={18} className="text-zinc-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-zinc-900">
                                Email Notifications
                            </p>
                            <p className="text-sm text-zinc-500">
                                Receive email updates for important activities
                            </p>
                        </div>
                    </div>

                    <Toggle checked={email} onChange={setEmail} />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Smartphone size={18} className="text-zinc-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-zinc-900">
                                Push Notifications
                            </p>
                            <p className="text-sm text-zinc-500">
                                Get mobile push notifications
                            </p>
                        </div>
                    </div>

                    <Toggle checked={push} onChange={setPush} />
                </div>

                {/* Follow-up Reminders */}
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Bell size={18} className="text-zinc-500 mt-0.5" />
                        <div>
                            <p className="font-medium text-zinc-900">
                                Follow-up Reminders
                            </p>
                            <p className="text-sm text-zinc-500">
                                Daily reminders for upcoming follow-ups
                            </p>
                        </div>
                    </div>

                    <Toggle checked={followup} onChange={setFollowup} />
                </div>

            </div>
        </div>
    );
}

/* Toggle Switch */
function Toggle({ checked, onChange }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 rounded-full relative transition ${checked ? "bg-blue-600" : "bg-zinc-300"
                }`}
        >
            <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${checked ? "left-5" : "left-0.5"
                    }`}
            />
        </button>
    );
}
