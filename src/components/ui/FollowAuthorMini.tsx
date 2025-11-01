import React from 'react'
import Image from 'next/image'
import { AuthorReferenceType } from '@/types/definitions.types'
import FollowMiniBtn from '../cui/FollowMiniBtn'

const FollowAuthorMini = ({item, userId}:{userId:string; item:AuthorReferenceType}) => {
  const imageUrl = item?.image
  return (
    <div className=' relative'>
      <Image width={150} height={150} className=' object-cover w-12 h-12 rounded-full' src={imageUrl as string} alt="Follow author"/>
      {item?._id != userId && <FollowMiniBtn celebrityId={item?._id} userId={userId}/>}
    </div>
  )
}

export default FollowAuthorMini