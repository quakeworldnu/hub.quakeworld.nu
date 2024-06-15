import { useState } from "react";
import { useEventListener } from "./hooks.ts";

const minHeight = 480;

export const Sidebar = () => {
  const [height, setHeight] = useState<number>(minHeight);

  useEventListener("app.body.resize", (e: CustomEvent) => {
    const { height } = e.detail;
    setHeight(height);
  });

  const maxHeight = `${Math.max(minHeight, height)}px`;

  return (
    <div
      className="my-6 max-w-[480px] 3xl:my-0 3xl:w-[25%]"
      style={{ maxHeight }}
      id="AppSidebar"
    >
      {/*<Playlist />*/}
    </div>
  );
};
