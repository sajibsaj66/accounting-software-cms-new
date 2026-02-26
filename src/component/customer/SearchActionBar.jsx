"use client";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { Search, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

export default function SearchActionBar({ search, setSearch, onAddCustomer }) {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const lastVisitDate = watch("last_visit");

    const handleCustomerAdd = async (data) => {
        const payload = {
            customer_name: data.customer_name.trim(),
            customer_email: data.customer_email.trim(),
            customer_phone: data.customer_phone.trim(),
            customer_type: data.customer_type,
            customer_priority: data.customer_priority,
            last_visit: data.last_visit,
            next_followup: data.next_followup,
            status: data.status,
            assigned_sales_person_id: user?.id,
        };

        try {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/create-sales-customers`,
    payload
  );

  //  Success case
  

  if (!res.data.error) {
    alert("Customer created successfully");
    await queryClient.invalidateQueries({ queryKey: ["sales-customers"] });
    if (typeof onAddCustomer === "function") {
      onAddCustomer(payload);
    }
    reset();
    setIsAddCustomerOpen(false);
  }

} catch (error) {

  //  Server responded with error (400, 500 etc)
  if (error.response) {
    console.log("Server Error:", error.response.data);
    alert(error.response.data.message);
  }

  // Network error (server down)
  else if (error.request) {
    console.log("Network Error");
    alert("Server is not responding");
  }

  //  Other error
  else {
    console.log("Error:", error.message);
  }
}

        

        // if (typeof onAddCustomer === "function") {
        //     onAddCustomer(payload);
        // }

        
    };

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search customers name, email, phone ..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                <button
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                    <Plus size={16} />
                    Add Customer
                </button>
            </div>

            {isAddCustomerOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setIsAddCustomerOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-900">Add Customer</h2>
                            <button
                                onClick={() => setIsAddCustomerOpen(false)}
                                className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit(handleCustomerAdd)}
                            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    {...register("customer_name", {
                                        required: "Customer name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Customer name must be at least 2 characters",
                                        },
                                    })}
                                    placeholder="Enter customer name"
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customer_name && (
                                    <span className="text-red-500 text-xs">{errors.customer_name.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Customer Email
                                </label>
                                <input
                                    type="email"
                                    {...register("customer_email", {
                                        required: "Customer email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email address",
                                        },
                                    })}
                                    placeholder="name@example.com"
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customer_email && (
                                    <span className="text-red-500 text-xs">{errors.customer_email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Customer Phone
                                </label>
                                <input
                                    type="tel"
                                    {...register("customer_phone", {
                                        required: "Customer phone is required",
                                        pattern: {
                                            value: /^[0-9+\-\s()]{7,20}$/,
                                            message: "Enter a valid phone number",
                                        },
                                    })}
                                    placeholder="01700000000"
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customer_phone && (
                                    <span className="text-red-500 text-xs">{errors.customer_phone.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Type
                                </label>
                                <select
                                    {...register("customer_type", { required: "Type is required" })}
                                    className="w-full bg-gray-700 rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select type</option>
                                    <option value="New">New</option>
                                    <option value="Existing">Existing</option>
                                </select>
                                {errors.customer_type && (
                                    <span className="text-red-500 text-xs">{errors.customer_type.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Priority
                                </label>
                                <select
                                    {...register("customer_priority", { required: "Priority is required" })}
                                    className="w-full bg-gray-700 rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select priority</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                                {errors.customer_priority && (
                                    <span className="text-red-500 text-xs">{errors.customer_priority.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Last Visit
                                </label>
                                <input
                                    type="date"
                                    {...register("last_visit", { required: "Last visit date is required" })}
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.last_visit && (
                                    <span className="text-red-500 text-xs">{errors.last_visit.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Next Follow-up
                                </label>
                                <input
                                    type="date"
                                    {...register("next_followup", {
                                        required: "Next follow-up date is required",
                                        validate: (value) =>
                                            !lastVisitDate ||
                                            new Date(value) >= new Date(lastVisitDate) ||
                                            "Next follow-up cannot be before last visit",
                                    })}
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.next_followup && (
                                    <span className="text-red-500 text-xs">{errors.next_followup.message}</span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-700">
                                    Status
                                </label>
                                <select
                                    {...register("status", { required: "Status is required" })}
                                    className="w-full bg-gray-700 rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select status</option>
                                    <option value="active">active</option>
                                    <option value="inactive">inactive</option>
                                </select>
                                {errors.status && (
                                    <span className="text-red-500 text-xs">{errors.status.message}</span>
                                )}
                            </div>

                            <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddCustomerOpen(false)}
                                    className="rounded-xl border px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
