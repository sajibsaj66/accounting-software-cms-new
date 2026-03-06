"use client";

import SalesVisitsReportsDetails from "@/component/salesVisitsReports/SalesVisitsReportsDetails";
import SearchActionBar from "@/component/customer/SearchActionBar";
import useAuth from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_PRODUCT_CATEGORIES = ["Bearing", "Lubrication", "Belt"];
const DEFAULT_PRODUCT_CATEGORY_ROWS = DEFAULT_PRODUCT_CATEGORIES.map((name, idx) => ({
    id: idx + 1,
    category_name: name,
}));
const EMPTY_MEETING_PERSON = {
    meeting_person_name: "",
    meeting_department: "",
    meeting_designation: "",
    meeting_person_criteria: "",
    meeting_phone: "",
    meeting_email: "",
};

function normalizeCategoryRow(row, idx = 0) {
    if (!row) return null;

    if (typeof row === "string") {
        const name = row.trim();
        if (!name) return null;
        return { id: idx + 1, category_name: name, status: "active" };
    }

    const rawId = row?.id || row?.product_category_id || idx + 1;
    const id = Number(rawId) || idx + 1;
    const category_name = (
        row?.category_name ||
        row?.product_category ||
        row?.name ||
        ""
    )
        .toString()
        .trim();

    if (!category_name) return null;
    const status = String(row?.status || "active").toLowerCase();
    return { id, category_name, status };
}

function extractCategoryRows(responseData) {
    const raw =
        responseData?.data?.data ||
        responseData?.data?.rows ||
        responseData?.data?.result ||
        responseData?.data ||
        [];
    const list = Array.isArray(raw) ? raw : [];
    const normalized = list
        .map((row, idx) => normalizeCategoryRow(row, idx))
        .filter(Boolean)
        .filter((item) => item.status === "active");

    if (!normalized.length) return DEFAULT_PRODUCT_CATEGORY_ROWS;

    const seen = new Set();
    const deduped = [];
    for (const item of normalized) {
        const key = item.category_name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(item);
    }
    return deduped;
}

function normalizeMeetingPersonEntry(person) {
    return {
        meeting_person_name: (person?.meeting_person_name || "").toString().trim(),
        meeting_department: (person?.meeting_department || "").toString().trim(),
        meeting_designation: (person?.meeting_designation || "").toString().trim(),
        meeting_person_criteria: (person?.meeting_person_criteria || "").toString().trim(),
        meeting_phone: (person?.meeting_phone || "").toString().trim(),
        meeting_email: (person?.meeting_email || "").toString().trim(),
    };
}

function extractMeetingPersons(item) {
    const raw = item?.meeting_persons_details;
    if (Array.isArray(raw)) {
        const list = raw.map(normalizeMeetingPersonEntry).filter((person) => Object.values(person).some(Boolean));
        return list.length ? list : [{ ...EMPTY_MEETING_PERSON }];
    }

    if (typeof raw === "string" && raw.trim()) {
        try {
            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed)
                ? parsed.map(normalizeMeetingPersonEntry).filter((person) => Object.values(person).some(Boolean))
                : [];
            if (list.length) return list;
        } catch (_e) {
            // Keep fallback behavior below when invalid JSON is received.
        }
    }

    const legacy = normalizeMeetingPersonEntry({
        meeting_person_name: item?.meeting_person_name || "",
        meeting_department: item?.meeting_department || "",
        meeting_designation: item?.meeting_designation || "",
        meeting_person_criteria: item?.meeting_person_criteria || "",
        meeting_phone: item?.meeting_phone || "",
        meeting_email: item?.meeting_email || "",
    });

    return Object.values(legacy).some(Boolean) ? [legacy] : [{ ...EMPTY_MEETING_PERSON }];
}

