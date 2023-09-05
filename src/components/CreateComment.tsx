"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comments";
import axios from "axios";

export default function CreateComment() {
  const [input, setInput] = useState<string>("");

  const {} = useMutation({
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
          <Button>Post</Button>
        </div>
      </div>
    </div>
  );
}
