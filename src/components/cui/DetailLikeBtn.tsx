"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import millify from "millify";
import { Heart } from "lucide-react";
import useHandleLikes from "@/hooks/useHandleLikes";
import { toast } from "sonner";

const DetailLikeBtn = ({
  videoId,
  userId,
  count,
}: {
  videoId: string;
  userId: string;
  count: number;
}) => {
  const { handleLike, isLiked } = useHandleLikes(userId, videoId);
  const [likeCount, setLikeCount] = useState<number>(count);
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    setStatus(isLiked.data);
  }, [isLiked.data]);

  const handleLikeAction = async () => {
    try {
        if (!userId) {
          toast.warning("You must be logged in!");
          return;
        }
      if (status) {
        setStatus(false);
        setLikeCount(likeCount - 1);
      } else {
        setStatus(true);
        setLikeCount(likeCount + 1);
      }
      await handleLike.mutateAsync({ videoId, userId });
    } catch (err) {
      setLikeCount(count);
      setStatus(isLiked.data);
      console.log("yuri:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleLikeAction}
        className=" rounded-full p-4 bg-muted-custom"
        size={"icon"}
      >
        {isLiked ? (
          <Heart className=" size-5 text-primary-custom" />
        ) : (
          <Heart className=" size-5 text-muted-custom-text" />
        )}
      </Button>
      <div className=" text-sm font-bold text-center text-background/85">
        {!isLiked.isLoading ? (
          millify(likeCount || 0)
        ) : (
          <Skeleton className=" bg-muted-custom  w-[40px] h-5" />
        )}
      </div>
    </div>
  );
};

export default DetailLikeBtn;
