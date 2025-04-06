'use client'
import { VideoType } from '@/lib/definitions'
import Link from 'next/link'
import React, { useRef } from 'react'
import 'next-cloudinary/dist/cld-video-player.css';
import millify from 'millify'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import { Heart } from 'lucide-react'
import CosVideoPlayer from './CosVideoPlayer'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

const SearchVideoCard = ({item, isAuthor, isTitle}:{item:VideoType; isAuthor:boolean; isTitle?:boolean}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const imageUrl = urlFor(item?.author?.profile_image)?.quality(100)?.url()

  const duration = dayjs(item?._createdAt).fromNow()
  return (
    <div>
      <Link id='searchvideo' onMouseOver={()=> videoRef.current?.play()} onMouseLeave={()=>videoRef.current?.pause()}  key={item?._id} className='block space-y-2 relative' href={`/@${item?.author?.name}/video/${item?._id}`}>
      <CosVideoPlayer id={isAuthor ? "prud"+item?._id : item?._id} logo={false} 
      height={320} 
      width={240} muted autoplay
      className=' w-full! rounded-xl!'
      videoRef={videoRef} 
      src={item?.videoUrl} 
      transformation={{
          color: 'white',
          gravity: "center",
          opacity: 80
        }}/>

      <span className={`font-bold z-50 text-background gap-0.5 items-center flex absolute right-5 ${isAuthor ? "bottom-14":"bottom-14"}`}>
        <Heart className=' size-4'/> {millify(item?.views as number)}
      </span>
    </Link>
    {isTitle && <Link href={`/@${item?.author?.name}/${item?._id}`} className='block my-1'>
        <h3 className='text-base overflow-hidden text-ellipsis whitespace-nowrap font-medium text-background'>{item?.caption}</h3>
      </Link>}
    {isAuthor && <Link href={`/@${item?.author?.name}`} className='flex gap-2 items-center'>
        <Image src={imageUrl as string} className=' rounded-full' alt={item?.author?._id} width={20} height={20}/>
        <h3 className='text-sm font-medium text-background'>{item?.author?.fullname}</h3>
        <span className=' text-muted-custom-text text-xs ml-auto'>{duration}</span>
      </Link>}
    </div>
    
   
  )
}

export default SearchVideoCard