"use client"

import { BellSimple } from 'phosphor-react';
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

function NotificationsAction() {
    const notifications = Array.from({ length: 32 }).map((_, i) => (
        {
            title: `Notification ${i}`,
            description: "Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
        }
    ));
    const [isNotificationsHovered, setIsNotificationsHovered] = useState(false);

    const pageSize = 3;
    const pagesCount = Math.ceil(notifications.length / pageSize);
    const [nearestPages, setNearestPages] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const newNearestPages = [];
        if (currentPage === pagesCount && currentPage > 2) {
            newNearestPages.push(currentPage - 2);
        }
        if (currentPage > 1) {
            newNearestPages.push(currentPage - 1);
        }
        newNearestPages.push(currentPage);
        if (currentPage < pagesCount) {
            newNearestPages.push(currentPage + 1);
        }
        if (currentPage === 1 && currentPage < pagesCount - 1) {
            newNearestPages.push(currentPage + 2);
        }
        setNearestPages(newNearestPages);
    }, [currentPage])

    return (
        <div className="w-full h-full flex justify-center items-center">
            <Popover>
                <PopoverTrigger render={
                    <Button
                        variant="link"
                        onMouseEnter={() => { setIsNotificationsHovered(true) }}
                        onMouseLeave={() => { setIsNotificationsHovered(false) }}
                        className="w-full h-full flex items-center justify-center relative cursor-pointer"
                    >
                        <BellSimple weight="fill" size={16} />
                        { notifications.length === 0 ? <></> :
                            <div
                                className={`${isNotificationsHovered ? "scale-0" : "scale-100"} transition-all
                                    bg-red-500 w-4 h-4 absolute text-[10px] text-white font-bold
                                    flex items-center justify-center rounded-full -top-px -right-px`
                                }
                            >
                                { notifications.length > 9 ? '9+' : notifications.length }
                            </div>
                        }
                    </Button>
                } />
                <PopoverContent className="w-70 p-1 rounded-[6px] flex-col gap-1" align="end">
                    <div className="px-2 pt-2 text-[18px] font-bold">Notifications</div>

                    <div>
                        {notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                            .map((notification, i) => (
                            <div key={i} className="p-2 rounded-[6px] cursor-pointer flex flex-col items-baseline gap-1 hover:bg-gray-100 transition-all">
                                <span className="font-semibold max-w-[50%] text-ellipsis">{notification.title}</span>
                                <div className="text-ellipsis line-clamp-2">{notification.description}</div>
                            </div>
                        ))}
                    </div>

                    <Pagination>
                        <PaginationContent>
                            {currentPage === 1 ? <></> :
                                <PaginationItem>
                                    <PaginationPrevious
                                        className="cursor-pointer"
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    />
                                </PaginationItem>
                            }
                            { nearestPages.map(pageNumber => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        isActive={pageNumber === currentPage}
                                        className="cursor-pointer"
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        { pageNumber }
                                    </PaginationLink>
                                </PaginationItem>
                            )) }
                            {currentPage === pagesCount ? <></> :
                                <PaginationItem>
                                    <PaginationNext
                                        className="cursor-pointer"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    />
                                </PaginationItem>
                            }
                        </PaginationContent>
                    </Pagination>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default NotificationsAction