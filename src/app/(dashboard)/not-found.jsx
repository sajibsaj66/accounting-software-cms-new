import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white p-8 text-center">
        <p className="text-xs font-semibold text-orange-600 tracking-wide">404</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">This Page Was Not Found</h1>
        <p className="mt-2 text-sm text-zinc-600">
          The dashboard route you requested is unavailable.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-black"
          >
            <LayoutDashboard size={15} />
            Dashboard Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 text-zinc-700 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            <Home size={15} />
            Main Home
          </Link>
        </div>
      </div>
    </div>
  );
}
