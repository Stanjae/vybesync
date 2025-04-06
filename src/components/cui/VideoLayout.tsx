'use client'
import React, { useRef, useState } from 'react'
import CVideoCard from './CVideoCard'
import { VideoType } from '@/lib/definitions'
import {
  useScroll,
  useMotionValueEvent
} from "motion/react"
import { Button } from '../ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Session } from 'next-auth'

const VideoLayout = ({response, session}:{session:Session | null ;response:Array<VideoType>}) => {
  const [videoId, setVideoId] = useState('')

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(0);

  const { /* scrollYProgress, */ scrollY } = useScroll()
  /* const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
  }) */

  useMotionValueEvent(scrollY, "change", (latest) => {
   setExpanded(latest)
   setCurrentIndex(Math.round(latest / 776))
  })

  const scrollToVideo = (index: number) => {
    if (index < 0 || index >= response?.length) return; // Prevent going out of range
    setCurrentIndex(index);

    const videoElement = document.getElementById(`video-${index}`);
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
       <div id="example" ref={containerRef} className=' bg-foreground text-background relative h-full'>
      {response?.map((item, index)=> (
        <CVideoCard session={session} videoId={videoId} id={index} setVideoId={setVideoId} item={item} key={item?._id}/>
      ))}
        {/* <motion.div className="progress" style={{ scaleX }} /> */}


         <div className=' hidden md:block z-30 fixed space-y-3 top-1/2 -translate-y-1/2 right-5'>
                <Button disabled={expanded == 0} onClick={() => scrollToVideo(currentIndex - 1)} className=' cursor-pointer flex rounded-full justify-center items-center p-7' size={'icon'}>
                  <ChevronUp className=' size-8'/>
                </Button>
                <Button onClick={() => scrollToVideo(currentIndex + 1)} className=' cursor-pointer  flex rounded-full justify-center items-center p-7' size={'icon'}>
                  <ChevronDown className=' size-8'/>
                </Button>
              </div>
    </div>
   
  )
}

export default VideoLayout