import api from "./axios";

export const searchTenders = async ({
    query = "",
    category = "",
    organization = "",
    location = "",
    status = "",
    page = 1,
    page_size = 20,
}) => {
    const res = await api.get("/tenders", {
        params: {
            query,
            category,
            organization,
            location,
            status,
            page,
            page_size,
        },
    });

    return res.data;
};

export const getTenderDetails = async (id) => {
    const res = await api.get(`/tenders/${id}`);
    return res.data;
};

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