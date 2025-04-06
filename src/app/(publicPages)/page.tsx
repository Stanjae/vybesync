import { auth, signOut } from '@/auth'
import CAvatar from '@/components/cui/CAvatar'
import CDropDown from '@/components/cui/CDropDown'
import VideoLayout from '@/components/cui/VideoLayout'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { getVideos } from '@/lib/actions'
import Link from 'next/link'
import React, { Suspense } from 'react'

const page = async() => {
  const response  = await getVideos();

  const session = await auth();

  return (
    <section id="example" className='relative bg-foreground text-background h-screen'>
   
      {session?.user ? <CDropDown contentStyle='bg-foreground/80 border-muted-custom w-[200px]' className='fixed z-30 right-10 top-[30px]' trigger={ <CAvatar session={session}/>}>
        <div>
          <DropdownMenuItem className=' leading-6 text-lg py-2 font-medium text-background px-3.5'>Profile</DropdownMenuItem>
          <form action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button className='w-full hover:bg-muted-custom hover:text-primary-custom/75 flex items-center justify-start bg-transparent text-lg py-2 font-medium text-primary-custom px-3.5'>LogOut</Button>
          </form>
          
        </div>
      </CDropDown>
      :
      <Button asChild size={'lg'} className=' bg-primary-custom hover:bg-primary-custom/75 z-30 rounded-4xl px-7 fixed right-10 top-[30px]'>
        <Link href={`/auth/sign-in`}>Login</Link></Button>}

     

    <Suspense>
      <VideoLayout session={session} response={response}/>
    </Suspense>
    </section>
  )
}

export default page
