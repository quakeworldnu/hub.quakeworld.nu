import { Controls } from "./Controls";
import { useFteLoader } from "./hooks";

export const FtePlayer = ({ files }) => {
  const { isReady, isLoading, assets } = useFteLoader({ files });

  return (
    <div
      id="ftePlayer"
      className={"w-full h-full relative bg-black aspect-video"}
    >
      <div>
        <canvas
          id="fteCanvas"
          className={"absolute w-full h-full"}
          /*onClick={fte.togglePlay}
                    onDoubleClick={() => toggleFullscreen("ftePlayer")}
                    onTouchStart={() => fte.command("+scoreboard")}
                    onTouchEnd={() => fte.command("-scoreboard")}*/
        />

        {(isLoading || assets.progress < 80) && (
          <div className="absolute w-full h-full z-30">
            <div className="flex w-full h-full items-center justify-center">
              <ProgressBar progress={assets.progress} />
            </div>
          </div>
        )}
        <div
          className={"flex absolute bottom-0 w-full z-10 transition-opacity"}
        >
          {isReady && (
            <div
              className={"flex w-full flex-wrap bg-black/60 app-effect-fade-in"}
            >
              <Controls />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FtePlayer;

const ProgressBar = ({ progress }) => {
  const maxWidth = 400;
  const width = Math.round((maxWidth * progress) / 100);

  return (
    <div className="block mx-auto bg-gray-900" style={{ width: maxWidth }}>
      <div
        className="block justify-center h-4 bg-gradient-to-b from-gray-600 to-gray-800 m-0.5"
        style={{ width: width }}
      ></div>
    </div>
  );
};
