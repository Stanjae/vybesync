"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo1 from "../../../public/veslogo1.png";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import {
  Compass,
  Home,
  MessageSquareText,
  MoreHorizontal,
  Search,
  SquarePlus,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import mobileLogo from "../../../public/veslogo23.png";
import SearchInput from "./SearchInput";
import { AlertDialogDemo } from "./AlertDialog";
import Link from "next/link";
import { useCounterStore } from "@/providers/zustand-store";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { NotificationType } from "@/types/definitions.types";
import { TSessionType } from "@/types/auth.types";

const navigation = [
  { title: "For You", href: "/", icon: <Home className=" size-7" /> },
  { title: "Explore", href: "/explore", icon: <Compass className=" size-7" /> },
  {
    title: "Following",
    href: "/following",
    icon: <UserRoundCheck className=" size-7" />,
  },
  { title: "Friends", href: "/friends", icon: <Users className=" size-7" /> },
  {
    title: "Upload",
    href: "/upload",
    icon: <SquarePlus className=" size-7" />,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: <MessageSquareText className=" size-7" />,
  },
];
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});
const CSidebar = ({ session }: { session: TSessionType | null }) => {
  const { setSession, deleteSession, fetchBookmarked } = useCounterStore(
    (state) => state
  );

  useEffect(() => {
    if (session?.user) {
      setSession(session?.user);
      fetchBookmarked(session?.user?.id as string);
    } else {
      deleteSession();
    }
  }, [session?.user]);

  useEffect(() => {
    if (!session?.user) return;

    const channel = pusher.subscribe(`notifications-${session?.user?.id}`);
    channel.bind("new-notification", (data: NotificationType) => {
      toast.custom((t) => (
        <section className="flex gap-3 border rounded-lg p-3 bg-muted-custom border-muted-custom-text">
          <div className=" flex items-center gap-2">
            <Image
              className="rounded-full w-7 h-7"
              width={100}
              height={100}
              src={data?.image}
              alt={data?.name}
            />
            <div className="grow">
              <p className=" text-amber-50">
                {data?.name}{" "}
                {data?.type == "follow"
                  ? "Followed You 🔔"
                  : data?.type == "comment"
                    ? "Commented on your Post 💬"
                    : "Liked your Post 💖"}
              </p>
            </div>
          </div>
          <Button
            className="ml-auto"
            size={"icon"}
            onClick={() => toast.dismiss(t)}
          >
            <X />
          </Button>
        </section>
      ));
    });

    return () => {
      pusher.unsubscribe(`notifications-${session?.user?.id}`);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const [active, setActive] = useState("");

  const pathname = usePathname();

  const toogleNavs = (url: string) => {
    setIsOpen((prev) => !prev);
    setActive((prev) => (prev.length == 0 ? url : ""));
  };

  const list = {
    visible: { width: "100%" },
    hidden: {
      width: "75px",
      overflow: "hidden",
      borderRight: "1px solid #1F1F1F",
      paddingRight: "0px",
    },
  };

  const small = {
    visible: { x: "80px", opacity: 1 },
    hidden: { x: "0px", opacity: 0 },
  };

  /* const transition = {
        duration: 1,
        ease: [0, 0.71, 0.2, 1.01],

      }
 */
  const transition11 = { duration: 0, bounce: 0 };
  return (
    <section className=" z-50 bg-foreground text-background relative h-screen w-full">
      <motion.div
        initial={false}
        layout
        transition={transition11}
        variants={list}
        animate={!isOpen ? "visible" : "hidden"}
        className=" h-full space-y-4 pl-5  bg-foreground py-5 z-40"
      >
        {isOpen ? (
          <Image
            width={32}
            className=" h-[60px]"
            height={60}
            alt="logo"
            src={mobileLogo}
          />
        ) : (
          <Image
            className=" h-[60px]"
            src={Logo1}
            width={120}
            height={60}
            alt="pol"
          />
        )}

        <div>
          {isOpen ? (
            <Button
              size={"icon"}
              onClick={() => toogleNavs("search")}
              className=" bg-muted-custom items-center rounded-full"
            >
              <Search className=" size-7" />
            </Button>
          ) : (
            <Button
              size={"lg"}
              onClick={() => toogleNavs("search")}
              className=" bg-muted-custom flex w-full text-sm tracking-tight  justify-start items-center rounded-full"
            >
              <Search className="size-7" />{" "}
              <span className=" text-center text-muted-custom-text">
                Search
              </span>
            </Button>
          )}
        </div>

        <ul className=" space-y-3">
          {navigation.map((item, index) =>
            item.href == "/upload" || item.href == "/activity" ? (
              <Link href={`${item.href}`} className=" block" key={index}>
                <Button
                  onClick={() => setActive(item.title)}
                  size={isOpen ? "icon" : "lg"}
                  className={` ${item.href == pathname ? "text-primary-custom" : ""}  
                        ${isOpen ? " rounded-full" : " flex w-full gap-4 justify-start"} bg-foreground hover:bg-muted-custom  items-center `}
                >
                  {item.icon}
                  {!isOpen && (
                    <span className=" leading-5 text-lg font-semibold">
                      {item.title}
                    </span>
                  )}
                </Button>
              </Link>
            ) : (
              <a href={`${item.href}`} className=" block" key={index}>
                <Button
                  onClick={() => setActive(item.title)}
                  size={isOpen ? "icon" : "lg"}
                  className={` ${item.href == pathname ? "text-primary-custom" : ""}  
                        ${isOpen ? " rounded-full" : " flex w-full gap-4 justify-start"} bg-foreground hover:bg-muted-custom  items-center `}
                >
                  {item.icon}
                  {!isOpen && (
                    <span className=" leading-5 text-lg font-semibold">
                      {item.title}
                    </span>
                  )}
                </Button>
              </a>
            )
          )}
          <Button
            onClick={() => toogleNavs("more")}
            size={isOpen ? "icon" : "lg"}
            className={` ${active == "more" ? "text-primary-custom" : ""}  
                        ${isOpen ? " rounded-full" : " flex w-full gap-4 justify-start"} bg-foreground hover:bg-muted-custom  items-center `}
          >
            <MoreHorizontal className=" size-7" />
            {!isOpen && (
              <span className=" leading-5 text-lg font-semibold">{"More"}</span>
            )}
          </Button>

          {session?.user && (
            <a href={`/@${session?.user?.name}`} className=" block">
              <Button
                size={isOpen ? "icon" : "lg"}
                className={` ${pathname.includes(session?.user?.name as string) ? "text-primary-custom" : ""}  
                        ${isOpen ? " rounded-full" : " flex w-full gap-4 justify-start"} bg-foreground hover:bg-muted-custom  items-center `}
              >
                <Image
                  width={30}
                  height={30}
                  className="rounded-full"
                  src={session?.user?.image as string}
                  alt={session?.user?.id as string}
                />
                {!isOpen && (
                  <span className=" leading-5 text-lg font-semibold">
                    Profile
                  </span>
                )}
              </Button>
            </a>
          )}
        </ul>
      </motion.div>

      <motion.div
        variants={small}
        transition={transition11}
        initial={false}
        animate={isOpen ? "visible" : "hidden"}
        className=" -z-10 w-[320px] space-y-8 bg-foreground h-full py-5 px-3 left-0 absolute top-0"
      >
        <div className=" flex mt-1 justify-between items-center">
          <h1
            className={
              !isOpen ? "" : " text-xl whitespace-nowrap overflow-hidden"
            }
          >
            {active == "more" ? "More" : "Search"}
          </h1>
          <Button
            onClick={() => {
              setIsOpen(false);
              setActive("");
            }}
            size={"icon"}
          >
            <X />
          </Button>
        </div>

        {active == "search" ? (
          <SearchInput />
        ) : (
          <div>
            {session?.user && (
              <AlertDialogDemo
                trigger={
                  <Button className=" hover:bg-primary-custom/5 text-primary-custom font-semibold block w-full">
                    Logout
                  </Button>
                }
                description="This action cannot be undone. This will log you out of your account"
              />
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default CSidebar;
