import { CategoryCarousel } from "@/components/cui/CategoryCarousel";
import CLoader from "@/components/cui/Loaders/CLoader";
import ExploreLayout from "@/components/cui/ExploreLayout";
import { getExploreVideos } from "@/lib/actions";
import React, { Suspense } from "react";
import { SearchParams } from "@/types/definitions.types";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchP = await searchParams;
  const newSort = searchP?.category;
  const response = await getExploreVideos(newSort as string);
  return (
    <div
      id="explorePage"
      className=" h-dvh overflow-y-scroll! bg-foreground space-y-3 w-full relative"
    >
      <div className=" bg-foreground pt-5 fixed top-0 z-10">
        <h1 className="text-xl font-bold">You may like</h1>
        <CategoryCarousel />
      </div>

      <Suspense
        fallback={
          <div className=" flex justify-center items-center">
            <CLoader />
          </div>
        }
      >
        <ExploreLayout exploreVideos={response} />
      </Suspense>
    </div>
  );
};

export default page;
