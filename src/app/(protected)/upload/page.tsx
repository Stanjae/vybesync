import { auth } from '@/auth'
import { UDropzone } from '@/components/cui/UDropZone'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }
  return (
    <div className=' bg-background'>
        <UDropzone session={session}/>
    </div>
  )
}

export default page
