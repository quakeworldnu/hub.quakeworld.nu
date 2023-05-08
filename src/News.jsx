import React from "react";
import { useGetNewsQuery } from "@/services/hub/hub";

export default function News() {
  const { data: news = [] } = useGetNewsQuery();
  const limit = 5;

  return (
    <div className="app-links my-6">
      <div className="font-bold text-gray-300/50 mb-2">NEWS</div>
      {news.slice(0, limit).map((item, index) => (
        <a href={item.url} className="block" key={index}>
          {item.title}
          <span>({item.date})</span>
        </a>
      ))}
    </div>
  );
}
