import {
  PlayToggleButton,
  SeekBar,
  VolumeSlider,
  VolumeToggle,
} from "@qwhub/pages/demo_player/DemoPlayer/components/controls";
import { useCounter, useEventListener, useInterval } from "usehooks-ts";
import { useState } from "react";
import { secondsToString } from "@qwhub/pages/demo_player/DemoPlayer/components/time";
import { toColoredHtml, toPlainText } from "@qwhub/pages/demo_player/qwstrings";

function useFteUpdateTriggers() {
  const { count, increment } = useCounter(0);
  useEventListener("fte.volume", increment);
  useEventListener("fte.mute", increment);
  useEventListener("fte.unmute", increment);
  useEventListener("fte.play", increment);
  useEventListener("fte.pause", increment);
  useEventListener("fte.track", increment);
  return count;
}

export const FteControls = ({ fte, duration }) => {
  useFteUpdateTriggers();

  if (!fte) {
    return null;
  }

  console.log("FteControls.RENDER");

  return (
    <>
      <SeekBar
        onChange={(v) => fte.demoJump(v)}
        max={duration}
        value={fte.getGametime()}
      />

      <PlayToggleButton
        onClick={() => fte.togglePlay()}
        isPlaying={fte.isPlaying()}
      />

      <VolumeToggle
        volume={fte.volume()}
        isMuted={fte.isMuted()}
        onClick={() => fte.toggleMute()}
      />

      <VolumeSlider
        volume={fte.volume()}
        disabled={fte.isMuted()}
        onChange={(v) => fte.setVolume(v)}
      />

      <FteGametime fte={fte} durationStr={secondsToString(duration)} />

      <Players players={fte.getPlayers()} onClick={(name) => fte.track(name)} />
    </>
  );
};

const Players = ({ players, onClick }) => {
  if (!players) {
    return null;
  }

  return (
    <div className="flex space-x-1 bg-black items-center px-2 ml-auto">
      {players.map((p) => (
        <button
          className="text-xs"
          key={p.name}
          onClick={() => onClick(toPlainText(p.name))}
        >
          <span dangerouslySetInnerHTML={{ __html: toColoredHtml(p.name) }} />
        </button>
      ))}
    </div>
  );
};

const FteGametime = ({ fte, durationStr }) => {
  const [gametime, setGametime] = useState(fte.getGametime());
  useInterval(() => setGametime(fte.getGametime()), 200);

  if (!fte) {
    return null;
  }

  return (
    <div className="flex mr-auto font-mono items-center">
      {secondsToString(gametime)} / {durationStr}
    </div>
  );
};
