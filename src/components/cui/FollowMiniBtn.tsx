'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useCounterStore } from '@/providers/zustand-store';
import { toast } from 'sonner';
import { CheckCheck, Plus } from 'lucide-react';

const FollowMiniBtn = ({celebrityId, userId}:{userId:string;celebrityId:string}) => {

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
        <Button onClick={handleFollow} variant={'secondary'} size={'icon'} className='absolute -bottom-1/3 left-1/2 -translate-x-1/2 size-5 rounded-full'>
            {isFollowing ? <CheckCheck className=' text-primary-custom'/>:<Plus className=' text-primary-custom'/>}</Button>
    )
}

export default FollowMiniBtn
