import { AutotrackToggle } from "./controls/AutotrackToggle";
import { FullscreenToggle } from "./controls/FullscreenToggle";
import { PlayToggle } from "./controls/PlayToggle";
import { PlayerTrackButtons } from "./controls/PlayerTrackButtons"; // import { SlowmotionToggle } from "./controls/SlowmotionToggle";
import { GameClock } from "./controls/GameClock";
import { TimeSlider } from "./controls/TimeSlider";
import { VolumeSlider } from "./controls/VolumeSlider";
import { VolumeToggle } from "./controls/VolumeToggle";
import { useUser } from "../services/convex/hooks";
import { Debug } from "./Debug";
import { useFteController, useFteEvent } from "./hooks";
import { useEffect } from "react";

export const Controls = () => {
  const { user } = useUser();

  return (
    <>
      {user?.groupId && <GroupControls />}
      <TimeSlider />
      <PlayToggle />
      <VolumeToggle />
      <VolumeSlider />
      <GameClock />
      <div className="flex space-x-1 px-3 bg-black rounded-xl items-center text-sm">
        <AutotrackToggle />
        <PlayerTrackButtons />
      </div>
      <FullscreenToggle />
    </>
  );
};

const GroupControls = () => {
  const fte = useFteController();
  const { setGroupDemoplayback, user, group } = useUser();

  function onGroupChange(fte, group) {
    if (!fte || !group) {
      return;
    } else if (group.demoPlayback.userId === user._id) {
      return;
    }

    fte.applyPlayback(group.demoPlayback);
  }

  useEffect(() => {
    onGroupChange(fte, group);
  }, [group, fte]);

  const onDemoJump = async (event) => {
    if (!fte) {
      return;
    }

    const playback = {
      ...fte.toPlayback(),
      userId: user._id,
      time: event.detail.value,
    };
    await setGroupDemoplayback(playback);
  };
  useFteEvent("demo_jump", onDemoJump);

  const onCommand = async (event) => {
    if (!fte) {
      return;
    }

    if (event.detail.value.includes("demo_jump")) {
      return;
    }

    const playback = {
      ...fte.toPlayback(),
      userId: user._id,
    };
    await setGroupDemoplayback(playback);
  };
  useFteEvent("command", onCommand);

  return (
    <div className="hidden">
      <Debug value={group} />
    </div>
  );
};
