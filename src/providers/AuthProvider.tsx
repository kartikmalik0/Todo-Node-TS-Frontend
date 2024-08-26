"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    login: (email: string, password: string) => Promise<unknown>;
    logout: () => Promise<void>;
}


const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // useEffect(() => {
    //     checkAuth();
    // }, []);

    // const checkAuth = async () => {
    //     try {
    //         const response = await axios.get(`${backendUrl}/api/auth/check-auth`, { withCredentials: true });
    //         setIsAuthenticated(response.data.isAuthenticated);
    //         setUserId(response.data.userId);
    //     } catch (error) {
    //         console.error('Error checking auth:', error);
    //     }
    // };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${backendUrl}/auth/login`, { email, password }, { withCredentials: true });
            setIsAuthenticated(true);
            setUserId(response.data.userId);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUserId(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
