"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { addCommentType } from "@/lib/definitions"
import { addVideoComments } from "@/lib/actions"
import { getQueryClient } from "@/react-query-config/get-query-client"
import { fetchVideoComments } from "@/lib/pokemon"
import { useCounterStore } from "@/providers/zustand-store"
import { nanoid } from 'nanoid';
import { Skeleton } from "@/components/ui/skeleton"
import { CComentCard, DelayComentCard } from "../CComentCard"
import CommentInput from "../CommentInput"


export function CommentDrawer({triggerBtn, videoId}:{videoId:string; triggerBtn:React.ReactNode}) {
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
   await mutateAsync({comment_text:text, videoId, userId:session?.id as string, name:session?.name, id:nanoid()});
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {triggerBtn}
      </DrawerTrigger>
      <DrawerContent className=" bg-light-muted z-50">
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className=" text-background">Comments</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
          <section className=" overflow-y-auto h-72 space-y-2 px-5">
            {isPending && Array(5).fill("_").map((_, index) => <Skeleton key={index} className="w-full bg-muted-custom"/>)}
            {Pending && <DelayComentCard item={variables}/>}
            {isSuccess && data?.map((item, index)=> <CComentCard userId={session?.id as string} item={item} key={index}/>)}
        </section>
          </div>
          <DrawerFooter className=" border-t border-t-muted-custom py-3 px-5">
          <CommentInput isPending={Pending} addComment={addComment} placeholder="Add Comment.."/>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
