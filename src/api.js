import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedRequests = [];

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await api.post("auth/refresh", { refreshToken });

        const newAccessToken = response.accessToken;
        localStorage.setItem("auth_token", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.log(error);

        // console.error("Refresh token failed", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return null;
    }
};

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("auth_token");

        if (!token) {
            token = await refreshToken();
            if (!token) throw new Error("Token refresh failed");
        }

        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    failedRequests.push((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const newToken = await refreshToken();

            if (newToken) {
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                failedRequests.forEach((callback) => callback(newToken));
                failedRequests = [];
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
