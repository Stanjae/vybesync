'use client'
import React from 'react'
import CosVideoPlayer from './CosVideoPlayer'
import { updateViewCount } from '@/lib/actions'

const DetailVideoPlayer = ({videoUrl, videoId}:{videoUrl:string; videoId:string}) => {
  return (
    <CosVideoPlayer className='  h-screen! z-30 rounded-2xl'
                width="419"
                height="744" 
                logo={false}
                controls={true}
                src={videoUrl}
                onEnded={()=> updateViewCount(videoId)}
                transformation={{
                color: 'white',
                gravity: "center",
                opacity: 80
                }}/>
  )
}

export default DetailVideoPlayer
