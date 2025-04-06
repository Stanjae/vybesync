'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useCounterStore } from '@/providers/zustand-store';
import { toast } from 'sonner';

const DetailFollowBtn = ({celebrityId, userId}:{userId:string;celebrityId:string}) => {

    const { following, togglefollow, setFollowing} = useCounterStore(
          (state) => state,
        )
    useEffect(()=>{
        setFollowing(userId, celebrityId);
    },[])

    const handleFollow=()=>{
        if(!userId) {
            toast.warning("You must be logged in!")
            return
        }
       togglefollow(celebrityId, userId); 
    }

    const isFollowing = userId ? following.includes(celebrityId) : null;
    return (
        <Button onClick={handleFollow} size={'lg'} className={`${isFollowing ? 
            "bg-muted-custom border text-primary-custom border-primary-custom" :"bg-primary-custom text-background"} rounded-none ml-auto `}>
            {isFollowing ? "Following":"Follow"}</Button>
    )
}

export default DetailFollowBtn
