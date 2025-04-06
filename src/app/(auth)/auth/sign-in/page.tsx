import { auth } from '@/auth'
import logo from '../../../../../public/veslogo1.png'
import { LoginForm } from "@/components/cui/login-form"
import Image from "next/image"
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    return redirect('/')
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-foreground p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center text-xl font-semibold">
            <Image src={logo} width={60} height={60} alt={'logo'} />
          Vybesync.
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
