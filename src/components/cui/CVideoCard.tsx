'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import FollowAuthorMini from '../ui/FollowAuthorMini';
import {CommentButton, TypeButton} from './TypeButton';
import { LucideBadgeCheck, MessageCircleMoreIcon, Share } from 'lucide-react';
import { VideoType } from '@/lib/definitions';
import { MotionValue, useScroll, useTransform, motion } from 'motion/react';
import { CVideoModal } from './CVideoModal';
import { getVideoCommentsCount, updateViewCount } from '@/lib/actions';
import CLikeBtn from './CLikeBtn';
import { Session } from 'next-auth';
import BookmarkBtn from './BookmarkBtn';


function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const CVideoCard = ({item, videoId, setVideoId, id, session}:{session:Session | null;id?:number;item:VideoType; videoId:string; setVideoId:React.Dispatch<React.SetStateAction<string>>}) => {
  const vidref = useRef<HTMLVideoElement | null>(null);

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useParallax(scrollYProgress, 300);

  const [commentCount, setCommentCount] = useState<number>(0);


  console.log(y.version)

  useEffect(()=>{
    const fetchCommentCount =async()=>{
      const response = await getVideoCommentsCount(item?._id);
      setCommentCount(response)
    }
    if(!item?._id) return
    fetchCommentCount()
  },[])
  

useEffect(()=>{
  if(item?._id !== videoId){
    vidref.current?.pause()
  }
}, [videoId])

  const [show, setShow]= useState(false)
  return (
    <div id={`video-${id}`} className=' bg-foreground text-background h-screen containt overflow-hidden relative justify-center pt-5 gap-4 block sm:flex'>
      <section ref={ref} id='foryou-id' className=' relative w-full sm:w-[419px]'>
        <CldVideoPlayer id={item?._id} key={item?._id} videoRef={vidref} className=' border-none outline-none rounded-2xl'
        width="419"
        height="744"
        logo={false}
        controls={true}
        src={item?.videoUrl}
        transformation={{
          color: 'white',
          gravity: "center",
          opacity: 80
        }}
        onPlay={()=>{
          setVideoId(item?._id)
        }}
        onEnded={()=> updateViewCount(item?._id)}
        />
        <div className=' [text-shadow:_0_4px_8px_#ea284e] shadow-2xl  text-center text-pretty text-2xl w-full bg-foreground/50 absolute left-1/2 top-1/12 -translate-x-1/2'>
        {item?.caption}
        </div>
        <div className=' w-11/12 absolute bottom-11 space-y-1 left-3'>
          <a href={`/@${item?.author?.name?.toLowerCase()}`} className=' leading-[21px] text-background font-semibold text-base flex gap-1 items-center'>{item?.author?.fullname} <LucideBadgeCheck className=' text-[#20d5ec]'/></a>
          <div onClick={()=> setShow(prev => !prev)}  className={` ${show ? "text-pretty transition-all duration-500":" transition-all duration-500 overflow-hidden text-ellipsis whitespace-nowrap"} bg-foreground/10 transition-all duration-500  text-sm text-background/85`}>
            {item?.description}
          </div>
          <motion.div className=' flex justify-end'>
            <span onClick={()=> setShow(prev => !prev)} className=' text-white'>{show ? "Less":"More"}</span>
          </motion.div>
        </div>
      </section>
        

         <div className=' absolute z-50 bottom-5 right-5 md:right-0 md:relative md:-top-5 flex flex-col gap-4 items-center justify-end'>
          {/* author follow */}
            <FollowAuthorMini userId={session?.user?.id as string} item={item?.author} />

            {/* like and count */}
            <CLikeBtn count={item?.likes as number} videoId={item?._id} userId={session?.user?.id as string}/>


            {/*  comments */}
              <CVideoModal userId={session?.user?.id as string} item={item} triggerBtn={ 
              <CommentButton text={commentCount} beforeIcon={<MessageCircleMoreIcon className=' size-6 text-muted-custom-text'/>}/>    
            }/>
            

            {/* bookmark */}
            <BookmarkBtn userId={session?.user?.id as string} video={item}/>


            {/* share/repost */}
            <TypeButton isDone={true} afterIcon={<Share className=' size-6 text-primary-custom'/>} 
            beforeIcon={<Share className=' size-6 text-muted-custom-text'/>} text={"51.2K"}/>
        </div>
    </div>

  )
}

export default CVideoCard