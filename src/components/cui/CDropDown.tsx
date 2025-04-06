import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';

const CDropDown = ({trigger, contentStyle, children, className}:{contentStyle:string; trigger:React.ReactNode; children:React.ReactNode; className?:string}) => {
  return (
    <div className={`${className}`}>
       <DropdownMenu >
    <DropdownMenuTrigger className=' focus:outline-0!'>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent align='end'  className={` ${contentStyle}`}>
        {children}
    </DropdownMenuContent>
  </DropdownMenu> 
    </div>
    
  
  )
}

export default CDropDown