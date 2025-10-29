"use client"
import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { XIcon } from "lucide-react"

type Props = {
  opened: boolean;
  direction?: "left" | "right" | "top" | "bottom";
  closeDrawer: () => void;
  title: string;
  children: React.ReactNode;
}

export function CDrawer({opened, closeDrawer, title, children, direction = 'bottom'}:Props) {

  return (
    <Drawer open={opened} direction={direction}>
      <DrawerContent className=" w-full h-dvh bg-foreground">
        <div className="mx-auto w-full ">
          <DrawerHeader className=" flex flex-row justify-between items-center ">
            <DrawerTitle className="text-white">{title}</DrawerTitle>
            <Button
              size={"icon"}
              variant="outline"
              className=" bg-background/15 hover:bg-foreground text-background hover:text-background"
              onClick={closeDrawer}
            >
              <XIcon />
            </Button>
          </DrawerHeader>
          <section className=" pb-0">
            {children}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

