'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

export function LoginDialogDemo({open, setOpen}:{open:boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <Dialog onOpenChange={()=>setOpen(false)} open={open}>
      <DialogContent className="sm:max-w-[425px] text-background bg-foreground">
        <DialogHeader>
          <DialogTitle className=" text-white">You are Not Logged In</DialogTitle>
          <DialogDescription>
            Login and continnue having a good time
          </DialogDescription>
        </DialogHeader>
       <div className=" text-center">
        <Button asChild size={'lg'} className=" bg-primary-custom text-background">
            <Link href={'/auth/sign-in'}>Login Now</Link>
        </Button>
       </div>
      </DialogContent>
    </Dialog>
  )
}
