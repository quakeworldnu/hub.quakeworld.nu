import React from "react";
import { useSelector } from "react-redux";
import { selectAllNews } from "./services/hub/news.js";

export default function News() {
  const news = useSelector(selectAllNews);
  const limit = 5;

  if (0 === news.length) {
    return <></>;
  }

  return (
    <div>
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
