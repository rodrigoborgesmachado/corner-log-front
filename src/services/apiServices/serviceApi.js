import axios from "axios";
import getCurrentEnvConfig from "../../config/envConfig";
import Config from "../../config/storageConfiguration";
import storageService from "../storageService";

const apiUrl = getCurrentEnvConfig();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Retrieves token from storage safely.
 */
const getToken = () => {
  return storageService.getItem(Config["TOKEN"]);
};

/**
 * Request Interceptor: Adds Authorization header dynamically.
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handles errors such as 401 and network failures.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error: Unable to connect to the server.");
      return Promise.reject({ message: "Network error. Please try again later." });
    }

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Unauthorized: Clearing session and redirecting to login.");
        storageService.clear();

        // Avoid redirecting forcefully, instead use an event
        window.dispatchEvent(new Event("unauthorized")); 
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Example: Listen for unauthorized events globally
 */
window.addEventListener("unauthorized", () => {
  window.location.href = "/"; // Redirect to login page
});

export default api;
