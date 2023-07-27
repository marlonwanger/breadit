'use client';

import React, { useState } from 'react'
import { signIn } from 'next-auth/react';

import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react';
import { Icons } from './Icons';
import { useToast } from '@/hooks/use-toast';


interface UserAuthFormProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  async function LoginWithGoogle() {
    setIsLoading(true);

    try {
      await signIn('google')  
    } 
    catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error logging in with google',
        variant: 'destructive'
      })
    }
    finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button onClick={LoginWithGoogle} size='sm' className='w-full'>
        {isLoading && (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        {isLoading ? 'Loading...' : <><Icons.google className='h-4 w-4 mr-2' /> Google</>}
      </Button>
    </div>
  )
}
