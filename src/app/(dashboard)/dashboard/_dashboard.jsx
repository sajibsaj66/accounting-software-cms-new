"use client";
import React, { useEffect, useState } from "react";
import ActionRequiredCard from "@/component/DashBoard/ActionRequiredCard";
import RecentVisits from "@/component/DashBoard/RecentVisits";
import StatCard from "@/component/DashBoard/StatCard";
import UpcomingFollowUps from "@/component/DashBoard/UpcomingFollow";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
    const [visits, setVisits] = useState([]);
    const { user } = useAuth();
    

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

    return (
        <div className="min-h-screen bg-zinc-100 p-6">
            {user?.email && (
                <p className="text-sm text-zinc-600 mb-4">Signed in as {user.email}</p>
            )}
            <StatCard visits={visits} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RecentVisits visits={visits} />
                <UpcomingFollowUps visits={visits} />
            </div>

            <ActionRequiredCard visits={visits} />
        </div>
    );
};

export default Dashboard;
