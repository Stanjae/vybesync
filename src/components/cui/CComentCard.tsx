'use client'
import React, { useEffect, useState } from 'react'
import { Card,  CardDescription,  CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Heart, X } from 'lucide-react'
import { motion } from 'motion/react'
import CommentInput from './CommentInput'
import { addCommentType, CommentType, replyType } from '@/lib/definitions'
import dayjs from 'dayjs'
import { CommentDialog } from './AlertDialog'
import { useMutation,} from '@tanstack/react-query'
import { getQueryClient } from '@/react-query-config/get-query-client'
import { deleteReplyByKey, deleteVideoComment, fetchCommentLikeArray, getCommentsWithLikedUserIds, handleCommentLikes, handleReplyLikes, insertReply } from '@/lib/actions'
import millify from 'millify'
import { toast } from 'sonner'

const queryClient = getQueryClient()

export const CComentCard = ({item, userId}:{item:CommentType, userId:string | undefined}) => {

    const {mutateAsync, isPending} = useMutation({ mutationKey: ['deleteComment'],
        mutationFn: async(id:string | undefined)=>{
             const response = await deleteVideoComment(id);
             return response;
        },
        onSettled: () => {
          // Replace optimistic todo in the todos list with the result
          queryClient.invalidateQueries({ queryKey: ['getComments'] })
        }
    });

    const {mutateAsync:addAsync, isPending:Pending} = useMutation({ mutationKey: ['addreply'],
        mutationFn: async(newData:replyType)=>{
             const response = await insertReply(newData);
             return response;
        },
        onSettled: () => {
          // Replace optimistic todo in the todos list with the result
          queryClient.invalidateQueries({ queryKey: ['getComments'] })
        }
    });
    

    const deleteCommentById = async()=>{
        await mutateAsync(item?._id)
    }

    const addReply =async(text:string)=>{
        await addAsync({reply_text:text, uid:{_id:userId }, commentId:item?._id})
    }

    const [reply, setReply]= useState<boolean>(false);

    const [view, setView] = useState(false);

    const [likeArray, setLikeArray] = useState<string[]>([]);

    useEffect(()=>{
        const getLikesArr =async()=>{
            const response = await fetchCommentLikeArray(item?._id as string);
            setLikeArray(response);
        }
        getLikesArr()
    },[])

    const toggleLike = async()=>{
        if(!userId){
            toast.warning("You must be logged in");
            return
        }

        if(likeArray?.includes(userId as string)){
            setLikeArray(prev => prev?.filter(ten => ten != userId))
        }else{
            setLikeArray(prev => [...prev, userId as string])
        }

        try{
            await handleCommentLikes(item?._id as string, userId as string)
        }catch(err){
            setLikeArray(prev => prev?.filter(ten => ten != userId))
            toast.error(`Failed to like comment, ${err}`);
        }
    }

    const small = { visible: { display:"flex", opacity:1 }, hidden: { display:"none", opacity:0 }}

    const created = dayjs(item?._createdAt).format('MM - DD');
  return (
    <Card className={` ${isPending ? "opacity-5":"opacity-100"} p-2 bg-light-muted border-none`}>
        <motion.section initial={'hidden'} variants={small} animate={'visible'} className={` gap-2 flex items-start`}>
            <Avatar>
                <AvatarImage src={item?.userId?.image as string} alt="@shadcn" />
                <AvatarFallback>{item?.userId?.name?.slice(0,2)}</AvatarFallback>
            </Avatar>
            <div className=" grow space-y-1">
                <CardTitle className=' text-background'>{item?.userId?.name}</CardTitle>
                <CardDescription className=' text-background/65 font-medium'>{item?.comment_text}
                </CardDescription>
                <div className=' text-background flex gap-8 items-center'>
                    <span className=' text-sm'>{created}</span>
                    <Button onClick={()=> setReply(true)} className=' text-background' variant={'link'} size={'sm'}>Reply</Button>
                    
                   {userId == item?.userId?._id && <CommentDialog handleDelete={deleteCommentById} description='Do you wanna Delete Permanently?' 
                   trigger={<Button size={'sm'} className='focus-visible:ring-0 focus-within:ring-0 outline-none text-primary-custom'>
                    Clear</Button>}/>
                    }
                </div>
                {item?.reply && item?.reply.length > 0 && <Button className=' text-background' onClick={()=> setView(prev => !prev)} variant={'link'} size={'sm'}>
                    {view ? "Unview":"View Replies"}
                </Button>}
                <motion.div initial={"hidden"} animate={reply ? "visible":"hidden"} variants={small} className=''>
                    <CommentInput isPending={Pending} addComment={addReply} placeholder='reply...'/>
                    <Button className='ml-auto' onClick={()=> setReply(false)} size={'icon'}><X/></Button>
                </motion.div>
                {view &&<div>
                    {item?.reply?.map((itemo, index)=>(
                        <ReplyComentCard commentId={item?._id as string} replyingTo={item?.userId?.name} userId={userId} itemo={itemo}
                         key={index}/>
                    ))}  
                </div>}
            </div>
            <div className=' ml-auto'>
                <Button onClick={toggleLike} className=' rounded-full' size={'icon'}>
                    <Heart className={`${likeArray?.includes(userId as string) ? "text-primary-custom":""}`}/>
                </Button>
                <p className=' text-base text-muted-custom-text text-center'>{millify(likeArray?.length as number || 0)}</p>
            </div>
        </motion.section>
    </Card>
  )
}

