"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import React from "react";

type Props = {
  opened: boolean;
  closeDrawer: () => void;
  title: string;
  children: React.ReactNode;
  side?: "left" | "right";
    width?: string;
  backgroundColor?: string;
};

const VybeSyncDrawer = ({
  opened,
  closeDrawer,
  title,
  children,
  side = "right",
    width,
  backgroundColor,
}: Props) => {
  return (
    <Sheet open={opened}>
      <SheetClose className=" !hidden"/>
      <SheetContent side={side} className={`${width} ${backgroundColor} border-none`}>
        <SheetHeader className=" flex flex-row justify-between items-center !mb-0 !pb-0 ">
          <SheetTitle className="text-white">{title}</SheetTitle>
          <Button
            size={"icon"}
            variant="outline"
            className=" bg-light-muted hover:bg-foreground text-background hover:text-background cursor-pointer"
            onClick={closeDrawer}
          >
            <XIcon />
          </Button>
        </SheetHeader>
        <div>{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default VybeSyncDrawer;
