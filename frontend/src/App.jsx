
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import TenderSearch from "./pages/TenderSearch";

import SavedTenders from "./pages/SaveTenders";
import ChatHistory from "./pages/ChatHistory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="tender-search" element={<TenderSearch />} />
          <Route path="saved-tenders" element={<SavedTenders />} />
          <Route path="chat-history" element={<ChatHistory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
