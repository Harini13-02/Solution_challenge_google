import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) => api.post("/auth/reset-password", { token, password }),
  getMe: () => api.get("/auth/me"),
};

// Reports
export const reportsAPI = {
  create: (data: any) => api.post("/reports", data),
  getAll: (params?: any) => api.get("/reports", { params }),
  getOne: (id: string) => api.get(`/reports/${id}`),
  updateStatus: (id: string, data: any) => api.patch(`/reports/${id}/status`, data),
  volunteer: (id: string) => api.post(`/reports/${id}/volunteer`),
  upvote: (id: string) => api.post(`/reports/${id}/upvote`),
  comment: (id: string, text: string) => api.post(`/reports/${id}/comment`, { text }),
  getStats: () => api.get("/reports/stats"),
};

// Donations
export const donationsAPI = {
  donate: (data: any) => api.post("/donations", data),
  getMy: () => api.get("/donations/my"),
  getStats: () => api.get("/donations/stats"),
};

export default api;