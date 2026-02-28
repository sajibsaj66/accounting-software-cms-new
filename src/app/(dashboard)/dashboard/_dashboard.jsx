"use client";
import React, { useEffect, useState } from "react";
import ActionRequiredCard from "@/component/DashBoard/ActionRequiredCard";
import RecentVisits from "@/component/DashBoard/RecentVisits";
import StatCard from "@/component/DashBoard/StatCard";
import UpcomingFollowUps from "@/component/DashBoard/UpcomingFollow";

const Dashboard = () => {
    const [visits, setVisits] = useState([]);

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
        <div className="space-y-6">
            <StatCard visits={visits} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentVisits visits={visits} />
                <UpcomingFollowUps visits={visits} />
            </div>

            <ActionRequiredCard visits={visits} />
        </div>
    );
};

export default Dashboard;
