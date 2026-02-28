"use client";

import { useQuery } from "@tanstack/react-query";
import OverdueFollowUps from "@/component/FollowUp/OverdueFollowUps";
import Statcard from "@/component/FollowUp/Statcard";
import UpcomingFollowUps from "@/component/FollowUp/UpcomingFollowUps";
import axios from "axios";

export default function FollowUp() {
    const { data: visitReportsData = [], isLoading } = useQuery({
        queryKey: ["get-sales-visits-reports"],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/get-sales-customer-visit-reports`,
            );
            return res.data;
        },
        refetchOnWindowFocus: true,
    });

    const visits = visitReportsData?.data || [];

    return (
        <div className="space-y-6">
            {isLoading && <p className="text-sm text-zinc-500">Loading follow-up data...</p>}
            <Statcard visits={visits} />
            <OverdueFollowUps visits={visits} />
            <UpcomingFollowUps visits={visits} />
        </div>
    );
}
