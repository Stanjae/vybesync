"use client";
import React, { useState } from "react";
import SearchVideoCard from "./SearchVideoCard";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import Link from "next/link";
import millify from "millify";
import { Button } from "../ui/button";
import { ProfileType, VideoType } from "@/types/definitions.types";

const SearchLayout = ({
  videos,
  users,
}: {
  videos: Array<VideoType>;
  users: Array<ProfileType>;
}) => {
  const [tabs, setTabs] = useState(0);

  const tabnavs = ["Top", "Users"];
  return (
    <section className=" relative">
      <div className=" bg-muted-custom w-full flex gap-2 z-20 max-w-[calc(100%-683px)] fixed pt-2 px-2">
        {tabnavs.map((item, index) => (
          <div
            className={`${tabs == index ? " border-b-muted-custom-text" : "border-b-transparent"} transition-all px-3 duration-300 hover:border-b-muted-custom-text text-lg border-b-4`}
            onClick={() => setTabs(index)}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>

      <section className=" relative top-16">
        {tabs == 0 && (
          <section>
            <div className=" grid grid-cols-3 gap-4">
              {videos?.slice(0, 12)?.map((video, index) => (
                <div className="  col-span-1" key={index}>
                  <SearchVideoCard isAuthor isTitle item={video} />
                </div>
              ))}
            </div>

            <div className=" mt-10">
              <p className=" text-lg text-background font-semibold">Users</p>

              <ul className=" space-y-2.5">
                {users?.slice(0, 3)?.map((item, index) => (
                  <li
                    className=" flex p-2 rounded-md items-center gap-2 hover:bg-muted-custom"
                    key={index}
                  >
                    <Image
                      className=" rounded-full"
                      width={60}
                      height={60}
                      src={urlFor(item?.profile_image)?.url() as string}
                      alt={item?._id}
                    />
                    <div className=" space-y-1">
                      <Link
                        className=" text-background text-lg font-medium"
                        href={`/@${item?.name}`}
                      >
                        {item?.fullname}
                      </Link>
                      <div className=" text-muted-custom-text flex gap-1 items-center">
                        <span>{item?.name}</span> .{" "}
                        <span>
                          {millify(item?.followers as number)} followers
                        </span>
                      </div>
                      <p className=" text-sm text-background/75">{item?.bio}</p>
                    </div>
                    <Button
                      size={"lg"}
                      className=" ml-auto bg-primary-custom rounded-md"
                    >
                      Follow
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {tabs == 1 && (
          <section>
            <div className="">
              <p className=" text-lg text-background font-semibold">Users</p>

              <ul className=" space-y-2.5">
                {users?.map((item, index) => (
                  <li
                    className=" flex p-2 rounded-md items-center gap-2 hover:bg-muted-custom"
                    key={index}
                  >
                    <Image
                      className=" rounded-full"
                      width={60}
                      height={60}
                      src={urlFor(item?.profile_image)?.url() as string}
                      alt={item?._id}
                    />
                    <div className=" space-y-1">
                      <Link
                        className=" text-background text-lg font-medium"
                        href={`/@${item?.name}`}
                      >
                        {item?.fullname}
                      </Link>
                      <div className=" text-muted-custom-text flex gap-1 items-center">
                        <span>{item?.name}</span> .{" "}
                        <span>
                          {millify(item?.followers as number)} followers
                        </span>
                      </div>
                      <p className=" text-sm text-background/75">{item?.bio}</p>
                    </div>
                    <Button
                      size={"lg"}
                      className=" ml-auto bg-primary-custom rounded-md"
                    >
                      Follow
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </section>
    </section>
  );
};

export default SearchLayout;
