"use client"

import { BellSimple } from 'phosphor-react';
import Link from 'next/link';

function NotificationsAction() {
    return (
        <Link
            href="/notifications"
            className="w-full h-full flex justify-center items-center"
            aria-label="Notifications"
        >
            <BellSimple color="var(--foreground)" weight="fill" size={16} />
        </Link>
    )
}

export default NotificationsAction
