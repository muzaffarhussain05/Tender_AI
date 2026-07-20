import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  
} from "react";
import {
  getCategoryDistribution,
  getOverview,
  getActivity,
  getRecentTenders,
} from "../api/dashboardApi";

import {
  getSavedTenders,
  saveTender,
  removeSavedTender,
} from "../api/savedTenderApi";
import { getTenders, getTenderDetails } from "../api/tenderApi";
import {
  createChat,
  sendMessage,
  getChatHistory,
  getConversation,
  renameChat,
  deleteChat,
  clearChat,
} from "../api/chatApi";
import { useNavigate } from "react-router-dom";

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

  const [chatMessages, setChatMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
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
      const recenttender = await getRecentTenders();

      setDashboardStats(dashboardstats);
      setCategoryDistribution(categorydistribution);
      setTenderActivity(activitymonthly);
      setRecentTenders(recenttender);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const bookmarkedIds = new Set(savedTenders.map((t) => t.tender_id));
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
    [filters, pageSize],
  );

  const loadSavedTenders = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getSavedTenders();

      setSavedTenders(response.items);
    } catch (error) {
      console.error("Failed to load saved tenders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTenderById = useCallback(
    async (tenderId) => {
      try {
        await saveTender(tenderId);
        await loadSavedTenders();
      } catch (error) {
        console.error(error);
      }
    },
    [loadSavedTenders],
  );

  const removeSavedTenderById = useCallback(
    async (tenderId) => {
      try {
        console.log("removing saved tender", tenderId);

        await removeSavedTender(tenderId);

        await loadSavedTenders();
      } catch (error) {
        console.error(error);
      }
    },
    [loadSavedTenders],
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

  const loadChatHistory = useCallback(async () => {
    try {
      setChatLoading(true);

      const data = await getChatHistory();

      setChatHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const newChat = useCallback(async () => {
    try {
      const chat = await createChat();

      setCurrentChat(chat);

      setChatMessages([]);

      await loadChatHistory();

      return chat;
    } catch (err) {
      console.error(err);
    }
  }, [loadChatHistory]);

  const openChat = useCallback(async (sessionId) => {
    try {
     
      setChatLoading(true);

      const conversation = await getConversation(sessionId);

      setCurrentChat({
        session_id: conversation.session_id,
        title: conversation.title,
      });

      setChatMessages(conversation.messages);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setChatLoading(false);
    }
  }, []);
const sendChatMessage = useCallback(async (message) => {
    try {

        if (!currentChat) return;

        setIsAiTyping(true);

        const response = await sendMessage(
            currentChat.session_id,
            message
        );

        setChatMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: message,
                created_at: new Date().toISOString(),
            },
            {
                role: "assistant",
                content: response.answer,
                created_at: new Date().toISOString(),
            },
        ]);

        setCurrentChat((prev) => ({
            ...prev,
            title: response.title,
        }));

        await loadChatHistory();

    } catch (err) {

        console.error("Failed to send message:", err);

    } finally {

        setIsAiTyping(false);

    }

}, [currentChat, loadChatHistory]);
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

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
    loadSavedTenders,
    saveTenderById,
    removeSavedTenderById,

    chatMessages,
    setChatMessages,
    currentChat,
    setCurrentChat,

    chatHistory,
    loadChatHistory,

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
    recentTenders,
    chatLoading,
    setChatLoading,
    newChat,
    openChat,
    sendChatMessage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
