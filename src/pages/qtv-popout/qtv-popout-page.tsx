import { FteQtvPlayer } from "@/features/qtv/components/fte-qtv-player";
import { useInitialQtvServer } from "@/features/qtv/hooks/use-initial-qtv-server";
import { ServerPoller } from "@/features/servers/components/servers";

export const QtvPopoutPage = () => {
  const server = useInitialQtvServer();

  return (
    <>
      {server && (
        <FteQtvPlayer
          mapName={server.info.map}
          timelimit={Number.parseInt(server.info.timelimit, 10)}
          fullscreen
        />
      )}
      <ServerPoller />
    </>
  );
};
