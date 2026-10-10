"use client";

import { useTheme } from "next-themes";
import React, { createContext } from "react";
import { Toaster, toast } from 'sonner';

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
    const { theme = "system" } = useTheme()

    const show = (message: ToastDefaultMessage) => {
        if (message.type === 'success') {
            toast.success(message.title, {
                description: message.description,
            });
        } else if (message.type === 'error') {
            toast.error(message.title, {
                description: message.description,
            });
        } else if (message.type === 'warning') {
            toast.warning(message.title, {
                description: message.description,
            });
        } else {
            toast(message.title, {
                description: message.description,
            });
        }
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
            <Toaster
                position="bottom-left"
                richColors
                theme={theme as "light" | "dark" | "system"}
                toastOptions={{
                    classNames: {
                        toast: "bg-background text-foreground border-border",
                        description: "!text-background",
                        success: "!bg-success !text-background !border-success",
                        error: "!bg-destructive !text-background !border-destructive",
                        warning: "!bg-warning !text-background !border-warning",
                    },
                }}
            />
        </ToastContext>
    )
}