"use client";
import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-10 animate-spin text-primary-custom", className)}
      {...props}
    />
  );
}

export function VybeSyncLoader() {
  return <Spinner />;
}
