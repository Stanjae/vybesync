'use client';
import { getVideoCommentsCount } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { useQuery } from "@tanstack/react-query";

const useGetVideoCommentCount = (videoId: string) => {
    return useQuery({
        queryKey: [Query_keys.VIDEO_COMMENTS_COUNT, videoId],
        queryFn: async () => await getVideoCommentsCount(videoId)
    })
}

export default useGetVideoCommentCount