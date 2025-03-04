import axios from 'axios';

// Set the base URL for your API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // Use `import.meta.env` for Vite
    timeout: 10000, // Optional: Set a timeout for requests
});

// You can set default headers here, if needed
api.defaults.headers['Content-Type'] = 'application/json';

// You can add request/response interceptors here if needed
api.interceptors.request.use(
    (config) => {
        // Example: add an authorization token if you need one
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// You can also handle the responses in a more consistent way
api.interceptors.response.use(
    (response) => {
        return response.data; // Extract the response data
    },
    (error) => {
        return Promise.reject(error.response || error);
    }
);

export default api;
