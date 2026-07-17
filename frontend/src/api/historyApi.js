import api from "./axios";

export const getChatSessions = async () => {
    const res = await api.get("/assistant/history");

    return res.data;
};

export const getChatMessages = async (sessionId) => {
    const res = await api.get(`/assistant/history/${sessionId}`);

    return res.data;
};