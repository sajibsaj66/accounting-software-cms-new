"use client";

import Customer from "@/component/customer/Customer";
import SearchActionBar from "@/component/customer/SearchActionBar";
import { useState } from "react";

export default function CustomerPage() {
    const [search, setSearch] = useState("");

    return (
        <div>
            <SearchActionBar
                search={search}
                setSearch={setSearch}
            />
            <Customer search={search} />
        </div>
    );
}
