import { Search, Filter, Plus } from "lucide-react";

export default function SearchActionBar({ search, setSearch }) {
    return (
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
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus size={16} />
                Add Customer
            </button>
        </div>
    );
}
