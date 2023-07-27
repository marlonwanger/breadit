import SignIn from '@/components/SignIn'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import  Link  from 'next/link'
import React from 'react'

export default function SignInPage() {
  return (
    <div className='absolute inset-0'>
      <div className='h-full w-max-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <Link href='/' className={cn(buttonVariants({variant: 'ghost'}), 'self-start -mt-20')}>
          <ChevronLeft className='mr-2 h-4 w-4'  />
          Home
        </Link>

        <SignIn />
      </div>
    </div>
  )
}
