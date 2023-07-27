'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Loader2 } from "lucide-react";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string
  isSubscribed: boolean;
}

export default function SubscribeLeaveToggle({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) {

  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if(err instanceof AxiosError) {
        if(err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      })

      toast({
        title: 'Subscribed',
        description: `You are now unsubscribed from /r ${subredditName}`,
      })
    }
  })

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if(err instanceof AxiosError) {
        if(err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      })

      toast({
        title: 'Subscribed',
        description: `You are now subscribed to /r ${subredditName}`,
      })
    }
  })

  return isSubscribed ? (
    <Button onClick={() => unsubscribe()}  className="w-full mt-1 mb-4">
      {isUnSubLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUnSubLoading ? "Loading..." : <> Leave community </>}
    </Button>
  ) : (
    <Button onClick={() => subscribe()} className="w-full mt-1 mb-4">
      {isSubLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubLoading ? "Loading..." : <> Join to post </>}
    </Button>
  );
}
