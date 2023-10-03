import React, { Fragment } from "react";
import { useGetWikiRecentChangesQuery } from "@qwhub/services/hub/hub";
import { Heading } from "./Common";

export default function WikiRecentChanges() {
  const { data: forumPosts = [] } = useGetWikiRecentChangesQuery({});
  const limit = 5;

  return (
    <div className="app-links my-8">
      <Heading text="RECENT WIKI CHANGES" icon="article" />
      {forumPosts.slice(0, limit).map((item) => (
        <Fragment key={item.title}>
          <a href={item.url} className="inline-block" key={item.title}>
            {item.title}
            <span>({item.date.substring(0, "Say, 08 Jul 2023".length)})</span>
          </a>
          <br />
        </Fragment>
      ))}
    </div>
  );
}
