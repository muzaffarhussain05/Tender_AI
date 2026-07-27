import { Search, Bell, RotateCcw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
const pageTitles = {
  "/dashboard": "Dashboard",
  "/ai-assistant": "AI Assistant",
  "/tender-search": "Tender Search",
  "/saved-tenders": "Saved Tenders",
  "/chat-history": "Chat History",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function Header({ searchPlaceholder = "Search..." }) {
  const location = useLocation();
  const { currentUser, tenderList, filters, setFilters, loadTenders } =
    useApp();
  void pageTitles[location.pathname];
  const navigate = useNavigate();

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSearch = () => {
    navigate("/tender-search");
    loadTenders(filters, 1);
  };

  console.log(tenderList);

  return (
    <header className="flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
      <div className="relative flex-1 max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.q}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              q: e.target.value,
            }))
          }
          className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg text-sm outline-none focus:border-[#0058be] placeholder-gray-400"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#45464d]">
          <Bell size={17} />
        </button> */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#45464d]">
          <RotateCcw size={17} />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <span className="text-xs text-[#6b7280] hidden lg:block">
          {dateStr}
        </span>
      </div>
    </header>
  );
}
