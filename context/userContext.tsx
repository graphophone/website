"use client"

import { loginEndpoint, logoutEndpoint, meEndpoint, refreshEndpoint, signUpEndpoint } from "@/constants/api";
import { LoginForm, SignUpForm } from "@/types/auth/forms";
import React, { createContext, useEffect, useState } from "react";

export interface BasicProfile {
    userId: number;
    username: string;
    avatarUrl?: string;
}

export interface IUserContext {
    user: BasicProfile | null;
    isLoading: boolean;
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
    const [user, setUser] = useState<BasicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log({ user });
    }, [user]);

    const login = async (data: LoginForm) => {
        const res = await fetch(loginEndpoint, {
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
        const res = await fetch(signUpEndpoint, {
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
        const res = await fetch(logoutEndpoint, {
            method: "DELETE",
            credentials: "include",
        });
        
        if (res.status === 200) {
            setUser(null);
        }
        return res.status;
    }

    const refreshTokens = async () => {
        const res = await fetch(refreshEndpoint, {
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

    const protectedFetch = async (
        input: string | URL | Request,
        init?: RequestInit,
    ) => {
        const res = await fetch(input, {
            ...init,
            credentials: "include",
        });
        if (res.status !== 401) {
            return res;
        }
        const refreshStatus = await refreshTokens();
        if (refreshStatus === 401) {
            return res;
        }
        return await fetch(input, {
            ...init,
            credentials: "include",
        });
    }

    const loadUser = async () => {
        setIsLoading(true);

        const res = await protectedFetch(meEndpoint, {
            method: "GET",
            credentials: "include",
        });
        
        if (res.status !== 200) {
            setUser(null);
        } else {
            const user: BasicProfile = await res.json();
            setUser(user);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
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