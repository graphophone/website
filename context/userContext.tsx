"use client"

import { login_endpoint, logout_endpoint, refresh_endpoint, sign_up_endpoint } from "@/constants/api";
import { LoginForm, SignUpForm } from "@/types/auth/forms";
import React, { createContext, useEffect, useState } from "react";

export interface User {
    id: number;
    username: string;
    avatarUrl: string;
}

export interface IUserContext {
    user: User | null;
    isLoading: boolean;
    loadUser: () => Promise<void>;
    login: (data: LoginForm) => Promise<number>,
    signUp: (data: SignUpForm) => Promise<number>,
    logout: () => Promise<number>;
    refreshTokens: () => Promise<number>;
    protectedFetch: (
        input: string | URL | Request,
        init?: RequestInit,
    ) => Promise<Response>;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    isLoading: false,
    loadUser: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    login: function (data: LoginForm): Promise<number> {
        throw new Error("Function not implemented.");
    },
    signUp: function (data: SignUpForm): Promise<number> {
        throw new Error("Function not implemented.");
    },
    logout: function (): Promise<number> {
        throw new Error("Function not implemented.");
    },
    refreshTokens: function (): Promise<number> {
        throw new Error("Function not implemented.");
    },
    protectedFetch: function (input: string | URL | Request, init?: RequestInit): Promise<Response> {
        throw new Error("Function not implemented.");
    }
})

export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadUser = async () => {
        setIsLoading(true);

        setTimeout(() => {
            const newUser: User = {
                id: 1,
                username: "test user",
                avatarUrl: "https://elevatebaby.com/wp-content/uploads/HowtoChoosetheRightSurrogacyAgency.jpeg.webp",
            };
            setUser(newUser);
    
            setIsLoading(false);
        }, 3000);
    }

    useEffect(() => {
        console.log({ user });
    }, [user]);

    const login = async (data: LoginForm) => {
        const res = await fetch(login_endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 200) {
            await loadUser();
        }
        return res.status;
    };

    const signUp = async (data: SignUpForm) => {
        const res = await fetch(sign_up_endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 200) {
            await loadUser();
        }
        console.log({ headers: res.headers });
        return res.status;
    }

    const logout = async () => {
        const res = await fetch(logout_endpoint, {
            method: "DELETE",
            credentials: "include",
        });
        
        if (res.status === 200) {
            setUser(null);
        }
        return res.status;
    }

    const refreshTokens = async () => {
        const res = await fetch(refresh_endpoint, {
            method: "PATCH",
            credentials: "include",
        });
        
        if (res.status === 200) {
            await loadUser();
        } else if (res.status === 401) {
            setUser(null);
        }
        return res.status;
    }

    useEffect(() => {
        refreshTokens();
    }, []);

    const protectedFetch = async (
        input: string | URL | Request,
        init?: RequestInit,
    ) => {
        const res = await fetch(input, init);
        if (res.status !== 401) {
            return res;
        }
        const refreshStatus = await refreshTokens();
        if (refreshStatus === 401) {
            return res;
        }
        return await fetch(input, init);
    }

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
            loadUser,
            login,
            signUp,
            logout,
            refreshTokens,
            protectedFetch,
        }}>
            {children}
        </UserContext.Provider>
    )
}