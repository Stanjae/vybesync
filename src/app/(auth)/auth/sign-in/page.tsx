import logo from '../../../../../public/veslogo1.png'
import { LoginForm } from "@/components/cui/login-form"
import Image from "next/image"
import Link from 'next/link'

export default async function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-foreground p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center justify-center">
            <Image src={logo} width={120} height={120} alt={'logo'} />
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