export const DelayComentCard = ({item}:{item:addCommentType}) => {
    const [reply, setReply]= useState<boolean>(false);

    const [view, setView] = useState(false);

    const small = {
        visible: { display:"flex", opacity:1 },
        hidden: { display:"none", opacity:0 },
      }

      const small1 = {
        visible: { display:"flex", opacity:0.2 },
        hidden: { display:"none", opacity:0 },
      }

      const created = dayjs().format('MM - DD');
  return (
    <Card className=' p-2 bg-light-muted border-none'>
        <motion.section initial={'hidden'} variants={small1} animate={'visible'} className=' gap-2 flex items-start'>
            <Avatar>
                <AvatarImage src={item?.name as string} alt="@shadcn" />
                <AvatarFallback>{item?.name?.slice(0,2)}</AvatarFallback>
            </Avatar>
            <div className=" space-y-1">
                <CardTitle className=' text-background'>{item?.name}</CardTitle>
                <CardDescription className=' text-background/65 font-medium'>{item?.comment_text}
                </CardDescription>
                <div className=' text-background flex gap-10 items-center'>
                    <span className=' text-sm'>{created}</span>
                    <Button className=' text-background' variant={'link'} size={'sm'}>Reply</Button>
                </div>
                <Button className=' text-background' onClick={()=> setView(prev => !prev)} variant={'link'} size={'sm'}>{view ? "Unview":"View Replies"}</Button>
                <motion.div initial={"hidden"} animate={reply ? "visible":"hidden"} variants={small} className=''>
                    <Button className='ml-auto' onClick={()=> setReply(false)} size={'icon'}><X/></Button>
                </motion.div>
                {view &&<div>
                </div>}
            </div>
            <div className=' ml-auto'>
                <Button className=' rounded-full' size={'icon'}><Heart/></Button>
            </div>
        </motion.section>
    </Card>
  )
}

export const ReplyComentCard = ({itemo, userId, replyingTo, commentId}:{commentId:string; replyingTo:string | undefined;itemo:replyType; userId:string | undefined}) => {
    //const [reply, setReply]= useState<boolean>(false)

    const small = { visible: { display:"block", opacity:1 },hidden: { display:"none", opacity:0 }};
    const created = dayjs(itemo?.createdAt).format('MM - DD');

    const {mutateAsync, isPending} = useMutation({ mutationKey: ['deleteReply'],
        mutationFn: async(replyKey:string | undefined)=>{
             const response = await deleteReplyByKey(commentId, replyKey as string);
             return response;
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['getComments'] })
        }
    });

    const [likeArray, setLikeArray] = useState<string[]>([]);

    useEffect(()=>{
        const getLikesArr =async()=>{
            const response = await getCommentsWithLikedUserIds(commentId, itemo?._key as string);
            setLikeArray(response);
        }
        getLikesArr()
    },[])

    const toggleLike = async()=>{
        if(!userId){
            toast.warning("You must be logged in");
            return
        }

        if(likeArray?.includes(userId as string)){
            setLikeArray(prev => prev?.filter(ten => ten != userId))
        }else{
            setLikeArray(prev => [...prev, userId as string])
        }

        try{
            await handleReplyLikes(commentId, itemo?._key as string, userId)
        }catch(err){
            setLikeArray(prev => prev?.filter(ten => ten != userId))
            toast.error(`Failed to like comment, ${err}`);
        }
    }

    const deleteReply =async()=>{
        await mutateAsync(itemo?._key)
    }
  return (
    <motion.div initial={'hidden'} variants={small} animate={'visible'} className={`${isPending ? "opacity-5":""} p-2 space-y-2 bg-light-muted border-none`}>
        <div className='text-gray-600 text-xs'>replying to @{replyingTo}</div>
        <section className=' gap-2 flex items-start'>
            <Avatar className=' size-4' >
                <AvatarImage src={itemo?.uid?.image} alt={itemo?.reply_text} />
                <AvatarFallback>{itemo?.uid?.name?.slice(0,2)}</AvatarFallback>
            </Avatar>
            <div className=" space-y-1">
                <CardTitle className=' text-background'>{itemo?.uid?.name}</CardTitle>
                <CardDescription className=' text-background/65 font-medium'>
                    {itemo?.reply_text}
                </CardDescription>
                <div className=' text-background flex gap-10 items-center'>
                    <span className=' text-sm'>{created}</span>
                    {/* <Button onClick={()=> setReply(true)} className=' text-background' variant={'link'} size={'sm'}>Reply</Button> */}
                    {userId == itemo?.uid?._id && <CommentDialog handleDelete={deleteReply} description='Do you wanna Delete Permanently?' 
                   trigger={<Button size={'sm'} className='focus-visible:ring-0 focus-within:ring-0 outline-none text-primary-custom'>
                    Clear</Button>}/>
                    }
                </div>
            </div>
            <div className=' ml-auto'>
                <Button onClick={toggleLike} className=' size-4 rounded-full' size={'icon'}>
                    <Heart className={`${likeArray?.includes(userId as string) ? "text-primary-custom":""}`}/>
                </Button>
                <p className=' text-sm text-muted-custom-text text-center'>{millify(likeArray?.length as number || 0)}</p>
            </div>
        </section>
    </motion.div>
  )
}

