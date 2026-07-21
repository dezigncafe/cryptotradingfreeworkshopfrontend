import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            'admin_access_token',
        );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(
                'admin_access_token',
            );

            localStorage.removeItem(
                'admin_user',
            );

            window.location.href =
                '/admin/login';
        }

        return Promise.reject(error);
    },
);

export default api;