import CLoader from "@/components/cui/Loaders/CLoader";
import FollowBtn from "@/components/cui/FollowBtn";
import ProfileFollowCount from "@/components/cui/ProfileFollowCount";
import ProfileTabsLayout from "@/components/cui/ProfileTabsLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthSession, getProfile } from "@/lib/actions";
import { ProfileType, SearchParams } from "@/types/definitions.types";
import { BadgeCheck, MoreHorizontal, Settings, Share } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { resolveParams } from "@/lib/helpers/helperActions";

const page = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ profile: string }>;
}) => {
  const { profile } = await params;
  const searchP = await searchParams;
  const newSort = searchP?.sort;

  const session = await getAuthSession();
  const response: ProfileType = await getProfile(resolveParams(profile));

  const imageUrl = response?.image
  return (
    <section className=" bg-foreground px-6 space-y-8 py-8">
      <div className=" flex-col md:flex-row flex gap-3 items-center">
        <Image
          alt={response?.name}
          width={212}
          height={212}
          className=" max-w-full h-auto w-[175px] md:w-[212px] rounded-full"
          src={imageUrl as string}
        />
        <div className=" grow space-y-2.5">
          <div className=" flex md:justify-normal justify-center items-center gap-2">
            <h1 className=" text-background text-xl sm:text-2xl font-bold">
              {response?.name}
            </h1>
            <BadgeCheck className=" text-badge-custom" />
            <h2 className=" hidden sm:block text-lg text-background/75">
              @{response?.name}
            </h2>
          </div>

          {session?.user?.id == response?._id ? (
            <div className=" flex  md:justify-normal justify-center gap-3 items-center">
              <Button size={"lg"} className=" bg-primary-custom">
                Edit Profile
              </Button>
              <Button size={"icon"} className=" bg-muted-custom">
                <Settings />
              </Button>
              <Button size={"icon"} className=" bg-muted-custom">
                <Share />
              </Button>
            </div>
          ) : (
            <div className=" flex  md:justify-normal justify-center gap-3 items-center">
              <FollowBtn
                celebrityId={response?._id}
                userId={session?.user?.id as string}
              />
              <Button size={"lg"} className=" bg-muted-custom">
                Message
              </Button>
              <Button size={"icon"} className=" bg-muted-custom">
                <Share />
              </Button>
              <Button size={"icon"} className=" bg-muted-custom">
                <MoreHorizontal />
              </Button>
            </div>
          )}

          <Suspense
            fallback={<Skeleton className=" bg-muted-custom w-20 h-5" />}
          >
            <ProfileFollowCount celebrityId={response?._id} />
          </Suspense>

          <h2 className=" md:text-left text-center leading-[21px] text-base text-background/90 font-medium">
            {response?.bio}
          </h2>
        </div>
      </div>

      {/* Profile tabs */}
      <Suspense
        key={response?._id}
        fallback={
          <div className=" flex justify-center items-center w-full">
            <CLoader />
          </div>
        }
      >
        <ProfileTabsLayout
          userId={session?.user?.id as string}
          sort={newSort}
          celebrityId={response?._id}
        />
      </Suspense>
    </section>
  );
};

export default page;
