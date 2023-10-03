import { Controls } from "./Controls";
import { useFteLoader } from "./hooks";

export const FtePlayer = ({ files }) => {
  const { isReady, assets } = useFteLoader({ files });

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

        <div className="flex w-full h-full z-30 debug">
          <div>Loadiasdasdng: {JSON.stringify(assets, null, 2)}</div>
        </div>

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
