'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useCounterStore } from '@/providers/zustand-store';
import { Skeleton } from '../ui/skeleton';
import millify from 'millify';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

const DetailLikeBtn = ({videoId, userId, count}:{videoId:string; userId:string; count:number}) => {
    const { likedVideos, likeCounts, setLikesCount, toggleLike} = useCounterStore(
          (state) => state,
        )
    
      useEffect(()=>{
        setLikesCount(videoId, count, userId)
      },[]);
    
      const handleAction =()=>{
        if(!userId) {
          toast.warning("You must be logged in!")
          return
        }
        toggleLike(videoId, userId);
      };

      const isLiked = userId ? likedVideos.includes(videoId) : null;
    
      const noOfLikes = likeCounts[videoId] || 0;

  return (
    <div className='flex items-center gap-2'>
        <Button onClick={handleAction} className=' rounded-full p-4 bg-muted-custom' size={'icon'}>
            {isLiked ? <Heart className=' size-5 text-primary-custom'/> : <Heart className=' size-5 text-muted-custom-text'/>}
        </Button>
        <div className=' text-sm font-bold text-center text-background/85'>{typeof(noOfLikes) == 'number' ? millify(noOfLikes as number || 0) : <Skeleton className=' bg-muted-custom  w-[40px] h-5'/>}</div>
    </div>
  )
}

export default DetailLikeBtn
