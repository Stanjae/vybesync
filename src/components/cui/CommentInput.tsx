'use client'
import React, { FormEvent, useState } from 'react'
import { Input } from '../ui/input'
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../ui/button';
import { Laugh, Loader2 } from 'lucide-react';


const CommentInput = ({isPending, placeholder, addComment}:{isPending?:boolean; placeholder:string, addComment?:(text:string)=> void}) => {
    const [showEmoji, setShowEmoji] = useState(false)

    const [text, setText] = useState('')

    const handleSubmit=(event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
     if(addComment) addComment(text);
     setText('');
    }
  return (
    <section className=' relative'>
         <EmojiPicker width={350} onEmojiClick={(e)=> setText(prev => prev + e.emoji)} searchDisabled height={350} style={{position:'absolute', zIndex:99999, bottom:'50px', right:'10px'}} open={showEmoji} />
        <form onSubmit={handleSubmit} className=' flex items-center gap-2'>
            <div className=' grow relative'>
                <Input className=' text-white' value={text} onChange={(e)=> setText(e.target.value)} placeholder={placeholder}/>
                <Button type='button' onClick={()=> setShowEmoji(prev => !prev)} variant={'ghost'} size={'icon'} 
                className=' absolute text-lime-50 top-1/2 -translate-y-1/2 right-4 bg-transparent rounded-full'><Laugh/></Button>
            </div>
            <Button type='submit' disabled={!text} variant={'ghost'} size={'lg'} className=' disabled:text-muted-custom-text bg-transparent hover:bg-muted-custom hover:text-primary-custom text-primary-custom'>
              {isPending && <Loader2 className="animate-spin" />}
              Post
            </Button>
        </form>
        
    </section>
    
  )
}

export default CommentInput