import { accessChecker } from "../../../lib/Function";
import Link from "next/link";
import { FilePlus2, FileText, Receipt } from "lucide-react";

const cards = [
  { key: "quotation_entry", title: "Quotation Entry", href: "/sales/quotation-entry", icon: FilePlus2 },
  { key: "quotation_record", title: "Quotation Record", href: "/sales/quotation-record", icon: FileText },
  { key: "quotation_invoice", title: "Quotation Invoice", href: "/sales/quotation-invoice", icon: Receipt },
];

export default function QuotationMenu({ accessChecker }) {
  const canAccess = (key) => {
    if (typeof accessChecker !== "function") return true;
    const result = accessChecker(key);
    if (typeof result === "boolean") return result;
    return Number(result) > -1;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards
        .filter((c) => canAccess(c.key))
        .map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 transition"
            >
              <Icon className="h-5 w-5 text-blue-600" />
              <p className="mt-3 text-sm font-medium text-zinc-800">{c.title}</p>
            </Link>
          );
        })}
    </div>
  );
}
