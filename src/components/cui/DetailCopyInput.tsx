"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

const DetailCopyInput = ({ ShareUrl }: { ShareUrl: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ShareUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 4000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className=" flex items-center">
      <Input
        id="input"
        defaultValue={ShareUrl}
        type="text"
        readOnly
        className=" ring-0 focus-visible:ring-0 focus-within:ring-0 outline-none border-none
                         bg-muted-custom-text/50 w-full px-2 py-1 rounded-l-md rounded-r-none  text-sm"
        placeholder="Link to share"
      />
      <Button
        onClick={handleCopy}
        size={"default"}
        className=" rounded-r-md rounded-l-none bg-muted-custom hover:bg-muted-custom/80"
      >
        {copied ? "Copied" : "Copy Link"}
      </Button>
    </div>
  );
};

export default DetailCopyInput;
