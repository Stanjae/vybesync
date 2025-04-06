"use client";

import { CldVideoPlayerProps, CldVideoPlayer as VideoPlayer } from 'next-cloudinary';

export default function CosVideoPlayer(props:CldVideoPlayerProps) {
    return <VideoPlayer {...props} />
}