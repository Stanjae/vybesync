"use client";
import React, { useEffect, useState } from "react";
import CVideoCard from "./CVideoCard";
import { useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import useGetHomeVids from "@/hooks/useGetHomeVids";
import CLoader from "./Loaders/CLoader";
import { TSessionType } from "@/types/auth.types";

const VideoLayout = ({ session }: { session: TSessionType | null }) => {
  const { data: response, isLoading } = useGetHomeVids();

  const [videoId, setVideoId] = useState<string>("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [expanded, setExpanded] = useState(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    if (!response || response.length === 0) return;
    setVideoId(response[0]?._id);
  }, [response]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setExpanded(latest);
    const newIndex = Math.round(latest / 776);
    setVideoId(response ? response[newIndex]?._id : "");
    setCurrentIndex(newIndex);
  });

  const scrollToVideo = (index: number) => {
    const responseLength = response ? response.length : 0;
    if (index < 0 || index >= responseLength) return; // Prevent going out of range
    setCurrentIndex(index);
    setVideoId(response ? response[index]?._id : "");

    const videoElement = document.getElementById(`video-${index}`);
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className=" flex justify-center items-center h-screen">
        <CLoader />
      </div>
    );
  }

  return (
    <div className=" bg-foreground text-background relative h-full w-full">
      {response?.map((item, index) => (
        <CVideoCard
          session={session}
          videoId={videoId}
          id={index}
          item={item}
          key={item?._id}
        />
      ))}

      <div className=" hidden md:block z-30 fixed space-y-3 top-1/2 -translate-y-1/2 right-5">
        <Button
          disabled={expanded == 0}
          onClick={() => scrollToVideo(currentIndex - 1)}
          className=" cursor-pointer flex rounded-full justify-center items-center p-7"
          size={"icon"}
        >
          <ChevronUp className=" size-8" />
        </Button>
        <Button
          onClick={() => scrollToVideo(currentIndex + 1)}
          className=" cursor-pointer  flex rounded-full justify-center items-center p-7"
          size={"icon"}
          disabled={currentIndex === (response ? response.length - 1 : 0)}
        >
          <ChevronDown className=" size-8" />
        </Button>
      </div>
    </div>
  );
};

export default VideoLayout;
