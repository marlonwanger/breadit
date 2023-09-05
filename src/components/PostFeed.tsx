"use client";

import { ExtendedPost } from "@/types/db";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { access } from "fs";
import { useSession } from "next-auth/react";
import Post from "./Post";

interface PostFeedProps {
  initialPost: ExtendedPost[];
  subredditName?: string;
}

export default function PostFeed({
  initialPost,
  subredditName,
}: PostFeedProps) {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subreddit=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPost], pageParams: [1] },
    }
  );

  useEffect(() => {

    if(entry?.isIntersecting) {
      fetchNextPage();
    }

  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPost;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user?.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmt={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <Post
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmt={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
              key={post.id}
            />
          );
        }
      })}
    </ul>
  );
}
