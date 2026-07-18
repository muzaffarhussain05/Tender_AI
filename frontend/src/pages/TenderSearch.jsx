import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  BookmarkCheck,
  Bookmark,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";



const statusColor = {
  OPEN: "bg-green-100 text-green-700",
  "CLOSING SOON": "bg-orange-100 text-orange-700",
  AWARDED: "bg-blue-100 text-blue-700",
};

export default function TenderSearch() {
  const {
    tenderList,
    bookmarkedIds,
    toggleBookmark,
    loadTenders,
    filters,
    setFilters,

    currentPage,
    totalPages,
    totalItems,
    selectedCategory,
    setSelectedCategory,
    isLoading,
  } = useApp();
  const [showFilters, setShowFilters] = useState(true);
 
  const [minMatch, setMinMatch] = useState(70);
  const [budgetRange, setBudgetRange] = useState("$100k - $500k");





  const categories = [
    "All",
  "Miscellaneous",
  "Services",
  "Civil Works",
  "Electrical Items",
  
];

const selectCategory = (category) => {
  setSelectedCategory(category);

  setFilters((prev) => ({
    ...prev,
    category: category === "All" ? "" : category,
  }));
};
  const handleLocationChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: value,
    }));
  };

  useEffect(() => {
    loadTenders();
  }, [loadTenders]);

  const filtered = tenderList;
  const handleSearch = () => {
    loadTenders(filters, 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      loadTenders(filters, currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      loadTenders(filters, currentPage - 1);
    }
  };

  const statusColor = {
    Published: "bg-green-100 text-green-700",
    PublishedCorrigendum: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Awarded: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search by tender ID, keyword, or organization..." />
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        {showFilters && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 space-y-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#0058be]" />
                <h3 className="font-semibold text-[#0b1c30] text-sm">
                  Advanced Filters
                </h3>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === c}
                        onChange={() => selectCategory(c)}
                        className="w-4 h-4 text-[#0058be]"
                      />
                      <span className="text-sm text-[#45464d]">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none"
                >
                  {["$100k - $500k", "$500k - $2M", "$2M - $10M", "$10M+"].map(
                    (r) => (
                      <option key={r}>{r}</option>
                    ),
                  )}
                </select>
              </div> */}

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Lahore"
                    value={filters.location}
                    onChange={handleLocationChange}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">
                  Closing Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-gray-400 mb-1">FROM</div>
                    <input
                      type="date"
                      value={filters.closing_from}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          closing_from: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 mb-1">TO</div>
                    <input
                      type="date"
                      value={filters.closing_to}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          closing_to: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("");

                  setMinMatch(0);

                  setBudgetRange("$100k - $500k");

                  setFilters({
                    q: "",

                    category: "",
                    organization: "",
                    location: "",
                    status: "",

                    publish_from: "",
                    publish_to: "",

                    closing_from: "",
                    closing_to: "",

                    sort_by: "publish_date",
                    sort_order: "desc",
                  });

                  loadTenders({}, 1);
                }}
                className="w-full py-2 border border-[#c6c6cd] rounded-lg text-sm text-[#45464d] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

           
          </motion.aside>
        )}

        {/* Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SlidersHorizontal size={15} className="text-[#0058be]" />
            </button>
            <span className="text-sm text-[#6b7280]">
              <strong className="text-[#0b1c30]">{totalItems}</strong> tenders
              found
            </span>
            <span className="text-sm text-[#6b7280]">| Sort by:</span>
            <select
              value={filters.sort_by}
              onChange={(e) => {
                handleSortChange(e.target.value);
                loadTenders(
                  {
                    ...filters,
                    sort_by: e.target.value,
                  },
                  1,
                );
              }}
              className="text-sm text-[#0058be] font-medium bg-transparent border-none outline-none cursor-pointer"
            >
              {[
                { label: "Publish Date", value: "publish_date" },
                { label: "Closing Date", value: "closing_date" },
                { label: "Title", value: "title" },
                { label: "Organization", value: "organization" },
              ].map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="flex-1" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-[#eff4ff] flex flex-col items-center justify-center border border-[#dce8ff]">
                    <div className="text-[10px] text-[#6b7280]">MATCH</div>
                    <div className="text-xl font-bold text-[#0058be]">
                      #{t.id}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#0b1c30] text-sm">
                        {t.title}
                      </h3>
                      <button
                        onClick={() => toggleBookmark(t.id)}
                        className="shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {bookmarkedIds.has(t.id) ? (
                          <BookmarkCheck size={14} className="text-[#0058be]" />
                        ) : (
                          <Bookmark size={14} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-2">
                      <Building2 size={11} /> {t.organization}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> Ends{" "}
                        {new Date(t.closing_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {t.location}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-200 bg-white shrink-0">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#45464d] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={12} /> Previous
            </button>
            {Array.from(
              {
                length: Math.min(5, totalPages),
              },
              (_, i) => Math.max(1, currentPage - 2) + i,
            )
              .filter((p) => p <= totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => loadTenders(filters, p)}
                  className={`w-8 h-8 rounded-lg text-xs transition-colors ${
                    currentPage === p
                      ? "bg-[#0058be] text-white"
                      : "hover:bg-gray-100 text-[#45464d]"
                  }`}
                >
                  {p}
                </button>
              ))}
            <span className="text-xs text-gray-400">...</span>
            <button
              onClick={() => loadTenders(filters, totalPages)}
              className="w-8 h-8 rounded-lg text-xs hover:bg-gray-100 text-[#45464d] transition-colors"
            >
              {totalPages}
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#45464d] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
