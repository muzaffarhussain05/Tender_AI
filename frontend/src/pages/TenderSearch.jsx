import { useState } from "react";
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

const categories = ["Software & IT", "Construction", "Healthcare", "Infrastructure", "Energy"];

const statusColor = {
  OPEN: "bg-green-100 text-green-700",
  "CLOSING SOON": "bg-orange-100 text-orange-700",
  AWARDED: "bg-blue-100 text-blue-700",
};

export default function TenderSearch() {
  const { tenderList, bookmarkedIds, toggleBookmark } = useApp();
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["Software & IT"]);
  const [minMatch, setMinMatch] = useState(70);
  const [budgetRange, setBudgetRange] = useState("$100k - $500k");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("Relevance");
  const [page, setPage] = useState(1);
  const totalPages = 48;

  const toggleCategory = (c) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const filtered = tenderList.filter(
    (t) =>
      (selectedCategories.length === 0 || selectedCategories.includes(t.category)) &&
      t.match >= minMatch
  );

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
                <h3 className="font-semibold text-[#0b1c30] text-sm">Advanced Filters</h3>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Category</label>
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                        className="w-4 h-4 rounded border-gray-300 text-[#0058be]"
                      />
                      <span className="text-sm text-[#45464d]">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Min Match Score</label>
                  <span className="text-[10px] font-semibold text-[#0058be]">{minMatch}%+</span>
                </div>
                <input type="range" min={0} max={100} value={minMatch} onChange={(e) => setMinMatch(+e.target.value)} className="w-full accent-[#0058be]" />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Budget Range</label>
                <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none">
                  {["$100k - $500k", "$500k - $2M", "$2M - $10M", "$10M+"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Location</label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Global / Remote" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block mb-2">Closing Date</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-gray-400 mb-1">FROM</div>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 mb-1">TO</div>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategories([]); setMinMatch(0); setBudgetRange("$100k - $500k"); setLocation(""); setDateFrom(""); setDateTo(""); }}
                className="w-full py-2 border border-[#c6c6cd] rounded-lg text-sm text-[#45464d] hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>

            <div className="mt-auto p-4">
              <div className="bg-[#0b1c30] rounded-xl p-4 text-white">
                <h4 className="text-sm font-semibold mb-1">Export Data</h4>
                <p className="text-[10px] text-gray-400 mb-3">Download your current filtered results for offline analysis.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1 py-1.5 bg-[#1a2d44] rounded-lg text-xs hover:bg-[#243d57] transition-colors">
                    <FileDown size={12} /> PDF
                  </button>
                  <button className="flex items-center justify-center gap-1 py-1.5 bg-[#1a2d44] rounded-lg text-xs hover:bg-[#243d57] transition-colors">
                    <FileSpreadsheet size={12} /> Excel
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <SlidersHorizontal size={15} className="text-[#0058be]" />
            </button>
            <span className="text-sm text-[#6b7280]">
              <strong className="text-[#0b1c30]">{filtered.length}</strong> tenders found
            </span>
            <span className="text-sm text-[#6b7280]">| Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm text-[#0058be] font-medium bg-transparent border-none outline-none cursor-pointer">
              {["Relevance", "Closing Date", "Budget", "Match Score"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="flex-1" />
            <div className="flex gap-1">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#dce8ff] text-[#0058be]" : "hover:bg-gray-100 text-gray-400"}`}>
                <LayoutList size={15} />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#dce8ff] text-[#0058be]" : "hover:bg-gray-100 text-gray-400"}`}>
                <LayoutGrid size={15} />
              </button>
            </div>
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
                    <div className="text-xl font-bold text-[#0058be]">{t.match}%</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#0b1c30] text-sm">{t.title}</h3>
                      <button onClick={() => toggleBookmark(t.id)} className="shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors">
                        {bookmarkedIds.has(t.id) ? <BookmarkCheck size={14} className="text-[#0058be]" /> : <Bookmark size={14} className="text-gray-400" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-2">
                      <Building2 size={11} /> {t.org}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1"><DollarSign size={11} /> {t.budget}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> Ends {t.closing}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {t.location}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>{t.status}</span>
                    <div className="flex gap-1">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[#eff4ff] text-[#0058be] rounded font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-200 bg-white shrink-0">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#45464d] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft size={12} /> Previous
            </button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs transition-colors ${page === p ? "bg-[#0058be] text-white" : "hover:bg-gray-100 text-[#45464d]"}`}>{p}</button>
            ))}
            <span className="text-xs text-gray-400">...</span>
            <button onClick={() => setPage(totalPages)} className="w-8 h-8 rounded-lg text-xs hover:bg-gray-100 text-[#45464d] transition-colors">{totalPages}</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#45464d] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}