"use client"

import { Eye } from 'lucide-react';
import React, { useState } from 'react';

const SalesVisitsReportsDetails = ({visitReports}) => {
    const [selectedReport, setSelectedReport] = useState(null);

    const closeModal = () => setSelectedReport(null);
    const formatValue = (value) => {
        if (value === null || value === undefined || value === "") return "-";
        if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
        return value;
    };

    return (
        <div>
            <div className="bg-white border rounded-2xl overflow-hidden mt-5">
    
            <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-zinc-500">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">
                            Sales Person Name
                        </th>
                         <th className="px-6 py-3 text-left font-medium">
                            Meeting Person Name
                        </th>
                        <th className="px-6 py-3 text-left font-medium">Meeting Phone</th>
                        {/* <th className="px-6 py-3 text-left font-medium">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Last Visit
                        </th>
                         */}
                            <th className="px-6 py-3 text-left font-medium">
                            Customer  priority
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                            Status
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {visitReports?.map((row, i) => (
                        <tr key={i} className="hover:bg-zinc-50">
                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.sales_person_name}
                            </td>

                            <td className="px-6 py-4 font-medium text-zinc-900">
                                {row.meeting_person_name}
                            </td>

                            <td className="px-6 py-4 text-zinc-600">
                                {row.meeting_phone}
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


                            <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    {row.status}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <button
                                    className="cursor-pointer text-green-600 hover:text-green-700"
                                    title="view details"
                                    onClick={() => setSelectedReport(row)}
                                >
                                    <Eye />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* {filteredCustomers.length === 0 && <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-zinc-500"
                            >
                                No customers found
                            </td>
                        </tr>} */}
                </tbody>
            </table>
        </div>

            {selectedReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/20 backdrop-blur-sm px-4 py-6"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-white/95 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900">Visit Report Details</h3>
                                <p className="text-xs text-zinc-500">Full visit summary and follow-up plan</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
                            >
                                Close
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <DetailItem label="Visit Date" value={formatValue(selectedReport.visit_date)} />
                                <DetailItem label="Sales Person Name" value={formatValue(selectedReport.sales_person_name)} />
                                <DetailItem label="Customer Assignment" value={formatValue(selectedReport.customer_assignment)} />
                                <DetailItem label="Customer Name" value={formatValue(selectedReport.customer_name)} />
                                <DetailItem label="Customer Type" value={formatValue(selectedReport.customer_type)} />
                                <DetailItem label="Customer Priority" value={formatValue(selectedReport.customer_priority)} />
                                <DetailItem label="Competitor" value={formatValue(selectedReport.competitor)} />
                                <DetailItem label="Last PO Reference" value={formatValue(selectedReport.last_po_reference)} />
                                <DetailItem label="Product Category" value={formatValue(selectedReport.product_category)} />
                                <DetailItem
                                    className="md:col-span-2"
                                    label="Visit Agenda"
                                    value={formatValue(selectedReport.visit_agenda)}
                                />
                                <DetailItem label="Meeting Person Name" value={formatValue(selectedReport.meeting_person_name)} />
                                <DetailItem label="Meeting Department" value={formatValue(selectedReport.meeting_department)} />
                                <DetailItem label="Meeting Designation" value={formatValue(selectedReport.meeting_designation)} />
                                <DetailItem label="Meeting Phone" value={formatValue(selectedReport.meeting_phone)} />
                                <DetailItem label="Meeting Email" value={formatValue(selectedReport.meeting_email)} />
                                <DetailItem
                                    className="md:col-span-2"
                                    label="Previous Feedback"
                                    value={formatValue(selectedReport.previous_feedback)}
                                />
                                <DetailItem
                                    className="md:col-span-2"
                                    label="Next Action Plan"
                                    value={formatValue(selectedReport.next_action_plan)}
                                />
                                <DetailItem label="Next Follow-up Date" value={formatValue(selectedReport.next_followup_date)} />
                                <DetailItem label="Status" value={formatValue(selectedReport.status)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesVisitsReportsDetails;

function DetailItem({ label, value, className = "" }) {
    return (
        <div className={`rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 ${className}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-1 text-sm text-zinc-900">{value}</p>
        </div>
    );
}
