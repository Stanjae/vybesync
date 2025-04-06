'use client'
import * as React from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"

export const categories = [
    {title:"All", value: 'all'}, {title:"Singing & Dancing", value: "singing_&_dancing"},
    {title:"Comedy", value: "comedy"},{title:"Sports", value: "sports"},{title:"Anime & Comics", value: "anime_&_comics"},
    {title:"Relationship", value: "relationship"},{title:"Shows", value: "shows"},{title:"Lipsync", value: "lipsync"},
    {title:"Daily Life", value: "daily_life"},{title:"Beauty Care", value:"beauty_care"}, {title:"Games", value:"games"},
    {title:"Society", value: "society"},{title:"Outfit", value: "outfit"}, {title:"Cars", value: "cars"},{title:"Food", value: "food"},
    {title:"Animals", value: "animals"}, {title:"Family", value: "family"}, {title:"Drama", value: "drama"},
    {title:"Fitness & Health", value: "fitness_&_health"}, {title:"Education",value:"education"},
     {title:"Technology", value: "technology"}
]

export function CategoryCarousel() {
    const carouselRef = React.useRef<HTMLDivElement>(null);

    const searchParams = useSearchParams();

    const scroll = (direction:string) => {
      if (carouselRef.current) {
        const { scrollLeft, clientWidth } = carouselRef?.current;
        const scrollAmount = clientWidth * 0.5;
        carouselRef.current.scrollTo({
          left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    };
  return (
    <section className=" py-3 max-w-[calc(100%-930px)] overflow-hidden w-full relative">
      <div className="relative flex items-center">
        <button onClick={() => scroll("left")} className="absolute left-0 bg-muted-custom p-1 rounded-full">
          <ChevronLeft className="text-white size-6" />
        </button>
        <div
          ref={carouselRef}
          className=" flex  items-center gap-3 overflow-x-hidden scroll-smooth px-10"
        >
          {categories.map((item, index) => (
            <Button asChild key={index} className={`${item.value?.includes(searchParams.get("category") as string) || (searchParams.get('category') == null && item.value == 'all') ? " text-gray-900 bg-lime-50":"bg-light-muted"} py-2  px-4 flex-shrink-0`}>
              <Link className={`${item.value?.includes(searchParams.get("category") as string) || (searchParams.get('category') == null && item.value == 'all' )? ' text-gray-900':'text-lime-50'}`} href={item.value == "all"?"/explore":`?category=${item.value}`}>{item.title}</Link>
            </Button>
          ))}
        </div>
        <button onClick={() => scroll("right")} className="absolute right-0 z-10 bg-muted-custom p-1 rounded-full">
          <ChevronRight className="text-white size-6" />
        </button>
      </div>
    </section>
    
  )
}
