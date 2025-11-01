"use client";
import { addVideoComments } from "@/lib/actions";
import { Query_keys } from "@/lib/constants/services";
import { addCommentType } from "@/types/definitions.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useHandleComments = () => {
  const queryClient =  useQueryClient()

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
