'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {  ChevronDown } from 'lucide-react'
import { TSessionType } from '@/types/auth.types'

const CAvatar = ({style, session}:{style?:string; session:TSessionType}) => {
  return (
    <div className={`${style} flex bg-muted-custom px-5 py-2 gap-2 rounded-full items-center`}>
        <Avatar>
            <AvatarImage src={session?.user?.image as string} alt={session?.user.name} />
            <AvatarFallback className=' text-gray-950'>{session?.user?.name?.slice(0,2)}</AvatarFallback>
        </Avatar>
        <ChevronDown/>
    </div>
  )
}

export default CAvatar