"use client"

import { BellSimple } from 'phosphor-react';
import Link from 'next/link';

function NotificationsAction({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Link
                href="/notifications"
                onClick={onNavigate}
                className="relative flex h-full w-full items-center justify-end"
                aria-label="Notifications"
            >
                <span className={mobile
                    ? "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center"
                    : ""
                }>
                    <BellSimple color="var(--foreground)" weight="fill" size={16} />
                </span>
            </Link>
        </div>
    )
}

export default NotificationsAction