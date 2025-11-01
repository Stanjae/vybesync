'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useCounterStore } from '@/providers/zustand-store';
import { toast } from 'sonner';
import { VideoType } from '@/types/definitions.types';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const BookmarkBtn = ({userId, video}:{userId:string;video:VideoType}) => {

    const { bookmarked, togglebookmark} = useCounterStore((state) => state);

    const handleBookmark=()=>{
        if(!userId) {
            toast.warning("You must be logged in!")
            return
        }
       togglebookmark(userId, video); 
    }

    const isBookmarked = userId ? bookmarked.some((lol)=> lol._id == video?._id) : null;
    return (
        <Button onClick={handleBookmark} size={'icon'} className={`bg-muted-custom `}>
           {isBookmarked ? <BookmarkCheck className=' size-6 text-amber-400'/>:
           <Bookmark className=' size-6 text-gray-400'/>
           } 
        </Button>
    )
}

export default BookmarkBtn
