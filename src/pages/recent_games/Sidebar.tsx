import { Playlist } from "./playlist/Playlist.tsx";
import { useState } from "react";
import { useEvent } from "react-use";

const minMaxHeight = 320;

export const Sidebar = () => {
  const [height, setHeight] = useState<number>(minMaxHeight);

  useEvent("app.body.resize", (e: CustomEvent) => {
    const { height } = e.detail;
    setHeight(height);
  });

  const maxHeight = `${Math.max(minMaxHeight, height)}px`;

  return (
    <div
      className="my-6 lg:my-0 lg:w-[420px]"
      style={{ maxHeight }}
      id="AppSidebar"
    >
      <Playlist />
    </div>
  );
};
