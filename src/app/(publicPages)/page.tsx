import ProfileAvatar from "@/components/cui/avatars/ProfileAvatar";
import VideoLayout from "@/components/cui/VideoLayout";
import { getAuthSession } from "@/lib/actions";
import Link from "next/link";
import React, { Suspense } from "react";

const page = async () => {
  const session = await getAuthSession();
  return (
    <section className="relative bg-foreground text-background h-screen">
      {session?.user.id ? (
        <ProfileAvatar session={session} />
      ) : (
        <Link
          href={`/auth/sign-in`}
          className=" hidden md:block bg-primary-custom hover:bg-primary-custom/75 z-30 rounded-4xl px-7 fixed right-10 top-[30px] py-3"
        >
          Login
        </Link>
      )}

      <Suspense fallback={null}>
        <VideoLayout session={session} />
      </Suspense>
    </section>
  );
};

export default page;
