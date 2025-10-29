"use client";
import { getVideos } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { useQuery } from "@tanstack/react-query";

const useGetHomeVids = () => {
  return useQuery({
    queryKey: [Query_keys.HOME_VIDEOS],
    queryFn: async () => await getVideos(),
  });
};

export default useGetHomeVids;
