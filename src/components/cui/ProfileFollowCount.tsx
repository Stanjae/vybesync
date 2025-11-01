import { getProfileFollowArray } from '@/lib/actions'
import { ProfileFollowResponseType } from '@/types/definitions.types'
import millify from 'millify'
import React from 'react'

const ProfileFollowCount = async({celebrityId}:{celebrityId:string}) => {
    const {profileFollow, reducedLikes}:ProfileFollowResponseType = await getProfileFollowArray(celebrityId)
  return (
    <section className=' flex gap-5  md:justify-normal justify-center items-center'>
                    <div className=' text-lg gap-2 flex items-center'>
                        <strong>{millify(profileFollow?.following || 0)}</strong>
                        <span className=' text-background/75 text-base'>Following</span>
                    </div>

                    <div className=' text-lg gap-2 flex items-center'>
                        <strong>{millify(profileFollow?.followers || 0)}</strong>
                        <span className='text-background/75 text-base'>Followers</span>
                    </div>

                    <div className=' text-lg gap-2 flex items-center'>
                        <strong>{millify(reducedLikes || 0)}</strong>
                        <span className='text-background/75 text-base'>Likes</span>
                    </div>
                </section>
  )
}

export default ProfileFollowCount