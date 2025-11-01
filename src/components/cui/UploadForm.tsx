"use client";
import { CreateVideoType, VideoResponse } from "@/types/definitions.types";
import React from "react";
import { Button } from "../ui/button";
import { CheckCircle, Loader2, RefreshCcw } from "lucide-react";
import { Badge } from "../ui/badge";
import millify from "millify";
import { getVideoQuality } from "@/lib/hooks";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import Image from "next/image";
import CosVideoPlayer from "./CosVideoPlayer";
import "next-cloudinary/dist/cld-video-player.css";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { categories } from "./CategoryCarousel";
import { createPost } from "@/lib/actions";
import { toast } from "sonner";
import { TSessionType } from "@/types/auth.types";

const visible = [
  { title: "Everyone", value: "everyone" },
  { title: "Private", value: "private" },
];
const UploadForm = ({
  videoUrl,
  session,
  handleDiscard,
  handleSuccess,
}: {
  handleSuccess: () => void;
  videoUrl: VideoResponse | null | undefined;
  session: TSessionType | null;
  handleDiscard: () => void;
}) => {
  const bytes = millify(videoUrl?.bytes as number, {
    units: ["B", "KB", "MB", "GB", "TB"],
    space: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<CreateVideoType>({
    resolver: zodResolver(formSchema),
    defaultValues: { visibility: "everyone" },
  });

  const content = watch("description"); // Watch field value

  const addHashtag = () => {
    setValue("description", content + "#", { shouldValidate: true });
  };

  const onSubmit = async (data: CreateVideoType) => {
    const response = await createPost(data);
    if (response.status === 200) {
      toast.success(response.message);
      handleSuccess();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <main className=" bg-[#F8F8F8] space-y-8">
      <section className="flex border-b-4 px-5 py-7 rounded-xl border-b-green-500 bg-background justify-between">
        <div className=" space-y-2">
          <div className=" flex gap-4 items-center">
            <h1 className=" font-bold text-lg">
              {videoUrl?.display_name}.{videoUrl?.format}
            </h1>
            <Badge>
              {getVideoQuality(
                videoUrl?.width as number,
                videoUrl?.height as number
              )}
            </Badge>
          </div>
          <div className=" flex items-center gap-2 text-sm text-green-600">
            <CheckCircle />
            Uploaded {bytes}
          </div>
        </div>
        <Button className=" cursor-not-allowed bg-[#F8F8F8] hover:bg-gray-200 text-muted-custom">
          Replace <RefreshCcw />
        </Button>
      </section>

      <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex gap-5">
          <main className=" grow relative space-y-8">
            <section>
              <input
                value={videoUrl?.public_id}
                {...register("publicId")}
                hidden
              />
              <input value={session?.user?.id} {...register("userId")} hidden />
              <h2 className=" font-bold text-lg">Details</h2>
              <div className=" bg-background space-y-5 rounded-md p-6">
                <section className=" relative space-y-2">
                  <Label htmlFor="terms">Caption</Label>
                  <Input
                    placeholder="Enter your Caption"
                    {...register("caption")}
                    className=" border-none focus-visible:ring-0 focus-visible:border-none bg-[#f8f8f8]"
                  />
                  {errors.caption && (
                    <span className=" text-xs text-primary-custom">
                      {errors.caption.message}
                    </span>
                  )}
                </section>
                <section className=" relative space-y-2">
                  <Label htmlFor="terms">Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter your Description"
                    className=" h-40 border-none focus-visible:ring-0 focus-visible:border-none bg-[#f8f8f8]"
                  />
                  <div className=" absolute left-0 bottom-0">
                    <Button
                      type="button"
                      onClick={addHashtag}
                      className=" text-gray-400 cursor-pointer"
                      variant={"link"}
                    >
                      #Hashtags
                    </Button>
                  </div>
                  {errors.description && (
                    <span className=" text-xs text-primary-custom">
                      {errors.description.message}
                    </span>
                  )}
                </section>

                <section className=" relative space-y-2">
                  <input
                    value={`https://res.cloudinary.com/dn5rlehel/video/upload/c_limit,h_500,w_500/v1742151494/${videoUrl?.public_id}.jpg`}
                    {...register("coverImage")}
                    hidden
                  />
                  <Label htmlFor="terms">Cover</Label>
                  <Image
                    className=" h-[176px] w-[132px] object-cover rounded-md"
                    src={`https://res.cloudinary.com/dn5rlehel/video/upload/c_limit,h_500,w_500/v1742151494/${videoUrl?.public_id}.jpg`}
                    alt=""
                    width={132}
                    height={176}
                  />
                </section>

                <section className=" relative space-y-2">
                  <Label htmlFor="terms">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category, index) => (
                            <SelectItem key={index} value={category.value}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <span className=" text-xs text-primary-custom">
                      {errors.category.message}
                    </span>
                  )}
                </section>
                {/* w-264 h-571 */}
              </div>
            </section>

            <section className=" space-y-3">
              <h2 className=" font-bold text-lg">Settings</h2>
              <div className=" bg-background  space-y-5 rounded-md p-6">
                <section className=" relative space-y-2">
                  <Label htmlFor="terms">Who can watch this video</Label>
                  <Controller
                    name="visibility"
                    control={control}
                    render={({ field }) => (
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select a visibility status" />
                        </SelectTrigger>
                        <SelectContent>
                          {visible.map((category, index) => (
                            <SelectItem key={index} value={category.value}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </section>
              </div>
            </section>

            <section className=" flex gap-4">
              <Button
                disabled={!isDirty || !isValid}
                size={"lg"}
                className=" bg-primary-custom w-52"
                type="submit"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                Post
              </Button>
              <Button
                onClick={handleDiscard}
                size={"lg"}
                className=" bg-[#DFDEDE] text-foreground w-52"
                type="button"
              >
                Discard
              </Button>
            </section>
          </main>

          <section className=" w-[270px]">
            <div>
              <CosVideoPlayer
                id={videoUrl?.api_key}
                logo={false}
                height={571}
                width={264}
                muted
                className=" h-[571px] rounded-xl!"
                src={videoUrl?.public_id as string}
                transformation={{
                  color: "white",
                  gravity: "center",
                  opacity: 80,
                }}
              />
            </div>
          </section>
        </div>
      </form>
    </main>
  );
};

export default UploadForm;
