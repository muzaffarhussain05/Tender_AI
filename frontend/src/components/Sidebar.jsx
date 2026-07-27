import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Search,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { to: "/tender-search", icon: Search, label: "Tender Search" },
  { to: "/saved-tenders", icon: Bookmark, label: "Saved Tenders" },
];

const bottomItems = [
  // { to: "/settings", icon: Settings, label: "Settings" },
  // { to: "/analytics", icon: HelpCircle, label: "Support" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const navigate = useNavigate();
  const { chatHistory, currentUser, openChat, removeChatByTenderId } = useApp();
  const [openMenu, setOpenMenu] = useState(null);
  const filtered = chatHistory?.filter((item) =>
    item?.title?.toLowerCase()?.includes(historySearch.toLowerCase()),
  );

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
  const menuRef = useRef(null);
  const handlenavigate = async (item) => {
    await openChat(item);
    navigate("/ai-assistant");
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);
  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-[#0058be] flex items-center justify-center shrink-0">
          <FileText size={16} color="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="text-[#0b1c30] font-semibold text-sm leading-tight whitespace-nowrap">
                Tender AI
              </div>
              <div className="text-[#6b7280] text-[10px] uppercase tracking-wider whitespace-nowrap">
                Enterprise Intelligence
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-0.5 px-2 pt-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-[#dce8ff] text-[#0058be] font-medium"
                  : "text-[#45464d] hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? "text-[#0058be]" : "text-[#45464d]"}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Conversation History */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col mt-4 px-2 flex-1 min-h-0"
          >
            <div className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider px-2 mb-2 ">
              Conversation History
            </div>
            <div className="relative mb-2">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none focus:border-[#0058be] placeholder-gray-400"
              />
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <div className="text-[9px] font-semibold text-[#6b7280] uppercase tracking-wider px-2 py-1">
                    {group}
                  </div>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="relative group"
                      ref={openMenu === item.id ? menuRef : null}
                    >
                      <button
                        onClick={() => handlenavigate(item.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 pr-8 text-xs text-[#45464d] hover:bg-gray-100 rounded-md text-left transition-colors"
                      >
                        <MessageSquare
                          size={12}
                          className="text-gray-400 shrink-0"
                        />

                        <span className="truncate flex-1">{item.title}</span>
                      </button>

                      {/* Three dots */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === item.id ? null : item.id);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all duration-200"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {/* Dropdown */}
                      {openMenu === item.id && (
                        <div className="absolute right-1 top-8 z-20 w-36 rounded-lg border bg-white shadow-lg py-1">
                          {/*  <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Rename", item.id);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            <Pencil size={14} />
                            Rename
                          </button>
*/}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete", item.id);
                              removeChatByTenderId(item.id);

                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Items */}
      <div className="flex flex-col gap-0.5 px-2 pb-3 border-t border-gray-100 pt-2 mt-2">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-[#dce8ff] text-[#0058be] font-medium"
                  : "text-[#45464d] hover:bg-gray-100"
              }`
            }
          >
            <Icon size={17} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap text-sm"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* User info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 mt-1"
            >
              <div className="w-7 h-7 rounded-full bg-[#0058be] flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                {currentUser.initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#0b1c30] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-[#6b7280] truncate">
                  {currentUser.role}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={17} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button> */}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-16 -right-3 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-gray-500" />
        ) : (
          <ChevronLeft size={12} className="text-gray-500" />
        )}
      </button>
    </motion.div>
  );
}
