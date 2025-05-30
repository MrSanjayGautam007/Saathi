import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Axios instance
const api = axios.create({
    baseURL: "https://bcssprojects.in/Saathi/public/api",
    headers: {
        'Content-Type': 'application/json',
      
    },
});

// Automatically add token to requests
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export default api;
