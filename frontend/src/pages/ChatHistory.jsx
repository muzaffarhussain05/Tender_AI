import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Star, Trash2, Edit3, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ChatHistory() {
  const { chatHistory, deleteChatHistory, renameChatHistory, toggleStarChat } = useApp();
  const [search, setSearch] = useState("");
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filtered = chatHistory.filter(
    (c) => search === "" || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.group]) acc[c.group] = [];
    acc[c.group].push(c);
    return acc;
  }, {});

  const startRename = (chat) => {
    setRenaming(chat.id);
    setRenameValue(chat.title);
  };

  const commitRename = (id) => {
    if (renameValue.trim()) renameChatHistory(id, renameValue.trim());
    setRenaming(null);
  };

  const selectedChat = selected ? chatHistory.find((c) => c.id === selected) : null;

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#0b1c30] text-sm">Chat History</h2>
            <button
              onClick={() => navigate("/ai-assistant")}
              className="flex items-center gap-1 px-2 py-1 bg-[#0058be] text-white text-xs rounded-lg hover:bg-[#0047a1] transition-colors"
            >
              <Plus size={11} /> New
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#eff4ff] border border-[#c6c6cd] rounded-lg outline-none focus:border-[#0058be]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              <div className="text-[9px] font-semibold text-[#6b7280] uppercase tracking-wider px-2 py-1.5">{group}</div>
              {items.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                    selected === chat.id ? "bg-[#dce8ff]" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelected(chat.id)}
                >
                  <MessageSquare size={13} className="text-gray-400 shrink-0" />
                  {renaming === chat.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => commitRename(chat.id)}
                      onKeyDown={(e) => e.key === "Enter" && commitRename(chat.id)}
                      className="flex-1 text-xs bg-white border border-[#0058be] rounded px-1 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="flex-1 text-xs text-[#45464d] truncate">{chat.title}</span>
                  )}
                  <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); toggleStarChat(chat.id); }} className="p-1 hover:bg-white rounded">
                      <Star size={11} className={chat.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); startRename(chat); }} className="p-1 hover:bg-white rounded">
                      <Edit3 size={11} className="text-gray-400" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteChatHistory(chat.id); if (selected === chat.id) setSelected(null); }} className="p-1 hover:bg-white rounded">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        {selectedChat ? (
          <div className="w-full max-w-2xl p-8">
            <h2 className="text-xl font-semibold text-[#0b1c30] mb-2">{selectedChat.title}</h2>
            <p className="text-sm text-[#6b7280] mb-6">{selectedChat.preview}</p>
            <button
              onClick={() => navigate("/ai-assistant")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0058be] text-white rounded-lg hover:bg-[#0047a1] transition-colors"
            >
              Continue Conversation <ChevronRight size={15} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#dce8ff] flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-[#0058be]" />
            </div>
            <h3 className="text-sm font-semibold text-[#0b1c30] mb-1">Select a conversation</h3>
            <p className="text-xs text-[#6b7280]">Choose a chat from the left panel to view or continue it</p>
          </div>
        )}
      </div>
    </div>
  );
}
