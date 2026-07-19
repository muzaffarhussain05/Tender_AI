import api from "./axios";

/**
 * Create new chat
 */
export const createChat = async () => {
  const res = await api.post("/chat/new");
  return res.data;
};

/**
 * Send message
 */
export const sendMessage = async (sessionId, message) => {
  const res = await api.post("/chat", {
    session_id: sessionId,
    message,
  });

  return res.data;
};

/**
 * Chat history
 */
export const getChatHistory = async () => {
  const res = await api.get("/chat/history");
  return res.data.items;
};

/**
 * Open conversation
 */
export const getConversation = async (sessionId) => {
  const res = await api.get(`/chat/${sessionId}`);
  return res.data;
};

/**
 * Rename chat
 */
export const renameChat = async (sessionId, title) => {
  const res = await api.put(`/chat/${sessionId}`, {
    title,
  });

  return res.data;
};

/**
 * Delete chat
 */
export const deleteChat = async (sessionId) => {
  const res = await api.delete(`/chat/${sessionId}`);
  return res.data;
};

/**
 * Clear chat
 */
export const clearChat = async (sessionId) => {
  const res = await api.delete(`/chat/${sessionId}/messages`);
  return res.data;
};