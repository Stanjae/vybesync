'use client'
import { Heart } from 'lucide-react';
import React, { useEffect } from 'react'
import { Button } from '../ui/button';
import millify from 'millify';
import { useCounterStore } from '@/providers/zustand-store';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

const CLikeBtn = ({videoId, userId, count}:{videoId:string; userId:string; count:number}) => {
  const { likedVideos, likeCounts, setLikesCount, toggleLike} = useCounterStore(
      (state) => state,
    )
  
  

  useEffect(()=>{
    setLikesCount(videoId, count, userId);
  },[userId]);

  const isLiked = userId ? likedVideos.includes(videoId) : null;


  const handleAction =()=>{
    if(!userId) {
      toast.warning("You must be logged in!")
      return
    }
    toggleLike(videoId, userId);
  };

  


  const noOfLikes = likeCounts[videoId] ||0;
  return (
    <div className=' space-y-1'>
        <Button onClick={handleAction} className=' rounded-full p-5 bg-muted-custom' size={'icon'}>
            {isLiked ? <Heart className=' size-6 text-primary-custom'/> : <Heart className=' size-6 text-muted-custom-text'/>}
        </Button>
        <div className=' text-sm font-bold text-center text-background/85'>{typeof(noOfLikes) == 'number' ? millify(noOfLikes as number || 0) : <Skeleton className=' bg-muted-custom  w-[40px] h-5'/>}</div>
    </div>
  )
}

export default CLikeBtn
