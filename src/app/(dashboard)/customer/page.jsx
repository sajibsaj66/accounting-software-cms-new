"use client";

import Customer from "@/component/customer/Customer";
import SearchActionBar from "@/component/customer/SearchActionBar";
import { useEffect, useState } from "react";

export default function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/visit-report`
                );
                const data = await res.json();

                // Convert visit data → unique customers
                const grouped = {};

                data.data.forEach((item) => {
                    if (!grouped[item.customer_name]) {
                        grouped[item.customer_name] = item;
                    } else {
                        // Keep latest visit
                        if (
                            new Date(item.visit_date) >
                            new Date(grouped[item.customer_name].visit_date)
                        ) {
                            grouped[item.customer_name] = item;
                        }
                    }
                });

                setCustomers(Object.values(grouped));
            } catch (error) {
                console.error(error);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div>
            <SearchActionBar search={search} setSearch={setSearch} />
            <Customer customers={customers} search={search} />
        </div>
    );
}
