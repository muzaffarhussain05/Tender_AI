import api from "./axios";

export const getOverview = async () => {
    const res = await api.get("/dashboard/overview");
    return res.data;
};

export const getCategoryDistribution = async () => {
    const res = await api.get("/dashboard/category-distribution");
    return res.data;
};

export const getRecentTenders = async (limit = 10) => {
    const res = await api.get("/dashboard/recent-tenders", {
        params: { limit },
    });

    return res.data;
};

export const getActivity = async (months = 12) => {
    const res = await api.get("/dashboard/activity", {
        params: { months },
    });

    return res.data;
};