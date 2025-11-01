import ProfileVideoCard from "./ProfileVideoCard";
import { VideoType } from "@/types/definitions.types";

const ExploreLayout = ({
  exploreVideos,
}: {
  exploreVideos: Array<VideoType>;
}) => {
  return (
    <section className=" z-0 mt-24 p-5">
      <div className=" grid grid-cols-4 gap-3">
        {exploreVideos?.map((item) => (
          <div
            className=" col-span-4 sm:col-span-2 lg:col-span-1"
            key={item?._id}
          >
            <ProfileVideoCard isExplore={true} isAuthor item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreLayout;
