"use client";
import React, { useRef } from "react";
import { Modal, ModalBody, ModalTrigger } from "../ui/animated-modal";
import { VideoType } from "@/lib/definitions";
import { CldVideoPlayer } from "next-cloudinary";
import DetailedSearchInput from "./DetailedSearchInput";
import { updateViewCount } from "@/lib/actions";
import VideoProfileCommentCard from "./cards/VideoProfileCommentCard";

export function CVideoModal({
  triggerBtn,
  item,
  userId,
}: {
  userId: string;
  item: VideoType;
  triggerBtn: React.ReactNode;
}) {
  const vidref = useRef<HTMLVideoElement | null>(null);

  return (
    <Modal>
      <ModalTrigger className=" my-0 p-0">{triggerBtn}</ModalTrigger>
      <ModalBody className=" z-[9999] p-0 flex flex-row rounded-none hunt">
        <div className=" flex bg-foreground justify-center grow">
          <section id="videomodal" className=" relative w-[419px]">
            <div className=" px-5 w-full z-50 absolute top-5">
              <DetailedSearchInput />
            </div>

            <CldVideoPlayer
              videoRef={vidref}
              className=" h-screen! z-30 rounded-2xl"
              width="419"
              height="744"
              logo={false}
              controls={true}
              onEnded={() => updateViewCount(item?._id)}
              src={item?.videoUrl}
              transformation={{
                color: "white",
                gravity: "center",
                opacity: 80,
              }}
            />
          </section>
          <VideoProfileCommentCard item={item} userId={userId} />
        </div>
      </ModalBody>
    </Modal>
  );
}
