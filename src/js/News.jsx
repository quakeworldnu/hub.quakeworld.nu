import React from "react";
import { useSelector } from "react-redux";
import { selectAllNews } from "./services/qws/news.js";

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
        <a href={item.url} className="footer-link" key={index}>
          {item.title}
          <span className="ml-2 text-gray-500">({item.date})</span>
        </a>
      ))}
    </div>
  );
}
