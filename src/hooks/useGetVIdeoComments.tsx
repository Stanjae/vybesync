"use client";
import { getVideoComments } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { useQuery } from "@tanstack/react-query";

export const useGetVideoComments = (videoId: string | undefined) => {
    return useQuery({
        queryKey: [Query_keys.VIDEO_COMMENTS, videoId],
        queryFn: async () => await getVideoComments(videoId as string)
    })
}