import React from 'react'
import Logo1 from '../../../public/veslogo1.png'
import { ChevronLeft, Home } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

const navigation = [
    { title: 'Home', href: '/',  icon:<Home className=' size-5'/> },
]



const USideBar = () => {
  return (
    <section className=' flex flex-col h-full  relative bg-[#F8F8F8]'>
        <div className=' flex px-5 py-[9px] border-b border-b-[#E7E6E6]'>
            <Image src={Logo1} className=' w-[100px] h-[50px] ' alt='VES Logo'  />
        </div>
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
        <div className=' py-10 mt-auto'>
            <Button asChild variant={'link'}><Link href={'/'}> <ChevronLeft/> Back to Vybesync</Link></Button>
        </div>
    </section>
  )
}

export default USideBar
