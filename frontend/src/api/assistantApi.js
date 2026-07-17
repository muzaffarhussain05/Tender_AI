import api from "./axios";

export const askAssistant = async (message, sessionId = null) => {
    const res = await api.post("/assistant/chat", {
        message,
        session_id: sessionId,
    });

    return res.data;
};

export const startSession = async () => {
    const res = await api.post("/assistant/session");

    return res.data;
};

export const deleteSession = async (sessionId) => {
    const res = await api.delete(`/assistant/session/${sessionId}`);

    return res.data;
};