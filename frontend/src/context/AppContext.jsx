import { createContext, useContext, useState, useCallback } from "react";
import {
  getCategoryDistribution,
  getOverview,
  getActivity,
} from "../api/dashboardApi";
import { searchTenders } from "../api/tenderApi";
import { getSavedTenders } from "../api/tenderApi";
const AppContext = createContext(null);

const initialSettings = {
  theme: "light",
  serverUrl: "https://api.tender-ai.com",
  model: "claude-sonnet-4-6",
  language: "English",
  notifications: { email: true, push: true, weekly: false },
};

const initialUser = {
  name: "Alex Rivera",
  role: "Procurement Lead",
  initials: "AR",
};

export function AppProvider({ children }) {
  const [currentUser] = useState(initialUser);
  const [settings, setSettings] = useState(initialSettings);
  const [tenderList, setTenderList] = useState([]);
  const [savedTenders, setSavedTenders] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(
    new Set(["NHS-2024-872", "KSA-ENERGY-030"]),
  );
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState({
    id: "current",
    title: "IT Infrastructure — GCC Region",
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [tenderActivity, setTenderActivity] = useState([]);

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  //load dashboard

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const dashboardstats = await getOverview();
      const categorydistribution = await getCategoryDistribution();
      const activitymonthly = await getActivity();

      setDashboardStats(dashboardstats);
      setCategoryDistribution(categorydistribution);
      setTenderActivity(activitymonthly);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //recent tenders on dashboard

  const loadTenders = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await searchTenders({
        page: 1,
        page_size: 20,
      });

      setTenderList(data.items);
    } finally {
      setIsLoading(false);
    }
  }, []);
  //Load Saved Tenders

  const loadSavedTenders = useCallback(async () => {
    const data = await getSavedTenders();

    setSavedTenders(data);
  }, []);

  const saveTender = useCallback((tender) => {
    setSavedTenders((prev) => {
      if (prev.find((t) => t.id === tender.id)) return prev;
      return [
        ...prev,
        {
          ...tender,
          saved: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          folder: "all",
        },
      ];
    });
  }, []);

  const removeSavedTender = useCallback((id) => {
    setSavedTenders((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const addMessage = useCallback((msg) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
    setCurrentChat({ id: Date.now().toString(), title: "New Conversation" });
  }, []);

  const deleteChatHistory = useCallback((id) => {
    setChatHistory((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const renameChatHistory = useCallback((id, title) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  const toggleStarChat = useCallback((id) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)),
    );
  }, []);

  const value = {
    currentUser,
    settings,
    updateSettings,
    tenderList,
    setTenderList,
    savedTenders,
    saveTender,
    removeSavedTender,
    bookmarkedIds,
    toggleBookmark,
    chatMessages,
    setChatMessages,
    currentChat,
    setCurrentChat,
    addMessage,
    clearChat,
    chatHistory,
    deleteChatHistory,
    renameChatHistory,
    toggleStarChat,
    dashboardStats,
    isLoading,
    setIsLoading,
    isAiTyping,
    setIsAiTyping,
    loadDashboard,
    loadTenders,
    categoryDistribution,
    tenderActivity,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
