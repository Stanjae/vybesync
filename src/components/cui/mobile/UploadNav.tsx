'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent,SheetFooter,SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import React from 'react'
import Image from 'next/image'
import Logo1 from '../../../../public/veslogo1.png'
import Link from 'next/link'
import { AlignLeft, ChevronLeft, Home} from 'lucide-react'

const navigation = [
    { title: 'Home', href: '/',  icon:<Home className=' size-5'/> },
   /*  { title: 'Explore', href: '/explore', icon:<Compass className=' size-7'/>  },
    { title: 'Following', href: '/following', icon:<UserRoundCheck className=' size-7'/> },
    {title:"Friends", href: '/friends', icon:<Users className=' size-7'/> },
    {title:"Upload", href: '/upload', icon:<SquarePlus className=' size-7'/>},
    {title:"Activity", href: '/activity', icon:<MessageSquareText className=' size-7'/>} */
]
const UploadNav = () => {
  return (
    <Sheet >
    <SheetTrigger asChild>
      <Button className=' flex md:hidden' size={'icon'} variant="outline"><AlignLeft className=' size-7 text-muted-custom'/></Button>
    </SheetTrigger>
    <SheetContent className=' w-1/2' side='left'>
      <SheetHeader>
        <SheetTitle>
        <div className=' flex px-5 py-[9px] border-b border-b-[#E7E6E6]'>
            <Image src={Logo1} className=' w-[100px] h-[50px] ' alt='VES Logo'  />
        </div>
        </SheetTitle>
      </SheetHeader>
      <div className=' space-y-8 py-8 px-5'>
            <Button disabled className=' disabled:bg-primary-custom/60 w-full block'>Upload</Button>

            <div>
                <p className=' text-[#00000057] text-[10px] uppercase font-bold'>Manage</p>

                <ul className=' space-y-1'>
                {navigation.map((item, index) => (
                    <li key={index}>
                        <Link  href={item.href} className='flex rounded-md text-muted-custom text-sm items-center px-2 py-2 hover:bg-muted-custom/20'>
                            {item.icon}
                            <span className='ml-3 text-muted-custom text-sm font-medium'>{item.title}</span>
                        </Link>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        <SheetFooter>
        <div className=' py-10 mt-auto'>
            <Button asChild variant={'link'}><a href={'/'}> <ChevronLeft/> Back to Vybesync</a></Button>
        </div>
        </SheetFooter>
    </SheetContent>
  </Sheet>
  )
}

export default UploadNav