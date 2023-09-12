"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comments";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

export default function CreateComment({
  postId,
  replyToId,
}: CreateCommentProps) {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Commment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are you"
        /> 

        <div className="mt-2 flex justify-end">
          <Button
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : <> Post </>}
          </Button>
        </div>
      </div>
    </div>
  );
}
