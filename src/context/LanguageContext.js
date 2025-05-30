import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../constants/translations';
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        AsyncStorage.getItem('APP_LANGUAGE').then((lang) => {
            if (lang) {
                setLanguage(lang);
            }
        });
    }, []);

    const changeLanguage = async (lang) => {
        setLanguage(lang);
        await AsyncStorage.setItem('APP_LANGUAGE', lang);
    };

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
