import React from "react";
import { useGetForumPostsQuery } from "@/services/hub/hub";
import { Heading } from "./Common";

export default function News() {
  const { data: forumPosts = [] } = useGetForumPostsQuery();
  const limit = 5;

  return (
    <div className="app-links my-6 fill-white">
      <Heading text="FORUM ACTIVITY" icon="forum" />
      {forumPosts.slice(0, limit).map((item, index) => (
        <a href={item.url} className="block" key={index}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}
