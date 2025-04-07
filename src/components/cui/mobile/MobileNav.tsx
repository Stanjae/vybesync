'use client'
import { Button } from '@/components/ui/button'
import { Compass, Home, MessageSquareText, Plus, User } from 'lucide-react'
import { Session } from 'next-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LoginDialogDemo } from './LoginModal'

const navigation = [
    { title: 'For You', href: '/',  icon:<Home className=' size-7'/> },
    { title: 'Explore', href: '/explore', icon:<Compass className=' size-7'/>  },
    {title:"Upload", href: '/upload', icon:<Plus className=' size-7'/>},
    {title:"Activity", href: '/activity', icon:<MessageSquareText className=' size-7'/>},
    {title:"Profile", href: '/profile', icon:<User className=' size-7'/> },
    
    
]
const MobileNav = ({session}:{session:Session | null}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)

    const handleNav =(item:string)=>{
        if(!session?.user){
            setOpen(true)
            return
        }
        router.push(item == '/profile' ? `/@${session?.user?.name}`: item);
    }
  return (
    <section className=' block w-full py-1 md:hidden bg-foreground fixed bottom-0 left-0'>
        <LoginDialogDemo setOpen={setOpen} open={open}/>
        <nav className=' justify-center grid grid-cols-5'>
            {navigation.map(nav => ( nav.title == "Upload" || nav.title == "Profile" ?
            <div key={nav.title}className='col-span-1 flex justify-center '>
                <Button onClick={()=> handleNav(nav.href)} className={`${nav.href == '/upload' ? "bg-background text-foreground":" bg-foreground"} rounded-md p-1 `} >
                {nav.icon}
                </Button>
            </div>
                
            :
            <div key={nav.title}className='col-span-1 flex justify-center '>
                <Link className=' p-1' href={nav.href} >
                {nav.icon}
                </Link>
            </div>
                 
            ))}
           
        </nav>
    </section>
  )
}

export default MobileNav