export default function CreateVisitReport() {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [productCategoryOptions, setProductCategoryOptions] = useState(DEFAULT_PRODUCT_CATEGORY_ROWS);
    const [customProductCategory, setCustomProductCategory] = useState("");
    const [addingCategory, setAddingCategory] = useState(false);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");
    const [editingReportId, setEditingReportId] = useState(null);

  const { user, token } = useAuth();

    // get sales visits reports
    const { data: visitReportsData = [], isLoading } = useQuery({
    queryKey: ['get-sales-visits-reports'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-sales-customer-visit-reports`, { headers: { "auth-token": token } })
            return res.data;
    }
    })
    
  let visitReports = visitReportsData.data;
  

    const [form, setForm] = useState({
        visit_date: "",
        sales_person_name: user?.full_name || "",
        customer_assignment: "Self",

        customer_name: "",
        customer_phone: "",
        customer_area: "",
        customer_type: "Existing",
        last_po_reference: "",
        competitor: "",

        product_category: "",
        product_category_id: "",
        customer_priority: "A",
        visit_agenda: [],

        meeting_persons_details: [{ ...EMPTY_MEETING_PERSON }],

        previous_plan_feedback: "",
        next_plan: "",
        next_followup_date: "",
        status: "Reschedule",
    });

    useEffect(() => {
        if (user?.full_name) {
            setForm((prev) => ({ ...prev, sales_person_name: user.full_name }));
        }
    }, [user?.full_name]);

    useEffect(() => {
        if (!token) return;
        const fetchCustomers = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-sales-customers`,
                    { headers: { "auth-token": token } },
                );
                setCustomerOptions(res?.data?.data ?? []);
            } catch (error) {
                console.error("Failed to load customers:", error);
            }
        };

        fetchCustomers();
    }, [token]);

    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/get-product-categories`,
                );

                setProductCategoryOptions(extractCategoryRows(res));
            } catch (error) {
                console.error("Failed to load product categories:", error);
                setProductCategoryOptions(DEFAULT_PRODUCT_CATEGORY_ROWS);
            }
        };

        fetchProductCategories();
    }, []);

    useEffect(() => {
        const editId = searchParams.get("editId");
        if (!editId) {
            setEditingReportId(null);
            return;
        }
        if (typeof window === "undefined") return;

        const raw = sessionStorage.getItem("salesVisitPrefill");
        if (!raw) return;

        try {
            const item = JSON.parse(raw);
            const parsedEditId = Number.parseInt(item?.id || editId, 10);
            const parsedAgenda = Array.isArray(item?.visit_agenda)
                ? item.visit_agenda
                : typeof item?.visit_agenda === "string"
                    ? (() => {
                          try {
                              const a = JSON.parse(item.visit_agenda);
                              return Array.isArray(a) ? a : [];
                          } catch (_e) {
                              return [];
                          }
                      })()
                    : [];

            if (Number.isInteger(parsedEditId) && parsedEditId > 0) {
                setEditingReportId(parsedEditId);
            }

            setForm((prev) => ({
                ...prev,
                visit_date: item?.visit_date || "",
                sales_person_name: item?.sales_person_name || prev.sales_person_name,
                customer_assignment: item?.customer_assignment || "Self",
                customer_name: item?.customer_name || "",
                customer_phone: item?.customer_phone || "",
                customer_area: item?.customer_area || "",
                customer_type: item?.customer_type || "Existing",
                last_po_reference: item?.last_po_reference || "",
                competitor: item?.competitor || "",
                product_category: item?.product_category || "",
                product_category_id: item?.product_category_id || "",
                customer_priority: item?.customer_priority || "A",
                visit_agenda: parsedAgenda,
                meeting_persons_details: extractMeetingPersons(item),
                previous_plan_feedback: item?.previous_feedback || "",
                next_plan: item?.next_action_plan || "",
                next_followup_date: item?.next_followup_date || "",
                status: item?.status || "Reschedule",
            }));
        } catch (error) {
            console.error("Failed to prefill visit form:", error);
        } finally {
            sessionStorage.removeItem("salesVisitPrefill");
        }
    }, [searchParams]);

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
                customer_area:
                    selectedCustomer?.customer_area ||
                    selectedCustomer?.customer_area_name ||
                    selectedCustomer?.area_name ||
                    "",
            }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleAgenda = (item) => {
        setForm((prev) => ({
            ...prev,
            visit_agenda: prev.visit_agenda.includes(item)
                ? prev.visit_agenda.filter((i) => i !== item)
                : [...prev.visit_agenda, item]
        }));
    };

    const updateMeetingPerson = (index, key, value) => {
        setForm((prev) => ({
            ...prev,
            meeting_persons_details: prev.meeting_persons_details.map((person, i) =>
                i === index ? { ...person, [key]: value } : person,
            ),
        }));
    };

    const addMeetingPersonRow = () => {
        setForm((prev) => ({
            ...prev,
            meeting_persons_details: [...prev.meeting_persons_details, { ...EMPTY_MEETING_PERSON }],
        }));
    };

    const removeMeetingPersonRow = (indexToRemove) => {
        setForm((prev) => {
            if (prev.meeting_persons_details.length <= 1) {
                return {
                    ...prev,
                    meeting_persons_details: [{ ...EMPTY_MEETING_PERSON }],
                };
            }
            return {
                ...prev,
                meeting_persons_details: prev.meeting_persons_details.filter((_, index) => index !== indexToRemove),
            };
        });
    };

    const addCustomProductCategory = async () => {
        const value = customProductCategory.trim();
        if (!value) return;

        const existingOption = productCategoryOptions.find(
            (item) => item.category_name?.toLowerCase() === value.toLowerCase(),
        );

        if (existingOption) {
            setForm((prev) => ({
                ...prev,
                product_category: existingOption.category_name,
                product_category_id: existingOption.id,
            }));
            setCustomProductCategory("");
            return;
        }

        setAddingCategory(true);
        try {
            const result = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/create-product-category`,
                {
                    category_name: value,
                    status: "active",
                },
            );

            if (result?.data?.error) {
                throw new Error(result?.data?.message || "Category add failed");
            }

            const created =
                result?.data?.data ||
                result?.data?.row ||
                result?.data?.category ||
                result?.data ||
                {};
            const createdCategory =
                normalizeCategoryRow(created) ||
                normalizeCategoryRow(result?.data?.data?.category);
            let newId = Number(createdCategory?.id || created?.insertId || 0);

            if (!newId) {
                const refreshRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/get-product-categories`,
                );
                const refreshRows = extractCategoryRows(refreshRes);
                const matched = refreshRows.find((row) => {
                    const name =
                        row?.category_name ||
                        row?.product_category ||
                        row?.name ||
                        "";
                    return name.toLowerCase() === value.toLowerCase();
                });
                newId = Number(matched?.id || matched?.product_category_id || 0);
            }

            if (!newId) {
                throw new Error("Category created but category id not found");
            }

            setProductCategoryOptions((prev) => {
                const exists = prev.some(
                    (item) =>
                        item.category_name?.toLowerCase() === value.toLowerCase(),
                );
                if (exists) return prev;
                return [...prev, { id: newId, category_name: value, status: "active" }];
            });
            setForm((prev) => ({
                ...prev,
                product_category: value,
                product_category_id: newId,
            }));
            setCustomProductCategory("");
        } catch (error) {
            console.error("Failed to add product category:", error);
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to add product category",
            );
        } finally {
            setAddingCategory(false);
        }
    };

    const handleCustomerAdded = (newCustomer) => {
        if (!newCustomer?.customer_name) return;

        setCustomerOptions((prev) => {
            const exists = prev.some(
                (item) =>
                    item.customer_name?.toLowerCase() ===
                    newCustomer.customer_name?.toLowerCase(),
            );

            if (exists) return prev;
            return [...prev, newCustomer];
        });

        setForm((prev) => ({
            ...prev,
            customer_name: newCustomer.customer_name,
            customer_phone: newCustomer.customer_phone || "",
            customer_area:
                newCustomer.customer_area ||
                newCustomer.customer_area_name ||
                newCustomer.area_name ||
                "",
        }));
    };

    const handleSubmit = async () => {
        if (!form.visit_date || !form.sales_person_name || !form.customer_name) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);

        try {
            const normalizedStatus =
                String(form.status || "")
                    .trim()
                    .toLowerCase() === "complete"
                    ? "Complete"
                    : "Reschedule";

            const normalizedMeetingPersonsDetails = (form.meeting_persons_details || [])
                .map(normalizeMeetingPersonEntry)
                .filter((person) => Object.values(person).some(Boolean));

            if (!normalizedMeetingPersonsDetails.length) {
                alert("Please add at least one meeting person");
                return;
            }

            const hasIncompleteMeetingPerson = normalizedMeetingPersonsDetails.some(
                (person) =>
                    !person.meeting_person_name ||
                    !person.meeting_department ||
                    !person.meeting_phone,
            );

            if (hasIncompleteMeetingPerson) {
                alert("Each meeting person must include name, department and phone number");
                return;
            }

            const payload = {
                visit_date: form.visit_date,
                sales_person_name: form.sales_person_name,
                customer_assignment: form.customer_assignment,
                customer_name: form.customer_name,
                customer_phone: form.customer_phone,
                customer_area: form.customer_area,
                customer_type: form.customer_type,
                customer_priority: form.customer_priority,
                competitor: form.competitor,
                last_po_reference: form.last_po_reference,
                product_category_id: form.product_category_id
                    ? Number(form.product_category_id)
                    : null,
                visit_agenda: form.visit_agenda,
                meeting_persons_details: normalizedMeetingPersonsDetails,
                previous_feedback: form.previous_plan_feedback,
                next_action_plan: form.next_plan,
                next_followup_date: form.next_followup_date,
                status: normalizedStatus,
            };

            const result = editingReportId
                ? await axios.patch(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/update-sales-customer-visit-report/${editingReportId}`,
                  payload,
                      { headers: { "auth-token": token } }
                  )
                : await axios.post(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-sales-customer-visit-report`,
                  payload,
                      { headers: { "auth-token": token } }
                  );

            if (result?.data?.error) {
                throw new Error(result?.data?.message || "Submission failed");
            }

            await queryClient.invalidateQueries({
                queryKey: ["get-sales-visits-reports"],
            });

            alert(
                editingReportId
                    ? "✅ Visit report updated successfully"
                    : "✅ Visit report submitted successfully",
            );

            setForm({
                visit_date: "",
                sales_person_name: "",
                customer_assignment: "Self",

                customer_name: "",
                customer_phone: "",
                customer_area: "",
                customer_type: "Existing",
                last_po_reference: "",
                competitor: "",

                product_category: "",
                product_category_id: "",
                customer_priority: "A",
                visit_agenda: [],

                meeting_persons_details: [{ ...EMPTY_MEETING_PERSON }],

                previous_plan_feedback: "",
                next_plan: "",
                next_followup_date: "",
                status: "Reschedule",
            });
            setEditingReportId(null);

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
              <Input
                label="Visit Date"
                type="date"
                name="visit_date"
                value={form.visit_date}
                onChange={handleChange}
                required
              />
              <Input
                readOnly
                label="Sales Person Name"
                name="sales_person_name"
                value={form.sales_person_name}
                onChange={handleChange}
                required
              />

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
              <div className="space-y-1 relative">
                <label className="text-sm text-gray-600">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 pr-10 text-sm bg-white"
                    required
                  >
                    <option value="">Select customer</option>
                    {customerOptions.map((customer, idx) => (
                      <option
                        key={
                          customer.customer_id ||
                          customer.id ||
                          `${customer.customer_name}-${idx}`
                        }
                        value={customer.customer_name}
                      >
                        {customer.customer_name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="absolute right-1 top-0 z-10 cursor-pointer -translate-y-1/2 bg-white p-1 text-green-500 hover:bg-blue-50"
                    title="Add customer"
                  >
                    <Plus size={21} />
                  </button>
                </div>
              </div>

              <RadioGroup
                label="Customer Type"
                name="customer_type"
                value={form.customer_type}
                onChange={handleChange}
                options={["New", "Existing"]}
              />

              <Input
                label="Last PO Reference"
                name="last_po_reference"
                value={form.last_po_reference}
                onChange={handleChange}
              />
              <Input
                label="customer_area"
                name="customer_area"
                value={form.customer_area}
                onChange={handleChange}
                readOnly
              />

              <Input
                readOnly
                label="Customer Phone"
                name="customer_phone"
                value={form.customer_phone}
              />
              <Input
                label="Competitor"
                name="competitor"
                value={form.competitor}
                onChange={handleChange}
              />
            </Grid>
          </Section>

          {/* PRODUCT CATEGORY */}
          <Section title="Product Category">
            <div className="flex gap-3 flex-wrap">
              {productCategoryOptions.map((item) => (
                <Chip
                  key={item.id}
                  label={item.category_name}
                  active={form.product_category_id === item.id}
                  onClick={() =>
                    setForm({
                      ...form,
                      product_category: item.category_name,
                      product_category_id: item.id,
                    })
                  }
                />
              ))}
              <input
                placeholder="Others (specify)"
                className="border rounded-lg px-3 py-2 text-sm"
                value={customProductCategory}
                onChange={(e) => setCustomProductCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void addCustomProductCategory();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => void addCustomProductCategory()}
                disabled={addingCategory}
                className="border cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                {addingCategory ? "Adding..." : "Add"}
              </button>
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
                "Support & Service",
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
            <div className="space-y-4">
              {(form.meeting_persons_details || []).map((person, index) => (
                <div key={`meeting-person-${index}`} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Meeting Person {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeMeetingPersonRow(index)}
                      className="rounded-md border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                  <Grid>
                    <Input
                      label="Dealing Person Name"
                      value={person.meeting_person_name}
                      onChange={(e) => updateMeetingPerson(index, "meeting_person_name", e.target.value)}
                      required
                    />
                    <Input
                      label="Department"
                      value={person.meeting_department}
                      onChange={(e) => updateMeetingPerson(index, "meeting_department", e.target.value)}
                      required
                    />
                    <Input
                      label="Designation"
                      value={person.meeting_designation}
                      onChange={(e) => updateMeetingPerson(index, "meeting_designation", e.target.value)}
                    />
                    <Input
                      label="Meeting Person Criteria"
                      value={person.meeting_person_criteria}
                      onChange={(e) => updateMeetingPerson(index, "meeting_person_criteria", e.target.value)}
                    />
                    <Input
                      label="Phone Number"
                      value={person.meeting_phone}
                      onChange={(e) => updateMeetingPerson(index, "meeting_phone", e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      value={person.meeting_email}
                      onChange={(e) => updateMeetingPerson(index, "meeting_email", e.target.value)}
                    />
                  </Grid>
                </div>
              ))}
              <button
                type="button"
                onClick={addMeetingPersonRow}
                className="rounded-lg border px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
              >
                Add More Meeting Person
              </button>
            </div>
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
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Next Plan <span className="text-red-500">*</span>
                </label>
                <select
                  name="next_plan"
                  value={form.next_plan}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  required
                >
                  <option value="">Select next plan</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Order closing">Order closing</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  required
                >
                  <option value="">Select status</option>
                  <option value="Reschedule">Reschedule</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <Input
                label="Next Follow-up Date"
                type="date"
                name="next_followup_date"
                value={form.next_followup_date}
                onChange={handleChange}
                required
              />
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
              {loading
                ? editingReportId
                  ? "Updating..."
                  : "Submitting..."
                : editingReportId
                  ? "Update Visit Report"
                  : "Submit Visit Report"}
            </button>
          </div>
        </div>
        {/* Details part */}

        <div className="max-w-6xl mx-auto space-y-8">
          <SalesVisitsReportsDetails
            visitReports={visitReports}
          ></SalesVisitsReportsDetails>
        </div>

        <SearchActionBar
          search={customerSearch}
          setSearch={setCustomerSearch}
          onAddCustomer={handleCustomerAdded}
          showToolbar={false}
          isAddCustomerOpenExternal={isAddCustomerOpen}
          setIsAddCustomerOpenExternal={setIsAddCustomerOpen}
        />
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
    const normalizedProps = { ...props };
    if (Object.prototype.hasOwnProperty.call(normalizedProps, "value")) {
        normalizedProps.value = normalizedProps.value ?? "";
    }

    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input {...normalizedProps} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
