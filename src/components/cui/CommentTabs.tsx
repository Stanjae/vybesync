"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CComentCard, DelayComentCard } from "./CComentCard";
import { ScrollArea } from "../ui/scroll-area";
import CommentInput from "./CommentInput";
import { nanoid } from "nanoid";
import { useCounterStore } from "@/providers/zustand-store";
import { useGetVideoComments } from "@/hooks/useGetVIdeoComments";
import useHandleComments from "@/hooks/useHandleComments";
import { VybeSyncLoader } from "./Loaders/VybeSyncLoader";
import Link from "next/link";

export function CommentTabs({
  userId,
  videoId,
}: {
  userId: string | undefined;
  videoId: string | undefined;
}) {
  const [tabs, setTabs] = useState("comments");

  const { isSuccess, data, isLoading } = useGetVideoComments(videoId);

  const { session } = useCounterStore((state) => state);

  const { addComment } = useHandleComments();

  const addCommentAction = async (text: string) => {
    await addComment.mutateAsync({
      comment_text: text,
      videoId,
      userId,
      name: session?.name,
      id: nanoid(),
    });
  };

  return (
    <Tabs
      value={tabs}
      onValueChange={(e) => {
        setTabs(e);
      }}
      className="flex flex-col"
      style={{ height: "calc(100vh - 400px)", minHeight: "425px" }}
    >
      <TabsList className="grid px-5 border-b border-b-muted-custom rounded-none bg-light-muted text-background w-full grid-cols-2">
        <TabsTrigger
          className={`${tabs == "comments" ? "bg-light-muted! border-b-background " : ""} text-background border-b-2 rounded-none`}
          value="comments"
        >
          Comments ({data?.length})
        </TabsTrigger>
        <TabsTrigger
          className={`${tabs == "creator" ? "bg-light-muted! border-b-background " : ""} text-background border-b-2 rounded-none`}
          value="creator"
        >
          Creator Videos
        </TabsTrigger>
      </TabsList>

      <TabsContent
        className="flex-1 relative m-0 overflow-hidden"
        value="comments"
      >
        {/* Scrollable Content */}
        <div className="absolute inset-0 pb-20 overflow-hidden">
          <ScrollArea className="h-full scrollarea-custom px-5">
            {isLoading && (
              <div className="h-72 flex justify-center items-center">
                <VybeSyncLoader />
              </div>
            )}
            {addComment.isPending && (
              <DelayComentCard item={addComment.variables} />
            )}
            {isSuccess &&
              data?.map((item, index) => (
                <CComentCard userId={userId} item={item} key={index} />
              ))}
          </ScrollArea>
        </div>

        {/* Fixed Bottom Form */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-t-muted-custom py-3 px-5 bg-light-muted">
          {session?.id ? (
            <CommentInput
              isPending={addComment.isPending}
              addComment={addCommentAction}
              placeholder="Add Comment.."
            />
          ) : (
            <p className="text-sm text-center text-muted-custom-text">
              Please{" "}
              <Link className="!text-primary-custom" href={"/auth/sign-in"}>
                sign in
              </Link>{" "}
              to add a comment.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent className="flex-1 m-0" value="creator">
        <div className="h-full flex items-center justify-center text-muted-custom-text">
          Creator videos coming soon...
        </div>
      </TabsContent>
    </Tabs>
  );
}
