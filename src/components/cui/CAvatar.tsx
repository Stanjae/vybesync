import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {  ChevronDown } from 'lucide-react'
import { Session } from 'next-auth'

const CAvatar = ({style, session}:{style?:string; session:Session}) => {
  return (
    <div className={` ${style} flex bg-muted-custom px-5 py-2 gap-2 rounded-full items-center`}>
        <Avatar>
            {/* <Image width={30} height={30} src={session?.user?.image as string} alt='lol' /> */}
            <AvatarImage src={session?.user?.image as string} alt={session?.expires} />
            <AvatarFallback className=' text-gray-950'>{session?.user?.name?.slice(0,2)}</AvatarFallback>
        </Avatar>
        <ChevronDown/>
    </div>
  )
}

export default CAvatar