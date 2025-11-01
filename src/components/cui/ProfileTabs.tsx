'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BookmarkCheck, CalendarHeart, TvMinimalPlay } from 'lucide-react'
import { VideoType } from '@/types/definitions.types'
import ProfileVideoCard from './ProfileVideoCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCounterStore } from '@/providers/zustand-store'

const ProfileTabs = ({userId, celebrityId, createdVideos}:{userId:string; celebrityId:string; createdVideos:Array<VideoType>}) => {

    const { bookmarked} = useCounterStore((state) => state );

   
    const [tabs, setTabs] = useState("videos")
    const searchParams = useSearchParams();

    const [tabs2, setTabs2] = useState(searchParams.get("query") || "desc")

    //const pathname = usePathname();
    const { replace } = useRouter();
    
      const handleChange = (event: string) => {
        setTabs2(event)

        const params = new URLSearchParams(searchParams);
        if (event) {
          params.set('sort', event);
        } else {
          params.delete('sort');
        }
        replace(`?${params.toString()}`);
      };


  return (
    <Tabs value={tabs} onValueChange={(e)=> {setTabs(e)}} className="h-full relative ">
        <div className=' flex md:flex-row flex-col border-b border-b-muted-custom/50 '>
            <TabsList className={`grid gap-1 w-full md:w-auto px-5 border-b border-b-muted-custom rounded-none
             bg-light-muted text-background ${userId == celebrityId ? "grid-cols-3":"grid-cols-2"}`}>
                <TabsTrigger className={`${tabs == "videos" ? 'bg-light-muted!  border-b-background ':''}
                text-background border-b-2 hover:border-b-background transition-all duration-500 rounded-none`} value="videos">
                    <TvMinimalPlay/>Videos
                </TabsTrigger>
                <TabsTrigger className={`${tabs == "liked" ? 'bg-light-muted! border-b-background ':''} text-background border-b-2 
                rounded-none hover:border-b-background transition-all duration-500 `} value="liked">
                    <CalendarHeart />Liked
                </TabsTrigger>
                {userId == celebrityId && <TabsTrigger className={`${tabs == "favorites" ? 'bg-light-muted! border-b-background ':''} text-background border-b-2 
                rounded-none hover:border-b-background transition-all duration-500 `} value="favorites">
                    <BookmarkCheck />Favorites
                </TabsTrigger>}
            </TabsList>

            <Tabs className='ml-auto hidden md:block' value={tabs2} onValueChange={(e)=> handleChange(e)}>
                <TabsList className="grid  bg-light-muted text-background grid-cols-3">
                    <TabsTrigger className={`${ tabs2 == "desc" ? "bg-muted-custom-text!":""}  text-background`} value="desc">Latest</TabsTrigger>
                    <TabsTrigger className={`${ tabs2 == "views" ? "bg-muted-custom-text!":""}  text-background`} value="views">Popular</TabsTrigger>
                    <TabsTrigger className={`${ tabs2 == "asc" ? "bg-muted-custom-text!":""}  text-background`} value="asc">Oldest</TabsTrigger>
                </TabsList>
            </Tabs>    
        </div>
        

        <TabsContent className=" h-full relative space-y-3" value="videos">
            <h1 className=' text-lg text-background'>Videos</h1>
            <section className=' grid grid-cols-4 gap-4'>
                {createdVideos?.map(item => (
                    <div className=' col-span-4 sm:col-span-2 lg:col-span-1' key={item?._id}>
                        <ProfileVideoCard isAuthor={false} item={item}/>
                    </div>
                ))}

            </section>
        </TabsContent>

        <TabsContent value="liked">
        </TabsContent>

        <TabsContent value="favorites">
        <h1 className=' text-lg text-background'>Favorites</h1>
            <section className=' grid grid-cols-4 gap-4'>
                {bookmarked?.map(item => (
                    <div className=' col-span-4 sm:col-span-2 lg:col-span-1' key={item?._id}>
                        <ProfileVideoCard isAuthor={false} item={item}/>
                    </div>
                ))}

            </section>
        </TabsContent>
  </Tabs>
  )
}

export default ProfileTabs