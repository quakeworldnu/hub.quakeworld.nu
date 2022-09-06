import React from "react";
import { useSelector } from "react-redux";
import { selectAllForumPosts } from "./services/qws/forumPosts.js";

export default function News() {
  const forumPosts = useSelector(selectAllForumPosts);
  const limit = 5;

  if (0 === forumPosts.length) {
    return <></>
  }

  return (
    <>
      <div className="has-text-weight-bold has-text-info mb-2">FORUM ACTIVITY</div>
      {
        forumPosts.slice(0, limit).map((item, index) => (
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
