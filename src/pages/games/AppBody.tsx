// import { Browser } from "./browser/Browser";
// import { useGames } from "./browser/context.tsx";
// import { useCurrentGameId } from "./hooks";
import {
  getDemoDuration,
  getKtxstatsAsString,
  getServerinfoAsObject,
  getSha256,
} from "mvdparser";
import { DragEvent, useEffect } from "react";
// import { GameDetails } from "./player/GameDetails.tsx";
import { useElementSize } from "usehooks-ts";
import { getDroppedFiles, readFile } from "./html.ts";

function getAppBodySize() {
  const el = document.getElementById("AppBody");
  if (!el) {
    return { width: 0, height: 0 };
  }
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
}

export const AppBody = () => {
  // const gameId = useCurrentGameId();
  // const { isLoading } = useGames();

  function handleAppBodySizeChange() {
    dispatchEvent(
      new CustomEvent("app.body.resize", { detail: getAppBodySize() }),
    );
  }

  const [bodyRef, bodySize] = useElementSize();

  // useEffect(() => {
  //   if (isLoading) {
  //     return;
  //   }
  //
  //   handleAppBodySizeChange();
  // }, [isLoading]);

  useEffect(() => {
    handleAppBodySizeChange();
  }, [bodySize]);

  return (
    <div id="AppBody" ref={bodyRef}>
      <div onDrop={dropHandler} className="h-[800px] bg-green-200 text-black">
        hehe
      </div>
    </div>
  );
};

async function dropHandler(e: DragEvent) {
  console.clear();
  const files = getDroppedFiles(e);

  for (const file of files) {
    const bytes = await readFile(file);
    const sha256 = await getSha256(bytes);
    // const gameId = await getGameIdBySha256(sha256);
    // console.log(file.name, sha256, `GAME ID: ${gameId}`);
    console.log(file.name, sha256);

    console.log("\nduration", getDemoDuration(bytes));
    console.log("\nserverinfo", getServerinfoAsObject(bytes));
    console.log("\nktxstats", getKtxstatsAsString(bytes));

    // if (null === gameId) {
    //   // const endOfDemo = bytes.slice(-10);
    //   // console.log(String.fromCharCode(...endOfDemo));
    //
    //
    // } else {
    //   // redirect to game
    //   document.location.href = `/games/?gameid=${gameId}`;
    // }
  }
}
