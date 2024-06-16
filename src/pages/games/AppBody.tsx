import { DragEvent, useEffect } from "react";
// import { GameDetails } from "./player/GameDetails.tsx";
import { useElementSize } from "usehooks-ts";
import { getDroppedFiles, readFile } from "./html.ts";
import { sha256FromBytes } from "./crypto.ts";
import { getGameIdBySha256 } from "./services/supabase/supabase.ts";
// import { Browser } from "./browser/Browser";
// import { useGames } from "./browser/context.tsx";
// import { useCurrentGameId } from "./hooks";

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
    const sha256 = await sha256FromBytes(bytes);
    // const gameId = await getGameIdBySha256(sha256);
    // console.log(file.name, sha256, `GAME ID: ${gameId}`);
    console.log(file.name, sha256);

    console.log(getServerInfo(bytes));

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

function getServerInfo(bytes: Uint8Array): string | null {
  const MAX_LEN = 640;
  const blobStr = String.fromCharCode(...bytes.slice(0, MAX_LEN));
  const match = blobStr.match(/fullserverinfo "([^"]+)"/);

  if (match) {
    return match[1];
  }

  return null;
}

// function getKtxstats(bytes: Uint8Array): string | null {
//   // {"version": "
//   const needle = new Uint8Array([
//     0x7b, 0x22, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x3a, 0x20,
//   ]);
//
//   bytes.find()
//
// }
