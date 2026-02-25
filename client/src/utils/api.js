import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // replace with production URL later
  withCredentials: true, // send cookies for refresh token
});

// Track refresh state
let isRefreshing = false;
let refreshSubscribers = [];

// Notify all waiting requests after refresh
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// Add token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry the refresh endpoint itself
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Handle 401/403
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // If refresh is already happening, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (!token) return reject(error); // refresh failed
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      // Start refreshing
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          "http://localhost:5000/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);

        isRefreshing = false;
        onRefreshed(newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (err) {
        // Stop all pending retries
        isRefreshing = false;
        refreshSubscribers.forEach(cb => cb(null));
        refreshSubscribers = [];
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; 
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;