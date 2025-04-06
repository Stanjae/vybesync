'use client'
import React, { useState } from 'react'

const DetailDescription = ({description}:{description:string}) => {
    const [show, setShow] = useState(false)
  return (
    <div>
        <div onClick={()=> setShow(prev => !prev)} className={` ${show ? "text-pretty transition-all duration-500":
            " transition-all duration-500 overflow-hidden text-ellipsis whitespace-nowrap"} bg-foreground/10 transition-all duration-500 
                text-sm text-background/85`}>
            {description}   
        </div>
        <div className=' flex justify-end'>
            <span onClick={()=> setShow(prev => !prev)} className=' text-sm text-white'>{show ? "Less":"More"}</span>
        </div>
    </div>
  )
}

export default DetailDescription
