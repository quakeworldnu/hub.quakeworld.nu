import React from "react";
import { useGetNewsQuery } from "@qwhub/services/hub/hub";
import { Heading } from "./Common";

export default function News() {
  const { data: news = [] } = useGetNewsQuery();
  const limit = 5;

  return (
    <div className="app-links my-8">
      <Heading text="NEWS" icon="article" />
      {news.slice(0, limit).map((item) => (
        <a href={item.url} className="inline-block" key={item.title}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}
