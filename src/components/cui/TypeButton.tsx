'use client'
import React from 'react'
import { Button } from '../ui/button'
import millify from 'millify';

export const TypeButton = ({beforeIcon, afterIcon, text, isDone, action}:{action?:()=> void; beforeIcon:React.ReactNode; isDone:boolean; afterIcon?:React.ReactNode; text:string|number}) => {
  const handleAction =()=>{
    if(action) action()
  }
  return (
    <div className=' space-y-1'>
        <Button onClick={handleAction} className=' rounded-full p-5 bg-muted-custom' size={'icon'}>
            {isDone ? afterIcon : beforeIcon}
        </Button>
        <p className=' text-sm font-bold text-center text-background/85'>{millify(text as number)}</p>
    </div>
  )
}


export const CommentButton = ({beforeIcon, text, }:{beforeIcon:React.ReactNode; text:string|number}) => {
  return (
    <div className=' space-y-1'>
       <div className=' size-11 flex items-center justify-center rounded-full bg-muted-custom'>
             {beforeIcon}
        </div>
        <p className=' text-sm font-bold text-center text-background/85'>{text}</p>
    </div>
  )
}


export const DetailTypeButton = ({beforeIcon, afterIcon, text, isDone}:{beforeIcon:React.ReactNode; isDone:boolean; afterIcon?:React.ReactNode; text:string|number}) => {
  return (
    <div className='flex items-center gap-2'>
        <Button className=' rounded-full p-4 bg-muted-custom' size={'icon'}>
            {isDone ? afterIcon : beforeIcon}
        </Button>
        <p className=' text-sm font-bold text-center text-background/85'>{text}</p>
    </div>
  )
}