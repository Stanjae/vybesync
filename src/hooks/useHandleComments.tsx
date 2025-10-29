"use client";
import { addVideoComments } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { addCommentType } from "@/lib/definitions";
import { getQueryClient } from "@/react-query-config/get-query-client";
import { useMutation } from "@tanstack/react-query";

const useHandleComments = () => {
  const queryClient = getQueryClient();

  const addComment = useMutation({
    mutationFn: async (payload: addCommentType) =>
      await addVideoComments(payload),
    onSettled: () => {
      // Replace optimistic todo in the todos list with the result
      queryClient.invalidateQueries({ queryKey: [Query_keys.VIDEO_COMMENTS] });
    },
  });

  return { addComment };
};

export default useHandleComments;
