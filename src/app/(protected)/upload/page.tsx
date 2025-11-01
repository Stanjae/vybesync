
import { UDropzone } from '@/components/cui/UDropZone'
import { getAuthSession } from '@/lib/actions'
import React from 'react'

const page = async() => {
  const session = await getAuthSession()
  return (
    <div className=' bg-background'>
        <UDropzone session={session}/>
    </div>
  )
}

export default page
