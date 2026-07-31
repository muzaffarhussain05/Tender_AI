import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/tender-logo.png";
import {
  Send,
  Paperclip,
  Mic,
  Plus,
  Bookmark,
  ExternalLink,
  Copy,
  ThumbsUp,
  Share2,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  BookmarkCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import uuid from "react-uuid";
const suggestions = [
  '"Show software development tenders"',
  '"Karachi tenders"',
  '"networking tenders closing next week"',
  '"tenders for database management systems"',
  '"firewall tenders in Islamabad that close this week"',
  '"active tenders"',
  '"Network equipment"',
  '"cloud computing and cybersecurity tenders"',
  '"tenders published this month"',
];

const statusColor = {
  Published: "bg-green-100 text-green-700",
  PublishedCorrigendum: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  Awarded: "bg-blue-100 text-blue-700",
};
const intelligenceFeed = [
  {
    id: "DXB-IT-2024-001",
    title: "Dubai Smart City Phase 4: Cloud Core",
    status: "OPEN",
    match: 98,
    budget: "$5.0M – $8.5M Est.",
    closing: "Ends in 4 days",
  },
  {
    id: "KSA-MOD-99",
    title: "KSA Ministry of Health: Data Center Reno",
    status: "CLOSING SOON",
    match: 82,
    budget: "$2.5M – $5.0M Est.",
    closing: "Due in 4 days",
  },
  {
    id: "QA-2024-007",
    title: "Qatar Airways: Enterprise ERP Migration",
    status: "OPEN",
    match: 75,
    budget: "Private Tender",
    closing: "Due in 14 days",
  },
];

export default function AIAssistant() {
  const {
    chatMessages,
    addMessage,
    clearChat,
    currentChat,
    isAiTyping,
    setIsAiTyping,
    newChat,
    sendChatMessage,
    openChat,
    bookmarkedIds,
    removeSavedTenderById,
    saveTenderById,
    loadChatHistory,
    createChat,
    setCurrentChat,
  } = useApp();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  




  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setInput("");

    if (!currentChat) {
      const chat = await createChat();
      await sendChatMessage(input, chat.session_id);
      setCurrentChat(chat);
    } else {
      await sendChatMessage(input);
    }
  };
  const isEmpty = chatMessages.length === 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-[#0b1c30]">
              {currentChat?.title}
            </h2>
            <p className="text-xs text-[#6b7280]">
              AI-powered tender intelligence
            </p>
          </div>
          <button
            onClick={newChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#0058be] text-white rounded-lg hover:bg-[#0047a1] transition-colors"
          >
            <Plus size={13} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <img
                src={logo}
                alt=""
                className="rounded  h-60"
                draggable={false}
              />

              <p className="text-sm text-[#6b7280] max-w-sm mb-6">
                Find the right tenders faster with intelligent search, analysis,
                and recommendations
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s.replace(/"/g, ""))}
                    className="px-3 py-1.5 text-xs border border-[#c6c6cd] rounded-full hover:bg-[#eff4ff] hover:border-[#0058be] transition-colors text-[#45464d]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              <AnimatePresence>
                {chatMessages.map((msg,index) => (
                  <motion.div
                    key={`${msg.created_at}-${msg.role}-${index}`}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "user" ? (
                      <div className="max-w-[70%] bg-[#0058be] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="max-w-[85%] space-y-3">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                          <div className="prose prose-sm max-w-none text-[#0b1c30]">
                            <ReactMarkdown
                              components={{
                                table: ({ children, ...rest }) => (
                                  <div className="overflow-x-auto my-2">
                                    <table
                                      className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden"
                                      {...rest}
                                    >
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children, ...rest }) => (
                                  <thead className="bg-[#eff4ff]" {...rest}>
                                    {children}
                                  </thead>
                                ),
                                th: ({ children, ...rest }) => (
                                  <th
                                    className="border border-gray-200 px-3 py-1.5 text-left text-[#0b1c30] font-semibold"
                                    {...rest}
                                  >
                                    {children}
                                  </th>
                                ),
                                td: ({ children, ...rest }) => (
                                  <td
                                    className="border border-gray-200 px-3 py-1.5 text-[#45464d]"
                                    {...rest}
                                  >
                                    {children}
                                  </td>
                                ),
                                code: ({ children, ...rest }) => (
                                  <code
                                    className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#0058be]"
                                    {...rest}
                                  >
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                            <span className="text-[10px] text-[#6b7280]">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <div className="flex-1" />
                          </div>
                        </div>
                        {/* Tender Cards */}
                        {msg?.tenders && msg?.tenders.length > 0 && (
                          <div className="space-y-2">
                            {msg?.tenders.map((card) => (
                              <motion.div
                                key={card.tender_id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[card.status]}`}
                                      >
                                        {card.status}
                                      </span>
                                      <span className="text-[10px] text-[#6b7280]">
                                        #{card.tender_id}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-[#0b1c30]">
                                      {card.title}
                                    </h4>
                                  </div>
                                  <div className="shrink-0 text-right flex items-center justify-center gap-2">
                                    <div className="text-[10px] text-[#6b7280]">
                                      MATCH
                                    </div>
                                    <div className="text-lg font-bold text-[#0058be]">
                                      {card.score.toFixed(2)}%
                                    </div>
                                    <div className="px-3 ml-4 py-1.5 border  border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition-colors text-[#45464d] flex items-center gap-1">
                                      <button
                                        onClick={async () => {
                                          if (
                                            bookmarkedIds.has(card.tender_id)
                                          ) {
                                            await removeSavedTenderById(
                                              card.tender_id,
                                            );
                                          } else {
                                            await saveTenderById(
                                              card.tender_id,
                                            );
                                          }
                                        }}
                                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                      >
                                        {bookmarkedIds.has(card.tender_id) ? (
                                          <BookmarkCheck className="w-5 h-5 text-[#0058be]" />
                                        ) : (
                                          <Bookmark className="w-5 h-5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#6b7280] mb-3">
                                  <div className="flex items-center gap-1">
                                    <Building2 size={11} /> {card.organization}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={11} /> {card.location}
                                  </div>
                                  <div className="flex items-center gap-1 text-[#0058be]">
                                    <Calendar size={11} /> Publish{" "}
                                    {
                                      new Date(card.publish_date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </div>
                                  <div className="flex items-center  gap-1 text-[#da0c0c]">
                                    <Calendar size={11} /> Closes{" "}
                                    {
                                      new Date(card.closing_date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </div>
                                </div>
                                {/* <div className="flex gap-2"> */}
                                {/* <button className="flex-1 py-1.5 bg-[#0058be] text-white text-xs rounded-lg hover:bg-[#0047a1] transition-colors flex items-center justify-center gap-1">
                                    <ExternalLink size={11} /> Open Details
                                  </button> */}
                                {/* <button className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition-colors text-[#45464d] flex items-center gap-1">
                                    <Bookmark size={11} /> Save
                                  </button>
                                  <button className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition-colors text-[#45464d]">
                                    <Share2 size={11} />
                                  </button> */}
                                {/* </div> */}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isAiTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-2 h-2 bg-[#0058be] rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 py-3 border-t border-gray-200 bg-white">
          <div className="relative bg-[#eff4ff] border border-[#c6c6cd] rounded-xl overflow-hidden focus-within:border-[#0058be] transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Tender AI anything..."
              rows={3}
              className="w-full px-4 pt-3 pb-1 bg-transparent text-sm text-[#0b1c30] placeholder-gray-400 outline-none resize-none"
            />
            <div className="flex items-center px-3 py-2 gap-2">
              <div className="flex-1" />
              <button
                // onClick={sendMessage}
                onClick={handleSend}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!input.trim() || isAiTyping}
                className="flex items-center gap-2 px-4 py-2 bg-[#0b1c30] text-white text-sm rounded-lg hover:bg-[#1a2d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Send Analysis <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
