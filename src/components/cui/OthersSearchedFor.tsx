import { fetchSearches } from "@/lib/actions";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const OthersSearchedFor = async ({ query }: { query: string }) => {
  const searches: Array<{ title: string }> = await fetchSearches(query);
  return (
    <div className=" space-y-2">
      <h6 className=" text-sm font-medium text-muted-custom-text">
        Others Searched For
      </h6>

      <ul className=" space-y-2">
        {searches?.map((item, index) => (
          <Link
            key={index}
            className="block hover:bg-muted-custom p-1 rounded-md"
            href={`search?query=${item?.title.toLowerCase()}`}
          >
            <li className=" flex items-center gap-2 text-base font-bold">
              <Search className=" size-4 text-muted-custom-text" />
              <span>{item?.title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default OthersSearchedFor;
