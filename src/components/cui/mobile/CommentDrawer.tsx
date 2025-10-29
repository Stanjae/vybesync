"use client";
import * as React from "react";
import { useCounterStore } from "@/providers/zustand-store";
import { nanoid } from "nanoid";
import { CComentCard, DelayComentCard } from "../CComentCard";
import CommentInput from "../CommentInput";
import { useGetVideoComments } from "@/hooks/useGetVIdeoComments";
import useHandleComments from "@/hooks/useHandleComments";
import { VybeSyncLoader } from "../Loaders/VybeSyncLoader";

export function CommentDrawer({ videoId }: { videoId: string }) {
  const { isSuccess, data, isLoading } = useGetVideoComments(videoId);

  const { session } = useCounterStore((state) => state);

  const {
    addComment: { mutateAsync, variables, isPending },
  } = useHandleComments();

  const addComment = async (text: string) => {
    await mutateAsync({
      comment_text: text,
      videoId,
      userId: session?.id as string,
      name: session?.name,
      id: nanoid(),
    });
  };

  return (
    <section>
      <div className="pb-0">
        <section className=" overflow-y-auto h-72 space-y-2 px-3">
          {isLoading && (
            <div className="h-72 flex justify-center items-center">
              <VybeSyncLoader />
            </div>
          )}
          {isPending && <DelayComentCard item={variables} />}
          {isSuccess &&
            data?.map((item, index) => (
              <CComentCard
                userId={session?.id as string}
                item={item}
                key={index}
              />
            ))}
        </section>
      </div>
      <div className=" border-t border-t-muted-custom py-3 px-5">
        <CommentInput
          isPending={isPending}
          addComment={addComment}
          placeholder="Add Comment.."
        />
      </div>
    </section>
  );
}
