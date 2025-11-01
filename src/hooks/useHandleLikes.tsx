"use client";
import { getVideoLikeStatus, handleLikes } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type LikesProps = {
    videoId: string;
    userId: string;
}

const useHandleLikes = (userId: string, videoId: string) => {
  const queryClient = useQueryClient();
  const isLiked = useQuery({
    queryKey: [Query_keys.GET_LIKE_STATUS, userId, videoId],
    queryFn: async () => await getVideoLikeStatus(videoId, userId),
  });

  const handleLike = useMutation({
    mutationFn: async (payload: LikesProps) => await handleLikes(payload.videoId, payload.userId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [Query_keys.GET_LIKE_STATUS, Query_keys.HOME_VIDEOS],
      });
         queryClient.invalidateQueries({
           queryKey: [Query_keys.HOME_VIDEOS],
         });
    },
  });
  return { isLiked, handleLike };
};

export default useHandleLikes;
