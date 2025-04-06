import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

const SearchSheet = () => {
  return (
    <Sheet modal={false} >
  <SheetTrigger><span>Open</span></SheetTrigger>
  <SheetContent  className='z-50 w-[800px] bg-foreground' side='right'>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

  )
}

export default SearchSheet