import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else {
            console.error(error.message);
        }

        return Promise.reject(error);
    }
);

export default api;