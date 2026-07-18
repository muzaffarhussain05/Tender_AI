import api from "./axios";

/**
 * Get tenders (list, search, filter, sort & pagination)
 */
export const getTenders = async (filters = {}) => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value !== "" &&
            value !== null &&
            value !== undefined
        ) {
            params[key] = value;
        }
    });

    const res = await api.get("/tenders", {
        params,
    });

    return res.data;
};

/**
 * Tender details
 */
export const getTenderDetails = async (id) => {
    const res = await api.get(`/tenders/${id}`);
    return res.data;
};

/**
 * Tender details
 */


export const saveTender = async (id) => {
    const res = await api.post(`/tenders/${id}/save`);
    return res.data;
};

export const unsaveTender = async (id) => {
    const res = await api.delete(`/tenders/${id}/save`);
    return res.data;
};

export const getSavedTenders = async () => {
    const res = await api.get("/tenders/saved");
    return res.data;
};