'use client'
import { VideoType } from '@/lib/definitions'
import Link from 'next/link'
import React, { useRef } from 'react'
import 'next-cloudinary/dist/cld-video-player.css';
import millify from 'millify'
import Image from 'next/image'
import { Heart, Play } from 'lucide-react'
import CosVideoPlayer from './CosVideoPlayer'

const ProfileVideoCard = ({item, isAuthor, isTitle, isExplore}:{isExplore?:boolean; item:VideoType; isAuthor:boolean; isTitle?:boolean}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const imageUrl = item?.author?.image
  return (
    <div>
      <Link id='profile' onMouseOver={()=> videoRef.current?.play()} onMouseLeave={()=>videoRef.current?.pause()}  key={item?._id} className='block space-y-2 relative' href={`/@${item?.author?.name}/video/${item?._id}`}>
      <CosVideoPlayer id={isAuthor ? "prud"+item?._id : item?._id} logo={false} 
      height={400} 
      width={300} muted autoplay
      className=' w-full! rounded-xl!'
      videoRef={videoRef} 
      src={item?.videoUrl} 
      transformation={{
          color: 'white',
          gravity: "center",
          opacity: 80
        }}/>

      <span className={`font-bold z-50 text-background gap-0.5 items-center flex absolute right-5 ${isAuthor ? "bottom-14":"bottom-14"}`}>
        {isExplore ? <Heart className='size-4'/>:<Play className=' size-4'/>} {millify(isExplore ? item?.likes as number || 0: item?.views as number)}
      </span>
    </Link>
    {isTitle && <Link href={`/@${item?.author?.name}/${item?._id}`} className='block my-1'>
        <h3 className='text-base overflow-hidden text-ellipsis whitespace-nowrap font-medium text-background'>{item?.caption}</h3>
      </Link>}
    {isAuthor && <Link href={`/@${item?.author?.name}`} className='flex gap-2 items-center'>
        <Image src={imageUrl as string} className=' rounded-full' alt={item?.author?._id} width={25} height={25}/>
        <h3 className='text-lg font-medium text-background'>{item?.author?.fullname}</h3>
      </Link>}
    </div>
    
   
  )
}

export default ProfileVideoCard