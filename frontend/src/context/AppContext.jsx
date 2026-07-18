import { createContext, useContext, useState, useCallback } from "react";
import {
  getCategoryDistribution,
  getOverview,
  getActivity,
  getRecentTenders,
} from "../api/dashboardApi";


import {
    getTenders,
    getTenderDetails,
    getSavedTenders
} from "../api/tenderApi";
import { select } from "framer-motion/client";
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
  const [recentTenders, setRecentTenders] = useState([]);
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
const [selectedTender, setSelectedTender] = useState(null);
const [currentPage, setCurrentPage] = useState(1);

const [pageSize] = useState(20);

const [totalPages, setTotalPages] = useState(1);

const [totalItems, setTotalItems] = useState(0);
const [filters, setFilters] = useState({
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
 const [selectedCategory, setSelectedCategory] = useState("All");
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
      const recenttender=await getRecentTenders();


      setDashboardStats(dashboardstats);
      setCategoryDistribution(categorydistribution);
      setTenderActivity(activitymonthly);
      setRecentTenders(recenttender);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //recent tenders on dashboard

  // const loadRecentTenders = useCallback(async () => {
  //   try {
  //     setIsLoading(true);

  //     const data = await searchTenders({
  //       page: 1,
  //       page_size: 20,
  //     });

  //     setTenderList(data.items);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);
  // //Load Saved Tenders


 const loadTenders = useCallback(
    async (customFilters = filters, page = 1) => {
        try {
            setIsLoading(true);

            const response = await getTenders({
                ...customFilters,
                page,
                page_size: pageSize,
            });

            setTenderList(response.items);
            setCurrentPage(response.page);
            setTotalPages(response.total_pages);
            setTotalItems(response.total);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    },
    [filters, pageSize]
);


const clearTenderFilters = useCallback(() => {
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
}, []);
//loadtenderdetails
const loadTenderDetails = useCallback(async (id) => {
    try {
        setIsLoading(true);

        const response = await getTenderDetails(id);

        setSelectedTender(response);

    } catch (error) {
        console.error("Failed to load tender details:", error);
    } finally {
        setIsLoading(false);
    }
}, []);
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
    selectedTender,

filters,
setFilters,

currentPage,
totalPages,
totalItems,

loadTenders,
loadTenderDetails,
clearTenderFilters,
setSelectedCategory,
selectedCategory,
recentTenders

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
