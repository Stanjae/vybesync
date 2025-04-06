'use client'
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { VideoResponse } from "@/lib/definitions";
import axios from 'axios'
import { Button } from "../ui/button";
import { AlertCircle, FileTerminal, FileVideo, Lightbulb, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import CLoader from "./CLoader";
import UploadForm from "./UploadForm";
import { Session } from "next-auth";


export const navs = [
 {title: "Size and duration", text:"Maximum size: 30 GB, video duration: 60 minutes", icon:<VideoIcon className=" size-5 text-foreground"/>},
 {title:"File formats", text:"Recommended: .mp4. Other major formats are supported.", icon:<FileVideo className="size-5 text-foreground"/>},
 {title:"Video resolutions", text:"High-resolution recommended: 1080p, 1440p, 4K.", icon:<FileTerminal className="size-5 text-foreground"/>},
 {title:"Aspect ratios", text:"Recommended: 16:9 for landscape, 9:16 for vertical.", icon:<Lightbulb className="size-5 text-foreground"/>}
]

export function UDropzone({session}:{session:Session}) {

  const [videoURL, setVideoURL] = useState<VideoResponse | null>();

  const [progress, setProgress] = useState<boolean>();

  const [unfinished, setUnfinished] = useState<boolean>(false)

  const [step, setStep] = useState<boolean>(false);


  useEffect(()=>{
    if(sessionStorage.getItem('upload')){
      setVideoURL(JSON.parse(sessionStorage.getItem('upload')!));
      setUnfinished(true);
    } 
  },[])

  const handleFileUpload = async(files: File[]) => {
    setProgress(true)
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / (progressEvent?.total as number) ) * 100;
          console.log(`Upload Progress: ${progressEvent.total} || ${progress.toFixed(2)}%`);
        },
      }).then((response)=>{
      console.log('Upload successful:', response.data.url);
      setVideoURL(response.data.url);
      setProgress(false)
      setStep(true)
      sessionStorage.setItem('upload', JSON.stringify(response.data.url));
      });
      toast.success("video uploaded successfully")
    } catch (error) {
      console.error('Upload failed:', error);
    }

  };

  const handleRemove = async() => {
    try{
      const response = await axios.delete('/api/upload/remove', {data:{public_id:videoURL?.public_id}})
      setVideoURL(null);
      sessionStorage.removeItem('upload');
      setUnfinished(false)
      toast.success(response.data?.message)
    }catch(err){
      console.error('Remove failed:', err);
    }
  }

  const handleDiscard = async() => {
    await handleRemove();
    setStep(false);
  }

  const clearPostAfterSuccess =()=>{
    setVideoURL(null);
    sessionStorage.removeItem('upload');
    setUnfinished(false);
    setStep(false);
  }


  return (
    <main>
      {!step ? <div className="w-full max-w-5xl p-4 mx-auto min-h-96 border border-dashed bg-background border-neutral-200 rounded-lg">

      {unfinished && <div className=" my-2 rounded-lg text-foreground flex items-center justify-between bg-[#F8F8F8] py-3 px-2">
        <div className=" flex gap-2 items-center"><AlertCircle className=" text-red-600 size-5"/>A video you were editing wasn&apos;t saved. Continue Editing</div>
        <div className=" flex gap-2 items-center">
          <Button onClick={handleRemove} className=" bg-primary-custom cursor-pointer hover:bg-primary-custom/80 text-background">Discard</Button>
          <Button onClick={()=>{ setStep(true); setUnfinished(false)}} className=" cursor-pointer bg-background" variant={'ghost'}>Continue</Button>
        </div>
      </div> }

  
        <div>
            <FileUpload onChange={handleFileUpload} />
           {progress && <div className=" flex justify-center">
              <CLoader/>
            </div>}

            <section className=" mt-20 flex ">
              {navs.map((item, index)=>(
                <div key={index} className=" gap-2 flex">
                  {item.icon}
                  <div>
                    <h4 className=" text-base">{item.title}</h4>
                    <p className=" text-gray-500 text-xs">{item.text}</p>
                  </div>
              </div>
              ))}
              
            </section>
        </div>
     
      
    </div>
    :
    <UploadForm handleDiscard={handleDiscard} handleSuccess={clearPostAfterSuccess} session={session} videoUrl={videoURL}/>
    }
    </main>
    
  );
}
