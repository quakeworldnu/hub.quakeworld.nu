import React from "react";
import { useGetForumPostsQuery } from "@qwhub/services/hub/hub";
import { Heading } from "./Common";

export default function ForumPosts() {
  const { data: forumPosts = [] } = useGetForumPostsQuery();
  const limit = 5;

  return (
    <div className="app-links my-8">
      <Heading text="FORUM ACTIVITY" icon="forum" />
      {forumPosts.slice(0, limit).map((item) => (
        <a href={item.url} className="inline-block" key={item.title}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}
