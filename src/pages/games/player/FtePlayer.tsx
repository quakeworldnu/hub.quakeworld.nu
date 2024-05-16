import classNames from "classnames";
import { useIdleTimer } from "react-idle-timer";
import { useFteController, useFteLoader } from "../fte/hooks.ts";
import type { FteAssets } from "../fte/types.ts";
import type { Demo } from "../services/supabase/supabase.types.ts";
import { Controls } from "./Controls.tsx";
import { FteCanvas } from "./FteCanvas.tsx";
import { useClipPlayback } from "./clips/hooks.ts";
import { ScoreBanner } from "./controls/ScoreBanner.tsx";
import { Teaminfo } from "./controls/Teaminfo.tsx";

export const FtePlayer = ({
  demo,
  assets,
}: {
  demo: Demo;
  assets: FteAssets;
}) => {
  useClipPlayback();
  const { isLoadingAssets, isReady, assetStatus, isInitializing } =
    useFteLoader({
      assets,
      demoTotalTime: demo.duration,
    });
  const fte = useFteController();

  useIdleTimer({
    onIdle: () => dispatchEvent(new Event("demoplayer.mouse.idle")),
    onActive: () => dispatchEvent(new Event("demoplayer.mouse.active")),
    events: ["mousemove"],
    timeout: 2500,
  });

  const isTeamplay = !["1on1"].includes(demo.mode);

  return (
    <div
      id="ftePlayer"
      className={"relative w-full h-full bg-black aspect-video"}
    >
      <div id="FullscreenContent">
        <FteCanvas />

        {fte && (
          <>
            <div className={"absolute w-full pt-[2%]"}>
              <ScoreBanner isTeamplay={isTeamplay} />
            </div>

            <div
              className={`absolute hidden sm:flex scale-50 lg:scale-75 xl:scale-100 origin-bottom-right right-[6%] bottom-24 justify-center`}
            >
              <Teaminfo showTeams={isTeamplay} />
            </div>
          </>
        )}
      </div>

      <div
        className={classNames(
          "absolute z-30 w-full h-full bg-black transition-opacity duration-700 pointer-events-none bg-cover",
          {
            "opacity-0": isReady,
          },
        )}
        style={{
          backgroundImage: `url(https://raw.githubusercontent.com/vikpe/qw-mapshots/main/${demo.map}.jpg)`,
        }}
      >
        <div
          className="flex w-full h-full items-center justify-center"
          style={{
            background: "radial-gradient(circle at center, black 0, #0009 80%)",
          }}
        >
          <div className="flex items-center">
            <svg
              className={
                "w-6 h-6 mr-2 fill-violet-600 text-violet-800 animate-spin"
              }
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="animate-pulse text-gray-400">
              {isLoadingAssets && <>Loading assets ({assetStatus.progress}%)</>}
              {isInitializing && <>Initializing..</>}
            </div>
          </div>
        </div>
      </div>
      {fte && (
        <div className={"absolute z-10 bottom-0 w-full"}>
          <Controls />
        </div>
      )}
    </div>
  );
};

// const PlayerDebug = () => {
//   useUpdateInterval(200);
//   const fte = useFteController();
//
//   if (!fte) {
//     return null;
//   }
//
//   return <Debug value={fte.getPlayers()} />;
// };
