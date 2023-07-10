import React from "react";
import { useGetWikiRecentChangesQuery } from "@/services/hub/hub";
import { Heading } from "./Common";

export default function WikiRecentChanges() {
  const { data: forumPosts = [] } = useGetWikiRecentChangesQuery({});
  const limit = 5;

  return (
    <div className="app-links my-8">
      <Heading text="RECENT WIKI CHANGES" icon="forum" />
      {forumPosts.slice(0, limit).map((item, index) => (
        <a href={item.url} className="block" key={index}>
          {item.title}
          <span>({item.date.substring(0, "Say, 08 Jul 2023".length)})</span>
        </a>
      ))}
    </div>
  );
}
