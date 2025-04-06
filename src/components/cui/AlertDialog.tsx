'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
  export function AlertDialogDemo({description, trigger}:{description:string; trigger:React.ReactNode}) {
    return (
      <AlertDialog >
        <AlertDialogTrigger asChild>
            {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent className=" bg-foreground text-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" bg-muted-custom">Cancel</AlertDialogCancel>
            <AlertDialogAction className=" text-primary-custom">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }


  export function CommentDialog({description, handleDelete, trigger}:{handleDelete:()=> void;description:string; trigger:React.ReactNode}) {
    return (
      <AlertDialog >
        <AlertDialogTrigger asChild>
            {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent className=" bg-foreground text-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" bg-muted-custom">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className=" text-primary-custom">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  