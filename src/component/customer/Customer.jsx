import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export default function Customer({ search = "" }) {
    const normalizedSearch = search.trim().toLowerCase();
    const authInfo = useAuth();
    const token = authInfo?.token;

    const {
        data: customerData = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["sales-customers", token],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-sales-customers`,
                { headers: { "auth-token": token } },
            );
            return res?.data?.data ?? [];
        },
        enabled: Boolean(token),
    });

    const filteredCustomers = customerData.filter((c) => {
        if (!normalizedSearch) return true;
        return (
            String(c?.customer_name ?? "").toLowerCase().includes(normalizedSearch) ||
            String(c?.customer_email ?? "").toLowerCase().includes(normalizedSearch) ||
            String(c?.customer_phone ?? "").toLowerCase().includes(normalizedSearch)
        );
    });

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
    };

    if (isLoading) {
        return <div className="mt-5 text-sm text-zinc-500">Loading customers...</div>;
    }

    if (isError) {
        return <div className="mt-5 text-sm text-red-500">Failed to load customers.</div>;
    }

    return (
        <div className="bg-white border rounded-2xl overflow-hidden mt-5">
            <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-zinc-500">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">
                            Customer Name
                        </th>
                         <th className="px-6 py-3 text-left font-medium">
                            Customer Phone
                        </th>
                        <th className="px-6 py-3 text-left font-medium">Type</th>
                        <th className="px-6 py-3 text-left font-medium">
                            Priority
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Last Visit
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Next Follow-up
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {filteredCustomers.map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50">
                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.customer_name}
                            </td>

                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.customer_phone}
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {row.customer_type}
                            </td>

                            <td className="px-6 py-4">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium
                  ${row.customer_priority === "A"
                                            ? "bg-red-100 text-red-600"
                                            : row.customer_priority === "B"
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {row.customer_priority}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {formatDate(row.last_visit)}
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {formatDate(row.next_followup)}
                            </td>

                            <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}

                    {filteredCustomers.length === 0 && <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-zinc-500"
                            >
                                No customers found
                            </td>
                        </tr>}
                </tbody>
            </table>
        </div>
    );
}
