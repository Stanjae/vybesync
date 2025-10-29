import { auth } from "@/auth";
import CLoader from "@/components/cui/Loaders/CLoader";
import DetailProVideo from "@/components/cui/DetailProVideo";
import { getVideoDetail } from "@/lib/actions";
import React, { Suspense } from "react";

const page = async ({
  params,
}: {
  params: Promise<{ vid: string; profile: string }>;
}) => {
  const session = await auth();
  const newParams = await params;
  const response = await getVideoDetail(newParams?.vid);

  return (
    <Suspense
      fallback={
        <div className=" flex justify-center bg-transparent p-5 items-center w-full">
          <CLoader />
        </div>
      }
    >
      <DetailProVideo userId={session?.user?.id as string} item={response} />
    </Suspense>
  );
};

export default page;
