'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import {CComentCard, DelayComentCard} from "./CComentCard"
import { ScrollArea } from "../ui/scroll-area"
import CommentInput from "./CommentInput"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { fetchVideoComments } from "@/lib/pokemon"
import { Skeleton } from "../ui/skeleton"
import { nanoid } from 'nanoid';
import { addCommentType} from "@/lib/definitions"
import { addVideoComments } from "@/lib/actions"
import { getQueryClient } from "@/react-query-config/get-query-client"
import { useCounterStore } from "@/providers/zustand-store"


export function CommentTabs({userId, videoId}:{userId:string | undefined; videoId:string | undefined}) {
  const queryClient = getQueryClient()
  const query = fetchVideoComments(videoId)
  const {isSuccess, data, isPending} = useSuspenseQuery(query);

  const { session} = useCounterStore(
        (state) => state,
      )

  const {mutateAsync, variables, isPending:Pending} = useMutation({ mutationKey: ['addComment'],
    mutationFn: async(payload:addCommentType)=>{
         const response = await addVideoComments(payload);
         return response;
    },
    onMutate:(result)=>{
      console.log("onMutate:", result)
    },
    onSettled: (result, variables, context) => {
      // Replace optimistic todo in the todos list with the result
      queryClient.invalidateQueries({ queryKey: ['getComments'] })
      console.log("result:", result, variables, context)
    }
    });

  const addComment = async(text:string)=>{
   await mutateAsync({comment_text:text, videoId, userId, name:session?.name, id:nanoid()});
  }

  const [tabs, setTabs] = useState("comments")
  return (
    <Tabs value={tabs} onValueChange={(e)=> {setTabs(e)}} className="h-full relative ">
      <TabsList className="grid px-5 border-b border-b-muted-custom rounded-none bg-light-muted text-background w-full grid-cols-2">
        <TabsTrigger className={`${tabs == "comments" ? 'bg-light-muted!  border-b-background ':''} text-background border-b-2 rounded-none`} value="comments">Comments ({data?.length})</TabsTrigger>
        <TabsTrigger className={`${tabs == "creator" ? 'bg-light-muted! border-b-background ':''} text-background border-b-2  rounded-none`} value="creator">Creator Videos</TabsTrigger>
      </TabsList>
      <TabsContent className=" h-full relative" value="comments">
        <ScrollArea className=" scrollarea-custom px-5">
            {isPending && Array(5).fill("_").map((_, index) => <Skeleton key={index} className="w-full bg-muted-custom"/>)}
            {Pending && <DelayComentCard item={variables}/>}
            {isSuccess && data?.map((item, index)=> <CComentCard userId={userId} item={item} key={index}/>)}
        </ScrollArea>
        
        <div className=" border-t border-t-muted-custom py-3 px-5">
            <CommentInput isPending={Pending} addComment={addComment} placeholder="Add Comment.."/>
        </div>
      </TabsContent>
      <TabsContent value="password">
      </TabsContent>
    </Tabs>
  )
}
