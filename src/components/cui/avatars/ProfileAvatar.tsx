'use client'
import React from 'react'
import CDropDown from '../CDropDown';
import CAvatar from '../CAvatar';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TSessionType } from '@/types/auth.types';
import useHandleAuth from '@/hooks/useHandleAuth';

const ProfileAvatar = ({ session }: { session: TSessionType }) => {
  const {signOut} = useHandleAuth()
  return (
    <CDropDown
      contentStyle="bg-foreground/80 border-muted-custom w-[200px]"
      className=" hidden md:block fixed z-30 right-10 top-[30px]"
      trigger={<CAvatar session={session} />}
    >
      <div>
        <DropdownMenuItem className=" leading-6 text-lg py-2 font-medium text-background px-3.5">
          Profile
        </DropdownMenuItem>
        
          <Button onClick={signOut} className="w-full hover:bg-muted-custom hover:text-primary-custom/75 flex items-center justify-start bg-transparent text-lg py-2 font-medium text-primary-custom px-3.5">
            LogOut
          </Button>
      </div>
    </CDropDown>
  );
}

export default ProfileAvatar