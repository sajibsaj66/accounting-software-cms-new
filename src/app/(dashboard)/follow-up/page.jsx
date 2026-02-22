"use client";

import { useEffect, useState } from "react";
import OverdueFollowUps from "@/component/FollowUp/OverdueFollowUps";
import Statcard from "@/component/FollowUp/Statcard";
import UpcomingFollowUps from "@/component/FollowUp/UpcomingFollowUps";

export default function FollowUp() {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/visit-report`
                );
                const data = await res.json();
                setVisits(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Statcard visits={visits} />
            <OverdueFollowUps visits={visits} />
            <UpcomingFollowUps visits={visits} />
        </div>
    );
}
