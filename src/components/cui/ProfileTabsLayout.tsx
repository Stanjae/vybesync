import { getUserVideos } from '@/lib/actions'
import React from 'react'
import ProfileTabs from './ProfileTabs'

const ProfileTabsLayout = async({userId, sort, celebrityId}:{celebrityId:string; userId:string; sort:string | string[] | undefined}) => {
    const createdVideos = await getUserVideos(celebrityId, sort as string)

  return (
    <main>
        <ProfileTabs celebrityId={celebrityId} userId={userId} createdVideos={createdVideos}/>
    </main>
  )
}

export default ProfileTabsLayout