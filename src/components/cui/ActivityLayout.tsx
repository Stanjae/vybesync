'use client'
import { fetchNotifications, markNotificationsRead } from '@/lib/actions'
import { NotificationAll } from '@/lib/definitions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'
import React, { useState } from 'react';
import Image from 'next/image'
import { Button } from '../ui/button'
import { BellRing, CheckCheck, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Link from 'next/link'
import { getQueryClient } from '@/react-query-config/get-query-client'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import { Skeleton } from '../ui/skeleton'

dayjs.extend(relativeTime)


const ActivityLayout = ({session}:{session:Session | null}) => {
    const queryClient = getQueryClient()
    const {data, isSuccess, isPending:Pending} = useQuery({queryKey:['notifications'], 
      queryFn:async(): Promise<NotificationAll[]>=> await fetchNotifications(session?.user?.id as string)});
    
    const {mutateAsync, isPending, variables} = useMutation({ mutationKey: ['notifications'],
      mutationFn: async(id:string)=>{
           const response = await markNotificationsRead(id);
           return response;
      },
      onMutate:()=>{
      },
      onSettled: () => {
        // Replace optimistic todo in the todos list with the result
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
      });
  
    const [tabs, setTabs] = useState("all");

    const unread = data?.filter((aura)=> aura?.read == false);
    const read = data?.filter((aura)=> aura?.read)

    const markAsRead = async(id:string)=>{
      await mutateAsync(id)
    }
  return (
    <Tabs value={tabs} onValueChange={(e)=> {setTabs(e)}} className="h-full relative ">
      <TabsList className="grid px-5 border-b border-b-muted-custom rounded-none bg-light-muted text-background grid-cols-3">
        <TabsTrigger className={`${tabs == "all" ? 'bg-light-muted!  border-b-background ':''} text-background border-b-2 rounded-none`} value="all">All ({data?.length})</TabsTrigger>
        <TabsTrigger className={`${tabs == "unread" ? 'bg-light-muted! border-b-background ':''} text-background border-b-2  rounded-none`} value="unread">Unread ({unread?.length})</TabsTrigger>
        <TabsTrigger className={`${tabs == "read" ? 'bg-light-muted! border-b-background ':''} text-background border-b-2  rounded-none`} value="read">Read ({read?.length})</TabsTrigger>
      </TabsList>

      <TabsContent className=" h-full relative" value="all">
        <ul className=' space-y-3'>
        {Pending && Array(5).fill("_").map((data) => <Skeleton className=' bg-muted-custom h-10 w-full rounded-lg' key={data?._id}/>)}
        {isSuccess && data?.map((notif) => (
          <li key={notif._id} className={`${notif?.read ? "bg-foreground border-muted-custom":"bg-muted-custom border-muted-custom-text"} border  text-lime-50 p-3 flex items-start gap-4 rounded-lg`}>
            <div><BellRing /></div>
            <div className='grow space-y-2'>
               <div className=' flex gap-3 items-center text-base'>
                {!notif?.read && <span className="flex size-2 translate-y-1 rounded-full bg-primary-custom" />}
                {notif?.read ? "You have viewed this notification":"You have a new notification" }
                <span className=' text-sm text-gray-500'>&bull; {" "} {dayjs(notif?._createdAt).fromNow()}</span>
               </div>
                <div className=' flex gap-2'>
                  <Link href={`/@${notif?.sender?.name}`}>
                    <Image className='rounded-full w-5 h-5' width={100} height={100} src={notif?.sender?.image} alt={notif?._createdAt}/>
                  </Link>
                  
                  <p className=' text-muted-custom-text'>{notif?.sender.name} {" "}
                    <span className=' text-sm text-amber-50'>{notif?.type == 'follow' ? "Followed You 🔔": notif?.type == "comment" ? 
                    "Commented on your Post 💬": "Liked your Post 💖"}</span></p>
                </div>
            </div>
            <Button onClick={()=> markAsRead(notif?._id)} disabled={notif?.read} className='ml-auto' size={'sm'}>
              {notif.read ? <CheckCheck/> : isPending && notif?._id == variables ? <Loader2 className="animate-spin" /> : "Mark as Read"}</Button>
          </li>
        ))}
      </ul>
      </TabsContent>

      <TabsContent className=" h-full relative" value="unread">
        <ul className=' space-y-3'>
        {unread?.map((notif) => (
          <li key={notif._id} className={`${notif?.read ? "bg-foreground border-muted-custom":"bg-muted-custom border-muted-custom-text"} border  text-lime-50 p-3 flex items-start gap-4 rounded-lg`}>
          <div><BellRing /></div>
          <div className='grow space-y-2'>
             <div className=' flex items-start gap-3 text-base'>
              {!notif?.read && <span className="flex size-2 translate-y-1 rounded-full bg-primary-custom" />}
              {notif?.read ? "You have viewed this notification":"You have a new notification" }
             </div>
              <div className=' flex gap-2'>
                <Link href={`/@${notif?.sender?.name}`}>
                  <Image className='rounded-full w-5 h-5' width={100} height={100} src={notif?.sender?.image} alt={notif?._createdAt}/>
                </Link>
                
                <p className=' text-muted-custom-text'>{notif?.sender.name} {" "}
                  <span className=' text-sm text-amber-50'>{notif?.type == 'follow' ? "Followed You 🔔": notif?.type == "comment" ? 
                  "Commented on your Post 💬": "Liked your Post 💖"}</span></p>
              </div>
          </div>
          <Button onClick={()=> markAsRead(notif?._id)} disabled={notif?.read} className='ml-auto' size={'sm'}>{notif.read ? <CheckCheck/> : "Mark as Read"}</Button>
        </li>
        ))}
      </ul>
      </TabsContent>

      <TabsContent className=" h-full relative" value="read">
        <ul className=' space-y-3'>
        {read?.map((notif) => (
          <li key={notif._id} className={`${notif?.read ? "bg-foreground border-muted-custom":"bg-muted-custom border-muted-custom-text"} border  text-lime-50 p-3 flex items-start gap-4 rounded-lg`}>
          <div><BellRing /></div>
          <div className='grow space-y-2'>
             <div className=' flex items-start gap-3 text-base'>
              {!notif?.read && <span className="flex size-2 translate-y-1 rounded-full bg-primary-custom" />}
              {notif?.read ? "You have viewed this notification":"You have a new notification" }
             </div>
              <div className=' flex gap-2'>
                <Link href={`/@${notif?.sender?.name}`}>
                  <Image className='rounded-full w-5 h-5' width={100} height={100} src={notif?.sender?.image} alt={notif?._createdAt}/>
                </Link>
                
                <p className=' text-muted-custom-text'>{notif?.sender.name} {" "}
                  <span className=' text-sm text-amber-50'>{notif?.type == 'follow' ? "Followed You 🔔": notif?.type == "comment" ? 
                  "Commented on your Post 💬": "Liked your Post 💖"}</span></p>
              </div>
          </div>
          <Button onClick={()=> markAsRead(notif?._id)} disabled={notif?.read} className='ml-auto' size={'sm'}>{notif.read ? <CheckCheck/> : "Mark as Read"}</Button>
        </li>
        ))}
      </ul>
      </TabsContent>
    </Tabs>
    
  )
}

export default ActivityLayout