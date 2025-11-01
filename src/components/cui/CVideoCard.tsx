"use client";
import React, { useEffect, useRef, useState } from "react";
import "next-cloudinary/dist/cld-video-player.css";
import FollowAuthorMini from "../ui/FollowAuthorMini";
import { CommentButton, TypeButton } from "./TypeButton";
import {
  LucideBadgeCheck,
  MessageCircleMoreIcon,
  Pause,
  Play,
  Share,
} from "lucide-react";
import { motion } from "motion/react";
import { updateViewCount } from "@/lib/actions";
import CLikeBtn from "./CLikeBtn";
import BookmarkBtn from "./BookmarkBtn";
import CosVideoPlayer from "./CosVideoPlayer";
import useGetVideoCommentCount from "@/hooks/useGetVideoCommentCount";
import VideoProfileCommentCard from "./cards/VideoProfileCommentCard";
import VybeSyncDrawer from "./Drawers/VybeSyncDrawer";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { CDrawer } from "./Drawers/CDrawer";
import { CommentDrawer } from "./mobile/CommentDrawer";
import { VideoType } from "@/types/definitions.types";
import { TSessionType } from "@/types/auth.types";

const CVideoCard = ({
  item,
  videoId,
  id,
  session,
}: {
  session: TSessionType | null;
  id?: number;
  item: VideoType;
  videoId: string;
}) => {
  const vidref = useRef<HTMLVideoElement | null>(null);

  const { isMobile, height } = useScreenDetector();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [show, setShow] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { data: commentsCount } = useGetVideoCommentCount(item?._id as string);

  useEffect(() => {
    if (item?._id !== videoId) {
      vidref.current?.pause();
    } else {
      const currentVid = vidref.current;
      if (!currentVid) return;
      currentVid?.play();
    }
  }, [videoId, vidref, item?._id]);

  const handleVideoClick = () => {
    setShowControls(true);
    // Hide controls after 3 seconds of inactivity
    setTimeout(() => setShowControls(false), 3000);
  };

  const handlePlayVided = () => {
    if (item?._id == videoId) {
      if (isPlaying) {
        vidref.current?.pause();
      } else {
        vidref.current?.play();
      }
    }
  };

  const openCommentsDrawer = () => {
    if (isMobile) {
      setMobileDrawerOpen(true);
    } else {
      setDrawerOpen(true);
    }
  };
  return (
    <div
      id={`video-${id}`}
      className=" bg-foreground text-background h-screen containt overflow-hidden relative justify-center pt-5 gap-4 block sm:flex"
    >
      <section
        id="foryou-id"
        className="z-10 px-2 md:px-0 relative w-full sm:w-[419px]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
        onClick={handleVideoClick}
      >
        <button
          onClick={handlePlayVided}
          className={`absolute left-1/2 z-50 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 
                     backdrop-blur-sm
                     rounded-full p-6 
                     transition-all duration-300 ease-in-out
                     hover:scale-110 active:scale-95
                     border-2 border-white border-opacity-30
                     shadow-xl ${isHovering || showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {isPlaying ? (
            <Pause className="text-white" size={48} />
          ) : (
            <Play className="text-white" size={48} />
          )}
        </button>
        <CosVideoPlayer
          id={item?._id}
          videoRef={vidref}
          className=" border-none outline-none rounded-2xl"
          width="419"
          height={height}
          logo={false}
          loop={true}
          controls={true}
          src={item?.videoUrl}
          transformation={{
            color: "white",
            gravity: "center",
            opacity: 80,
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => updateViewCount(item?._id)}
        />
        <div className=" [text-shadow:_0_4px_8px_#ea284e] z-30 shadow-2xl  text-center text-pretty text-2xl w-full bg-foreground/50 absolute left-1/2 top-1/12 -translate-x-1/2">
          {item?.caption}
        </div>
        <div className=" w-11/12 z-30 absolute bottom-8 md:bottom-11 space-y-1 left-3">
          <a
            href={`/@${item?.author?.name?.toLowerCase()}`}
            className=" leading-[21px] text-background font-semibold text-base flex gap-1 items-center"
          >
            {item?.author?.fullname}{" "}
            <LucideBadgeCheck className=" text-[#20d5ec]" />
          </a>
          <div
            onClick={() => setShow((prev) => !prev)}
            className={` ${show ? "text-pretty transition-all duration-500" : " transition-all duration-500 overflow-hidden text-ellipsis whitespace-nowrap"} bg-foreground/10 transition-all duration-500  text-sm text-background/85`}
          >
            {item?.description}
          </div>
          <motion.div className=" flex justify-end">
            <span
              onClick={() => setShow((prev) => !prev)}
              className=" text-white"
            >
              {show ? "Less" : "More"}
            </span>
          </motion.div>
        </div>
      </section>

      <div className=" absolute z-40 top-1/2 -translate-y-1/2 md:translate-y-0 right-5 md:right-0 md:relative md:-top-5 flex flex-col gap-4 items-center justify-end">
        {/* author follow */}
        <FollowAuthorMini
          userId={session?.user?.id as string}
          item={item?.author}
        />

        {/* like and count */}
        <CLikeBtn
          count={item?.likes as number}
          videoId={item?._id}
          userId={session?.user?.id as string}
        />

        {/*  comments */}
        <CommentButton
          count={commentsCount || 0}
          beforeIcon={MessageCircleMoreIcon}
          action={openCommentsDrawer}
        />

        {/* bookmark */}
        <BookmarkBtn userId={session?.user?.id as string} video={item} />

        {/* share/repost */}
        <TypeButton
          isDone={true}
          afterIcon={<Share className=" size-6 text-primary-custom" />}
          beforeIcon={<Share className=" size-6 text-muted-custom-text" />}
          text={"51.2K"}
        />
      </div>

      <VybeSyncDrawer
        width="min-w-[544px]"
        backgroundColor="bg-light-muted"
        title="Video details"
        opened={drawerOpen}
        closeDrawer={() => setDrawerOpen(false)}
      >
        <VideoProfileCommentCard
          width="w-full"
          item={item}
          userId={session?.user?.id as string}
        />
      </VybeSyncDrawer>

      {/* mobile */}
      <CDrawer
        opened={mobileDrawerOpen}
        closeDrawer={() => setMobileDrawerOpen(false)}
        title="Comments"
      >
        <CommentDrawer videoId={item?._id} />
      </CDrawer>
    </div>
  );
};

export default CVideoCard;
