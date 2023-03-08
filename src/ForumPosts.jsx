import React from "react";
import { useGetForumPostsQuery } from "@/services/hub/hub";

export default function News() {
  const { data: forumPosts } = useGetForumPostsQuery();
  const limit = 5;

  return (
    <div>
      <div className="font-bold text-gray-300/50 mb-2">FORUM ACTIVITY</div>
      {forumPosts.slice(0, limit).map((item, index) => (
        <a href={item.url} className="block" key={index}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}
