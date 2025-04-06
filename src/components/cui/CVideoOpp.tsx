'use client'
import React from "react"

export function Video({src}:{src:string}) {
    return (
      <video className=" h-[400px] w-[300px]" width="300" height="400" controls autoPlay>
        <source className=" h-[400px]" src={src} type="video/mp4" />
        {/* <track
          src={src}
          kind="subtitles"
          srcLang="en"
          label="English"
        /> */}
      </video>
    )
  }