import { useState } from "react";
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
} from "lucide-react";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";

const folders = [
  { id: "all", label: "All Tenders", icon: Bookmark },
  { id: "priority", label: "Priority", icon: AlertTriangle },
  { id: "it", label: "IT Projects", icon: FolderOpen },
  { id: "q4", label: "Q4 Targets", icon: Calendar },
  { id: "awarded", label: "Awarded", icon: CheckCircle2 },
];

const statusColor = {
  OPEN: "bg-green-100 text-green-700",
  "CLOSING SOON": "bg-orange-100 text-orange-700",
  AWARDED: "bg-blue-100 text-blue-700",
};

export default function SavedTenders() {
  const { savedTenders, removeSavedTender } = useApp();
  const [activeFolder, setActiveFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState(new Set(["RFP-DXB-2024", "ENS-2024-007"]));

  const folderCounts = folders.reduce((acc, f) => {
    acc[f.id] = f.id === "all"
      ? savedTenders.length
      : savedTenders.filter((t) => t.folder === f.id).length;
    return acc;
  }, {});

  const filtered = savedTenders.filter(
    (t) =>
      (activeFolder === "all" || t.folder === activeFolder) &&
      (search === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.org.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStar = (id) => {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header searchPlaceholder="Search saved tenders..." />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0b1c30]">Folders</h3>
              <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <Plus size={14} className="text-[#0058be]" />
              </button>
            </div>
            <div className="space-y-0.5">
              {folders.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveFolder(id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFolder === id ? "bg-[#dce8ff] text-[#0058be] font-medium" : "text-[#45464d] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    {label}
                  </div>
                  <span className="text-xs">{folderCounts[id] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-3 mb-3 mt-auto">
            <div className="bg-[#0b1c30] rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-sm font-medium">AI Insights</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3">You have 4 new tenders matching your "IT Infrastructure" profile.</p>
              <button className="w-full py-2 bg-white text-[#0b1c30] rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                Review Matches
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#0b1c30]">Saved Tenders</h2>
                <p className="text-xs text-[#6b7280]">Manage and analyze your {savedTenders.length} saved opportunities</p>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen size={28} className="text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">No saved tenders in this folder</h3>
                <p className="text-xs text-[#6b7280] max-w-xs mb-4">Start organizing your procurement pipeline by bookmarking relevant opportunities.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0058be] text-white text-sm rounded-lg hover:bg-[#0047a1] transition-colors">
                  <ExternalLink size={13} /> Explore Tenders →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                  <tr>
                    <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">Tender Details</th>
                    <th className="text-right text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-4 py-3">AI Score</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[t.status]}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-[#0b1c30]">{t.title}</div>
                        <div className="text-xs text-[#6b7280]">{t.org} · Saved {t.saved}</div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0058be] rounded-full" style={{ width: `${t.match}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-[#0058be]">{t.match}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => toggleStar(t.id)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                            <Star size={13} className={starred.has(t.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                            <ExternalLink size={13} className="text-gray-400" />
                          </button>
                          <button onClick={() => removeSavedTender(t.id)} className="p-1.5 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 size={13} className="text-gray-300 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {filtered.length > 0 && (
            <div className="border-t border-gray-200 bg-white shrink-0">
              <div className="flex items-center px-5 py-2.5">
                <span className="text-xs text-[#6b7280]">Showing 1-{filtered.length} of {savedTenders.length} tenders</span>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-100">
                <div className="flex items-center gap-3 px-5 py-3 border-r border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center">
                    <Clock size={14} className="text-[#0058be]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">Next Submission</div>
                    <div className="text-sm font-bold text-[#0b1c30]">2 Days Remaining</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center">
                    <Sparkles size={14} className="text-[#0058be]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">Avg Match Score</div>
                    <div className="text-sm font-bold text-[#0b1c30]">84.2% Strength</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
