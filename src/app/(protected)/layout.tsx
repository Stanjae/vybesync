import React from "react";
import USideBar from "@/components/cui/USideBar";
import { auth } from "@/auth";
import Image from "next/image";
export default async function PrivatePagesLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const session = await auth()
    return (
      <main className=" bg-[#F8F8F8] text-foreground h-dvh">
        <section className=" h-full flex">
            <div className=" fixed top-0 left-0 h-full border-r border-b-[#E7E6E6] z-10 w-[250px]"><USideBar/></div>
            <div className=" custom-scroll bg-[#F8F8F8] relative ml-[250px] grow ">
                <div className=" bg-[#F8F8F8] w-full z-50 max-w-[calc(100%-250px)] border-b border-b-[#E7E6E6] fixed p-4 flex justify-end">
                    <Image className=" rounded-full" src={session?.user?.image as string} width={36} height={36} alt={session?.user?.name as string}/>
                </div>
                <div className=" bg-[#f8f8f8] mt-[68px] p-4">
                   {children} 
                </div> 
            </div>
        </section>
      </main>
    );
  }