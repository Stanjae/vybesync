"use client";
import * as React from "react";
import { useCounterStore } from "@/providers/zustand-store";
import { nanoid } from "nanoid";
import { CComentCard, DelayComentCard } from "../CComentCard";
import CommentInput from "../CommentInput";
import { useGetVideoComments } from "@/hooks/useGetVIdeoComments";
import useHandleComments from "@/hooks/useHandleComments";
import { VybeSyncLoader } from "../Loaders/VybeSyncLoader";
import Link from "next/link";

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
    <main className=" flex flex-col h-full">
        <section className=" h-[calc(100vh-475px)] overflow-y-auto  space-y-2 px-3 pb-2">
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
      <div className=" border-t border-t-muted-custom py-3 px-5">
        {session?.id ?(
        <CommentInput
          isPending={isPending}
          addComment={addComment}
          placeholder="Add Comment.."
        />):(
            <p className="text-sm text-center text-muted-custom-text">
              Please{" "}
              <Link className="!text-primary-custom" href={"/auth/sign-in"}>
                sign in
              </Link>{" "}
              to add a comment.
            </p>
          )}
      </div>
    </main>
  );
}
