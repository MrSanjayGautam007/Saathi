import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../APIServices/api";
import { useLanguage } from "./LanguageContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to load user from storage", error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (poid, password) => {
        setLoading(true);
        try {
            const response = await api.post('/po-login', {
                po_id: poid,
                password: password
            });

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                setLoading(false);
            }

            return response.data; // return for further use in login screen
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Something went wrong" };
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
