import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-2xl  bg-white  p-8 md:p-12 text-center">
        <p className="inline-flex items-center rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-semibold tracking-wide">
          ERROR 404
        </p>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-zinc-900">
          Page Not Found
        </h1>
        <p className="mt-3 text-zinc-600 text-sm md:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium"
          >
            <Home size={16} />
            Go To Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-5 py-2.5 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back To Home
          </Link>
        </div>
      </section>
    </main>
  );
}
