"use client";

import React, { createContext } from "react";
import { toast, Toaster } from "@/components/ui/toast"

export interface ToastDefaultMessage {
    title: string,
    description?: string,
    type?: 'success' | 'info' | 'warning' | 'error',
};

export interface ToastPromiseMessage {
    loading: string,
    success: (data: any) => string,
    error: string,
};

export interface IToastContext {
    show: (message: ToastDefaultMessage) => void,
    promise: (promise: Promise<any>, message: ToastPromiseMessage) => void,
}

export const ToastContext = createContext<IToastContext>({
    show: function (message: ToastDefaultMessage): void {
        throw new Error("Function not implemented.");
    },
    promise: function (promise: Promise<any>, message: ToastPromiseMessage): void {
        throw new Error("Function not implemented.");
    }
});

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
    const show = (message: ToastDefaultMessage) => {
        const type = message.type ?? 'default';
        toast.add({
            title: message.title,
            description: message.description,
            type,
        });
    };

    const promise = (promise: Promise<any>, message: ToastPromiseMessage) => {
        toast.promise(promise, {
            loading: message.loading,
            success: message.success,
            error: message.error,
        });
    }

    return (
        <ToastContext value={{
            show,
            promise,
        }}>
            {children}
            <Toaster />
        </ToastContext>
    )
}