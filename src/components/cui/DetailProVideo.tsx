"use client";
import { VideoType } from "@/lib/definitions";
import React, { useState } from "react";
import DetailedSearchInput from "./DetailedSearchInput";
import Image from "next/image";
import { Button } from "../ui/button";
import { CommentButton, DetailTypeButton, TypeButton } from "./TypeButton";
import {
  Code,
  Facebook,
  MessageCircleMoreIcon,
  Repeat2,
  Send,
  Share,
} from "lucide-react";
import { CommentTabs } from "./CommentTabs";
import Link from "next/link";
import DetailLikeBtn from "./DetailLikeBtn";
import "next-cloudinary/dist/cld-video-player.css";
import DetailCopyInput from "./DetailCopyInput";
import DetailDescription from "./DetailDescription";
import DetailVideoPlayer from "./DetailVideoPlayer";
import DetailFollowBtn from "./DetailFollowBtn";
import BookmarkBtn from "./BookmarkBtn";
import FollowAuthorMini from "../ui/FollowAuthorMini";
import CLikeBtn from "./CLikeBtn";
import { CommentDrawer } from "./mobile/CommentDrawer";
import { CDrawer } from "./Drawers/CDrawer";

const DetailProVideo = ({
  item,
  userId,
}: {
  item: VideoType;
  userId: string;
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const imageUrl = item?.author?.image as string;
  const ShareUrl = `${process.env.NEXT_PUBLIC_URL}/@${item?.author?.name}/video/${item?._id}`;

  const openCommentsDrawer = () => {
    setMobileDrawerOpen(true);
  };

  return (
    <main className=" flex flex-row bg-foreground rounded-none hunt overflow-hidden">
      <div className=" h-full flex bg-foreground justify-center grow">
        <section id="detail" className=" relative w-[419px]">
          <div className=" px-5 w-full z-50 absolute top-5">
            <DetailedSearchInput />
          </div>

          <DetailVideoPlayer videoId={item?._id} videoUrl={item?.videoUrl} />
        </section>
        <div className=" md:hidden absolute z-40 top-1/2 -translate-y-1/2 md:translate-y-0 right-5 md:right-0 md:relative md:-top-5 flex flex-col gap-4 items-center justify-end">
          {/* author follow */}
          <FollowAuthorMini userId={userId} item={item?.author} />

          {/* like and count */}
          <CLikeBtn
            count={item?.likes as number}
            videoId={item?._id}
            userId={userId}
          />

          {/*  comments */}
          <CommentButton
            count={item?.comment_count || 0}
            beforeIcon={MessageCircleMoreIcon}
            action={openCommentsDrawer}
          />

          {/* bookmark */}
          <BookmarkBtn userId={userId} video={item} />

          {/* share/repost */}
          <TypeButton
            isDone={true}
            afterIcon={<Share className=" size-6 text-primary-custom" />}
            beforeIcon={<Share className=" size-6 text-muted-custom-text" />}
            text={"51.2K"}
          />
        </div>
      </div>
      <div className=" pt-5 w-0 hidden lg:block md:w-[544px] h-full bg-light-muted">
        <section className=" space-y-3 p-4">
          {/* profile box */}
          <div className=" space-y-2 p-4 bg-[#1B1B1B] rounded-2xl">
            <div className=" flex gap-2 items-center">
              <Link
                className=" gap-2 flex items-center"
                href={`/@${item?.author?.name}`}
              >
                <Image
                  src={imageUrl}
                  width={100}
                  height={100}
                  alt="profile image"
                  className=" w-[40px] h-[40px] rounded-full"
                />
                <div>
                  <span className=" block font-bold text-lg">
                    {item?.author?.fullname}
                  </span>
                  <span className=" block font-medium text-sm">
                    {item?.author?.name}
                  </span>
                </div>
              </Link>

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

            <DetailDescription description={item?.description} />
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
              <Button
                className=" size-6 bg-amber-400 rounded-full"
                size={"icon"}
              >
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
              <Button
                className=" size-6 bg-blue-500 rounded-full"
                size={"icon"}
              >
                <Facebook />
              </Button>
            </div>
          </section>

          {/* share link inputs */}

          <section>
            <DetailCopyInput ShareUrl={ShareUrl} />
          </section>
        </section>

        <CommentTabs userId={userId} videoId={item?._id} />
      </div>

      {/* mobile */}
      <CDrawer
        opened={mobileDrawerOpen}
        closeDrawer={() => setMobileDrawerOpen(false)}
        title="Comments"
      >
        <CommentDrawer videoId={item?._id} />
      </CDrawer>
    </main>
  );
};

export default DetailProVideo;
