import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Bookmark,
  Calendar,
  Star,
  Trash2,
  ExternalLink,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookmarkCheck,
} from "lucide-react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// const folders = [
//   { id: "all", label: "All Tenders", icon: Bookmark },
//   { id: "priority", label: "Priority", icon: AlertTriangle },
//   { id: "it", label: "IT Projects", icon: FolderOpen },
//   { id: "q4", label: "Q4 Targets", icon: Calendar },
//   { id: "awarded", label: "Awarded", icon: CheckCircle2 },
// ];

const statusColor = {
  Published: "bg-green-100 text-green-700",
  PublishedCorrigendum: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  Awarded: "bg-blue-100 text-blue-700",
};

export default function SavedTenders() {
  const {
    savedTenders,
    loadSavedTenders,
    removeSavedTender,
    removeSavedTenderById,
    bookmarkedIds,
    saveTenderById,
  } = useApp();
  const [activeFolder, setActiveFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState(
    new Set(["RFP-DXB-2024", "ENS-2024-007"]),
  );
  const navigate = useNavigate();
  // const folderCounts = folders.reduce((acc, f) => {
  //   acc[f.id] =
  //     f.id === "all"
  //       ? savedTenders.length
  //       : savedTenders.filter((t) => t.folder === f.id).length;
  //   return acc;
  // }, {});

  useEffect(() => {
    loadSavedTenders();
  }, []);

  // const filtered = savedTenders.filter(
  //   (t) =>
  //     (activeFolder === "all" || t.folder === activeFolder) &&
  //     (search === "" ||
  //       t.title.toLowerCase().includes(search.toLowerCase()) ||
  //       t.organization.toLowerCase().includes(search.toLowerCase())),
  // );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search tenders, organizations..." />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#0b1c30]">Saved Tenders</h2>
                <p className="text-xs text-[#6b7280]">
                  Manage and analyze your {savedTenders.length} saved
                  opportunities
                </p>
              </div>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {savedTenders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen size={28} className="text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">
                  No saved tenders in this folder
                </h3>
                <p className="text-xs text-[#6b7280] max-w-xs mb-4">
                  Start organizing your procurement pipeline by bookmarking
                  relevant opportunities.
                </p>
                <button
                  onClick={() => navigate("/tender-search")}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#0058be] text-white text-sm rounded-lg hover:bg-[#0047a1] transition-colors"
                >
                  <ExternalLink size={13} /> Explore Tenders →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                  <tr>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">
                      Tender Details
                    </th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">
                      Published Date
                    </th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">
                      Closing Date
                    </th>

                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {savedTenders.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-[#0b1c30]">
                          {t.title}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {t.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#0058be] hidden xl:table-cell">
                        {new Date(t.publish_date).toISOString().split("T")[0]}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold text-[#da0c0c]">
                          {new Date(t.closing_date).toISOString().split("T")[0]}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={async () => {
                              if (bookmarkedIds.has(t.tender_id)) {
                                console.log("removing");

                                await removeSavedTenderById(t.tender_id);
                              } else {
                                console.log("saving");

                                await saveTenderById(t.tender_id);
                              }
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            {bookmarkedIds.has(t.tender_id) ? (
                              <BookmarkCheck className="w-5 h-5 text-[#0058be]" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {savedTenders.length > 0 && (
            <div className="border-t border-gray-200 bg-white shrink-0">
              <div className="flex items-center px-5 py-2.5">
                <span className="text-xs text-[#6b7280]">
                  Showing 1-{savedTenders.length} of {savedTenders.length}{" "}
                  tenders
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
