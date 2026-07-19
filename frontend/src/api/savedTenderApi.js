import api from "./axios";

/**
 * Get all saved tenders
 */
export const getSavedTenders = async () => {
    const res = await api.get("/saved-tenders");
    return res.data;
};

/**
 * Save a tender
 */
export const saveTender = async (tenderId) => {
    const res = await api.post(`/saved-tenders/${tenderId}`);
    return res.data;
};

/**
 * Remove a saved tender
 */
export const removeSavedTender = async (tenderId) => {
    const res = await api.delete(`/saved-tenders/${tenderId}`);
    return res.data;
};