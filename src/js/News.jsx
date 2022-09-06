import React from "react";
import { useSelector } from "react-redux";
import { selectAllNews } from "./services/qws/news.js";

export default function News() {
  const news = useSelector(selectAllNews);
  const limit = 5;

  if (0 === news.length) {
    return <></>
  }

  return (
    <>
      <div className="has-text-weight-bold has-text-info mb-2">NEWS</div>
      {
        news.slice(0, limit).map((item, index) => (
          <div className="is-flex is-vcentered mb-1" key={index}>
            <a href={item.url} className="p-1">
              {item.title}<span className="ml-2 has-text-dark">({item.date})</span>
            </a>
          </div>
        ))
      }
    </>
  );
}
