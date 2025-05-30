import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
// Login Function
export const loginUser = async (po_id, password) => {
    try {
        const response = await api.post("/po-login", { po_id, password });

        if (response.data.success) {
            // You can save PO ID or ID if needed
            await AsyncStorage.setItem("po_id", response.data.po_id);
            await AsyncStorage.setItem("user_id", String(response.data.id)); // convert to string for AsyncStorage

            return {
                success: true,
                user: {
                    id: response.data.id,
                    po_id: response.data.po_id,
                },
                message: response.data.msg,
            };
        }

        return {
            success: false,
            message: response.data.message || response.data.msg || "Login failed"
        };
    } catch (error) {
        console.log("Login error:", error.message);
        console.log("Error response:", error.response?.data);

        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.msg || "Something went wrong!"
        };
    }
};


// Fetch User Details
export const getUserDetails = async () => {
    try {
        const response = await api.get("/user-details"); // Token auto-added
        return response.data;
    } catch (error) {
        return null;
    }
};

// Logout Function
export const logoutUser = async () => {
    await AsyncStorage.removeItem("authToken");
};

export const bloglist = async () => {
    try {
        const response = await api.get("/blog-list");
        return response.data;
    } catch (error) {
        return null;
    }
}
export const notificationlist = async () => {
    try {
        const response = await api.get("/notification-list");
        return response.data;
    } catch (error) {
        return null;
    }
}