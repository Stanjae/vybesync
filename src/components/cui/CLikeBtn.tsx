"use client";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import millify from "millify";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import useHandleLikes from "@/hooks/useHandleLikes";

const CLikeBtn = ({
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
      console.log('yuri:',err);
    }
  };

  return (
    <div className=" space-y-1">
      <Button
        onClick={handleLikeAction}
        className=" rounded-full p-5 bg-muted-custom "
        size={"icon"}
      >
        {status ? (
          <Heart fill="#ea284e" className=" size-6 text-primary-custom" />
        ) : (
          <Heart className=" size-6 text-muted-custom-text" />
        )}
      </Button>
      <div className=" text-sm font-bold text-center text-background/85">
        {isLiked.isLoading ? (
          <Skeleton className=" bg-muted-custom  w-[40px] h-5" />
        ) : (
          millify((likeCount as number) || 0)
        )}
      </div>
    </div>
  );
};

export default CLikeBtn;
