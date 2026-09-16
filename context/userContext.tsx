"use client"

import { login_endpoint, logout_endpoint, refresh_endpoint, sign_up_endpoint } from "@/constants/api";
import React, { createContext, useEffect, useState } from "react";

export interface User {
    id: number;
    username: string;
    avatarUrl: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface SignUpForm {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface IUserContext {
    user: User | null;
    isLoading: boolean;
    loadUser: () => Promise<void>;
    login: (data: LoginForm) => Promise<number>,
    signUp: (data: SignUpForm) => Promise<number>,
    logout: () => Promise<number>;
    refreshTokens: () => Promise<number>;
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
    }
})

export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadUser = async () => {
        setIsLoading(true);

        const newUser: User = {
            id: 1,
            username: "test user",
            avatarUrl: "https://elevatebaby.com/wp-content/uploads/HowtoChoosetheRightSurrogacyAgency.jpeg.webp",
        };
        setUser(newUser);

        setIsLoading(false);
    }

    useEffect(() => {
        console.log({ user });
    }, [user]);

    const login = async (data: LoginForm) => {
        const res = await fetch(login_endpoint, {
            method: "POST",
            body: JSON.stringify(data),
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
        });

        if (res.status === 200) {
            await loadUser();
        }
        return res.status;
    }

    const logout = async () => {
        const res = await fetch(logout_endpoint, {
            method: "DELETE",
        });
        return res.status;
    }

    const refreshTokens = async () => {
        const res = await fetch(refresh_endpoint, {
            method: "PATCH",
        });
        
        if (res.status === 200) {
            await loadUser();
        }
        return res.status;
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
        }}>
            {children}
        </UserContext.Provider>
    )
}