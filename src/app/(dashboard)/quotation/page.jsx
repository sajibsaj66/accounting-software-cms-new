import Link from "next/link";
import { FilePlus2, FileText, Receipt } from "lucide-react";

const cards = [
  {
    key: "quotation_entry",
    title: "Quotation Entry",
    href: "/sales/quotation-entry",
    icon: FilePlus2,
    subtitle: "Create and save a new quotation",
    accent: "from-cyan-500/20 to-sky-500/10",
  },
  {
    key: "quotation_record",
    title: "Quotation Record",
    href: "/sales/quotation-record",
    icon: FileText,
    subtitle: "Review and manage submitted records",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    key: "quotation_invoice",
    title: "Quotation Invoice",
    href: "/sales/quotation-invoice",
    icon: Receipt,
    subtitle: "Generate and share quotation invoices",
    accent: "from-amber-500/20 to-orange-500/10",
  },
];

export default function QuotationMenu({ accessChecker }) {
  const canAccess = (key) => {
    if (typeof accessChecker !== "function") return true;
    const result = accessChecker(key);
    if (typeof result === "boolean") return result;
    return Number(result) > -1;
  };

  return (
    <section className="rounded-2xl bg-[#f1f1f1] p-6 md:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards
        .filter((c) => canAccess(c.key))
        .map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="group flex h-44 flex-col items-center justify-center rounded-xl bg-[#3d6775] px-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#355b67] hover:shadow-md"
            >
              <Icon className="h-7 w-7 text-white/95" strokeWidth={1.8} />
              <p className="mt-4 text-2xl font-medium tracking-tight text-white">{c.title}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
