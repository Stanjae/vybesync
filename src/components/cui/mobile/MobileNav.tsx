'use client'
import { Compass, Home, MessageSquareText, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const navigation = [
    { title: 'For You', href: '/',  icon:<Home className=' size-7'/> },
    { title: 'Explore', href: '/explore', icon:<Compass className=' size-7'/>  },
    {title:"Upload", href: '/upload', icon:<Plus className=' size-7'/>},
    {title:"Activity", href: '/activity', icon:<MessageSquareText className=' size-7'/>},
    {title:"Friends", href: '/friends', icon:<Users className=' size-7'/> },
    
    
]
const MobileNav = () => {
  return (
    <section className=' block w-full py-1 md:hidden bg-foreground fixed bottom-0 left-0'>
        <nav className=' justify-center grid grid-cols-5'>
            {navigation.map(nav => ( nav.title == "Upload" ?
            <div key={nav.title}className='col-span-1 flex justify-center '>
                <Link className=' text-foreground rounded-md p-1 bg-background ' href={nav.href} >
                {nav.icon}
                </Link>
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