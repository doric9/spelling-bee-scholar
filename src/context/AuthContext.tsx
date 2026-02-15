"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            // Use a slight delay to avoid synchronous state update in effect warning
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        if (!auth) {
            alert("Auth is not configured. Please check your environment variables.");
            return;
        }
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: unknown) {
            const authError = error as { code: string; message: string };
            if (authError.code === 'auth/configuration-not-found') {
                alert("Firebase Auth Error: Please enable 'Google' as a sign-in provider in your Firebase Console (Authentication > Sign-in method).");
            } else if (authError.code === 'auth/unauthorized-domain') {
                alert("Firebase Auth Error: This domain is not authorized. If you're on a custom domain, add it to 'Authorized domains' in Firebase Console.");
            } else {
                alert(`Login failed: ${authError.message}`);
            }
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
        } catch {
            // Silently fail on logout error or handle gracefully
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
