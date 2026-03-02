"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import ActionRequiredCard from "@/component/DashBoard/ActionRequiredCard";
import RecentVisits from "@/component/DashBoard/RecentVisits";
import StatCard from "@/component/DashBoard/StatCard";
import FollowUpUpcomingFollowUps from "@/component/FollowUp/UpcomingFollowUps";


const Dashboard = () => {
    const [visits, setVisits] = useState([]);
    const [followupVisits, setFollowupVisits] = useState([]);
    const [recentQuotations, setRecentQuotations] = useState([]);
    const [loadingQuotations, setLoadingQuotations] = useState(false);
    const authInfo = useAuth();
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = authInfo?.token || authInfo?.accessToken;

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/visit-report`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch");
                }

                const data = await res.json();
                setVisits(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVisits();
    }, []);

    useEffect(() => {
        const fetchFollowupVisits = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/get-sales-customer-visit-reports`
                );
                setFollowupVisits(res?.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch follow-up visits", error);
                setFollowupVisits([]);
            }
        };
        fetchFollowupVisits();
    }, []);

    useEffect(() => {
        if (!API_URL || !token) return;
        const fetchRecentQuotations = async () => {
            setLoadingQuotations(true);
            try {
                const res = await axios.post(
                    `${API_URL}/api/get-quotations`,
                    { reqPayload: { selectedSearchType: "All" } },
                    { headers: { "auth-token": token } }
                );
                const rows = Array.isArray(res?.data?.message) ? res.data.message : [];
                setRecentQuotations(rows.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch recent quotations", error);
                setRecentQuotations([]);
            } finally {
                setLoadingQuotations(false);
            }
        };
        fetchRecentQuotations();
    }, [API_URL, token]);

    const toDate = (value) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toISOString().split("T")[0];
    };

    return (
        <div className="space-y-6">
            <StatCard visits={visits} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentVisits visits={visits} />
                 <ActionRequiredCard visits={visits} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FollowUpUpcomingFollowUps visits={followupVisits} />
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200">
                        <h3 className="font-semibold text-[28px] leading-none text-zinc-900">
                            Recently Quotation Invoices
                        </h3>
                    </div>
                    <div className="divide-y">
                        {loadingQuotations && (
                            <div className="p-6 text-sm text-zinc-500 text-center">Loading quotations...</div>
                        )}
                        {!loadingQuotations && recentQuotations.length === 0 && (
                            <div className="p-6 text-sm text-zinc-500 text-center">No quotation invoice found.</div>
                        )}
                        {!loadingQuotations &&
                            recentQuotations.map((q, i) => (
                                <div key={q?.sale_id ?? i} className="px-6 py-4 flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-zinc-900">{q?.sale_invoice || "-"}</p>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            {q?.customer_name || "Customer"} • {toDate(q?.sale_created_isodt)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-zinc-800">
                                        {Number(q?.sale_total_amount || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

           
        </div>
    );
};

export default Dashboard;
