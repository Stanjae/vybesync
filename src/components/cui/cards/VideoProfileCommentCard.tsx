'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import DetailLikeBtn from "../DetailLikeBtn";
import Link from "next/link";
import DetailFollowBtn from "../DetailFollowBtn";
import BookmarkBtn from "../BookmarkBtn";
import { CommentTabs } from "../CommentTabs";
import { Button } from "../../ui/button";
import { VideoType } from '@/lib/definitions';
import { DetailTypeButton } from '../TypeButton';
import {
  Code,
  MessageCircleMoreIcon,
  Repeat2,
  Send,
  Share,
} from "lucide-react";
import { Input } from "../../ui/input";
import { toast } from "sonner";

type Props = {
    item: VideoType
    userId: string;
    width?: string;
}

const VideoProfileCommentCard = ({ item, userId, width='544px' }: Props) => {
    const imageUrl = item?.author?.image as string;

     const ShareUrl = `${process.env.NEXT_PUBLIC_URL}/@${item?.author?.name}/video/${item?._id}`

     const [show, setShow] = useState(false);

     const [copied, setCopied] = useState(false);

     const handleCopy = async () => {
       try {
         await navigator.clipboard.writeText(ShareUrl);
         setCopied(true);
         toast.success("URL copied to clipboard!");
         setTimeout(() => setCopied(false), 4000); // Reset after 2 seconds
       } catch (error) {
         console.error("Failed to copy:", error);
       }
     };
  return (
    <div className={`${width} bg-light-muted`}>
      <section className=" space-y-3 px-4 py-2">
        {/* profile box */}
        <div className=" space-y-2 p-4 bg-[#1B1B1B] rounded-2xl">
          <div className=" gap-2 flex items-center">
            <Image
              src={imageUrl}
              width={100}
              height={100}
              alt="profile image"
              className=" w-[40px] h-[40px] rounded-full"
            />
            <div>
              <span className=" block font-bold text-lg text-white">
                {item?.author?.fullname}
              </span>
              <span className=" block font-medium text-sm text-white/40">
                {item?.author?.name}
              </span>
            </div>
            {item?.author?._id == userId ? (
              <Button
                asChild
                size={"lg"}
                className=" ml-auto rounded-none bg-primary-custom"
              >
                <Link href={`/@${item?.author?.name}`}>View Profile</Link>
              </Button>
            ) : (
              <DetailFollowBtn
                celebrityId={item?.author?._id as string}
                userId={userId}
              />
            )}
          </div>

          <div>
            <div
              onClick={() => setShow((prev) => !prev)}
              className={`${show ? "text-pretty transition-all duration-500" : " transition-all duration-500 overflow-hidden text-ellipsis whitespace-nowrap"} bg-foreground/10 transition-all duration-500  text-sm text-background/85`}
            >
              {item?.description}
            </div>
            <div className=" flex justify-end">
              <span
                onClick={() => setShow((prev) => !prev)}
                className=" text-white"
              >
                {show ? "Less" : "More"}
              </span>
            </div>
          </div>
        </div>

        {/* social links */}
        <section className=" flex justify-between items-center">
          <div className=" flex items-center gap-3">
            <DetailLikeBtn
              videoId={item?._id}
              userId={userId}
              count={item?.likes as number}
            />

            <DetailTypeButton
              isDone={false}
              beforeIcon={
                <MessageCircleMoreIcon className=" size-5 text-muted-custom-text" />
              }
              text={item?.comment_count as number}
            />

            <BookmarkBtn userId={userId} video={item} />
          </div>

          <div className=" flex items-center gap-2">
            <Button className=" size-6 bg-amber-400 rounded-full" size={"icon"}>
              <Repeat2 />
            </Button>
            <Button
              className=" size-6 bg-muted-custom rounded-full"
              size={"icon"}
            >
              <Code />
            </Button>
            <Button
              className=" size-6 bg-primary-custom rounded-full"
              size={"icon"}
            >
              <Send />
            </Button>
            <Button className=" size-6 bg-blue-500 rounded-full" size={"icon"}>
              <Share />
            </Button>
          </div>
        </section>

        {/* share link inputs */}

        <section>
          <div className=" flex items-center">
            <Input
              id="input"
              defaultValue={ShareUrl}
              type="text"
              readOnly
              className=" ring-0 focus-visible:ring-0 focus-within:ring-0 outline-none border-none
                         bg-muted-custom-text/50 w-full px-2 py-1 rounded-l-md rounded-r-none  text-sm"
              placeholder="Link to share"
            />
            <Button
              onClick={handleCopy}
              size={"default"}
              className=" rounded-r-md rounded-l-none bg-muted-custom hover:bg-muted-custom/80"
            >
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </section>
      </section>
      <div className="flex-1 min-h-0">
        <CommentTabs userId={userId} videoId={item?._id} />
      </div>
    </div>
  );
}

export default VideoProfileCommentCard