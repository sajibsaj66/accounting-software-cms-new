"use client";

import SalesVisitsReportsDetails from "@/component/salesVisitsReports/SalesVisitsReportsDetails";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateVisitReport() {
    const [loading, setLoading] = useState(false);
    const [customerOptions, setCustomerOptions] = useState([]);

    const { user } = useAuth();

    // get sales visits reports
    const { data: visitReportsData = [], isLoading } = useQuery({
    queryKey: ['get-sales-visits-reports'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/get-sales-customer-visit-reports`)
            return res.data;
    }
    })
    
let visitReports = visitReportsData.data;

    const [form, setForm] = useState({
        visit_date: "",
        sales_person_name: user?.full_name,
        customer_assignment: "Self",

        customer_name: "",
        customer_phone: "",
        customer_type: "Existing",
        last_po_reference: "",
        competitor: "",

        product_category: "",
        customer_priority: "A",
        visit_agenda: [],

        dealing_person_name: "",
        department: "",
        designation: "",
        meeting_person_criteria: "",
        phone_number: "",
        email: "",

        previous_plan_feedback: "",
        next_plan: "",
        next_followup_date: ""
    });

    useEffect(() => {
        if (user?.full_name) {
            setForm((prev) => ({ ...prev, sales_person_name: user.full_name }));
        }
    }, [user?.full_name]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/get-sales-customers`,
                );
                setCustomerOptions(res?.data?.data ?? []);
            } catch (error) {
                console.error("Failed to load customers:", error);
            }
        };

        fetchCustomers();
    }, []);

    /* ---------------- HANDLERS ---------------- */

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "customer_name") {
            const selectedCustomer = customerOptions.find(
                (customer) => customer.customer_name === value,
            );

            setForm((prev) => ({
                ...prev,
                customer_name: value,
                customer_phone: selectedCustomer?.customer_phone || "",
            }));
            return;
        }

        setForm({ ...form, [name]: value });
    };

    const toggleAgenda = (item) => {
        setForm((prev) => ({
            ...prev,
            visit_agenda: prev.visit_agenda.includes(item)
                ? prev.visit_agenda.filter((i) => i !== item)
                : [...prev.visit_agenda, item]
        }));
    };

    const handleSubmit = async () => {
        if (!form.visit_date || !form.sales_person_name || !form.customer_name) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                visit_date: form.visit_date,
                sales_person_name: form.sales_person_name,
                customer_assignment: form.customer_assignment,
                customer_name: form.customer_name,
                customer_phone: form.customer_phone,
                customer_type: form.customer_type,
                customer_priority: form.customer_priority,
                competitor: form.competitor,
                last_po_reference: form.last_po_reference,
                product_category: form.product_category,
                visit_agenda: form.visit_agenda,
                meeting_person_name: form.dealing_person_name,
                meeting_department: form.department,
                meeting_designation: form.designation,
                meeting_phone: form.phone_number,
                meeting_email: form.email,
                previous_feedback: form.previous_plan_feedback,
                next_action_plan: form.next_plan,
                next_followup_date: form.next_followup_date,
                status: "active",
            };

            const result = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/create-sales-customer-visit-report`,
                payload,
            );

            if (result?.data?.error) {
                throw new Error(result?.data?.message || "Submission failed");
            }

            alert("✅ Visit report submitted successfully");

            setForm({
                visit_date: "",
                sales_person_name: "",
                customer_assignment: "Self",

                customer_name: "",
                customer_phone: "",
                customer_type: "Existing",
                last_po_reference: "",
                competitor: "",

                product_category: "",
                customer_priority: "A",
                visit_agenda: [],

                dealing_person_name: "",
                department: "",
                designation: "",
                meeting_person_criteria: "",
                phone_number: "",
                email: "",

                previous_plan_feedback: "",
                next_plan: "",
                next_followup_date: ""
            });

        } catch (err) {
            console.error(err);
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Submission failed";
            alert("❌ " + message);
        } finally {
            setLoading(false);
        }
    };


    /* ---------------- UI ---------------- */

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Add Top part */}
            <div className="max-w-6xl mx-auto space-y-8">

            {/* VISIT INFORMATION */}
            <Section title="Visit Information">
                <Grid>
                    <Input label="Visit Date" type="date" name="visit_date" value={form.visit_date} onChange={handleChange} required />
                    <Input readOnly label="Sales Person Name" name="sales_person_name" value={form.sales_person_name} onChange={handleChange} required />

                    <RadioGroup
                        label="Customer Assignment"
                        name="customer_assignment"
                        value={form.customer_assignment}
                        onChange={handleChange}
                        options={["Self", "Other"]}
                    />
                </Grid>
            </Section>

            {/* CUSTOMER DETAILS */}
            <Section title="Customer Details">
                <Grid>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="customer_name"
                            value={form.customer_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                            required
                        >
                            <option value="">Select customer</option>
                            {customerOptions.map((customer, idx) => (
                                <option
                                    key={customer.customer_id || customer.id || `${customer.customer_name}-${idx}`}
                                    value={customer.customer_name}
                                >
                                    {customer.customer_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <RadioGroup
                        label="Customer Type"
                        name="customer_type"
                        value={form.customer_type}
                        onChange={handleChange}
                        options={["New", "Existing"]}
                    />

                    <Input label="Last PO Reference" name="last_po_reference" value={form.last_po_reference} onChange={handleChange} />
                        <Input label="Competitor" name="competitor" value={form.competitor} onChange={handleChange} />

                        <Input readOnly label="Customer Phone" name="customer_phone" value={form.customer_phone} />
                        
                </Grid>
            </Section>

            {/* PRODUCT CATEGORY */}
            <Section title="Product Category">
                <div className="flex gap-3 flex-wrap">
                    {["Bearing", "Lubrication", "Belt"].map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            active={form.product_category === item}
                            onClick={() => setForm({ ...form, product_category: item })}
                        />
                    ))}
                    <input
                        placeholder="Others (specify)"
                        className="border rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => setForm({ ...form, product_category: e.target.value })}
                    />
                </div>
            </Section>

            {/* PRIORITY */}
            <Section title="Customer Priority">
                <div className="flex gap-3">
                    {["A", "B", "C"].map((p) => (
                        <Chip
                            key={p}
                            label={`Priority ${p}`}
                            active={form.customer_priority === p}
                            onClick={() => setForm({ ...form, customer_priority: p })}
                        />
                    ))}
                </div>
            </Section>

            {/* VISIT AGENDA */}
            <Section title="Visit Agenda">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        "Inquiry Discussion",
                        "Negotiation",
                        "Follow-up Visit",
                        "Pending Payment",
                        "Rapport Building",
                        "Order Finalization",
                        "Complaint",
                        "Support & Service"
                    ].map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            active={form.visit_agenda.includes(item)}
                            onClick={() => toggleAgenda(item)}
                        />
                    ))}
                </div>
            </Section>

            {/* MEETING PERSON */}
            <Section title="Meeting Person Details">
                <Grid>
                    <Input label="Dealing Person Name" name="dealing_person_name" value={form.dealing_person_name} onChange={handleChange} required />
                    <Input label="Department" name="department" value={form.department} onChange={handleChange} required />
                    <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />
                    <Input label="Meeting Person Criteria" name="meeting_person_criteria" value={form.meeting_person_criteria} onChange={handleChange} />
                    <Input label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} required />
                    <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
                </Grid>
            </Section>

            {/* FEEDBACK */}
            <Section title="Previous Plan Feedback">
                <textarea
                    name="previous_plan_feedback"
                    value={form.previous_plan_feedback}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 text-sm min-h-[100px]"
                />
            </Section>

            {/* NEXT ACTION */}
            <Section title="Next Action Plan">
                <Grid>
                    <Input label="Next Plan" name="next_plan" value={form.next_plan} onChange={handleChange} required />
                    <Input label="Next Follow-up Date" type="date" name="next_followup_date" value={form.next_followup_date} onChange={handleChange} required />
                </Grid>
            </Section>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg border">Cancel</button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Submitting..." : "Submit Visit Report"}
                </button>
            </div>
        </div>
            {/* Details part */}

            <div className="max-w-6xl mx-auto space-y-8">
                <SalesVisitsReportsDetails visitReports={visitReports}></SalesVisitsReportsDetails>
            </div>
        </div>
    );
}

/* ---------------- REUSABLE UI ---------------- */

function Section({ title, children }) {
    return (
        <div className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">{title}</h3>
            {children}
        </div>
    );
}

function Grid({ children }) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>;
}

function Input({ label, ...props }) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input {...props} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
    );
}

function RadioGroup({ label, name, value, onChange, options }) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">{label}</label>
            <div className="flex gap-4">
                {options.map((o) => (
                    <label key={o} className="flex items-center gap-1 text-sm">
                        <input type="radio" name={name} value={o} checked={value === o} onChange={onChange} />
                        {o}
                    </label>
                ))}
            </div>
        </div>
    );
}

function Chip({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm border ${active ? "bg-blue-50 border-blue-600 text-blue-600" : "hover:bg-gray-50"
                }`}
        >
            {label}
        </button>
    );
}
