import { auth } from '@/auth'
import ActivityLayout from '@/components/cui/ActivityLayout'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

const page = async() => {
    const session = await auth();
    if (!session?.user) {
        redirect('/')
    }
  return (
    <div className='p-4 space-y-5'>
      <h3 className="text-2xl font-semibold">Notifications</h3>
        <Suspense>
            <ActivityLayout session={session}/>
        </Suspense>  
    </div>
  )
}

export default page