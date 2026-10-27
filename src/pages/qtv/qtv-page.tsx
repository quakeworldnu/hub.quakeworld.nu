import { FteQtvPlayer } from "@/features/qtv/components/fte-qtv-player";
import { QtvPlayerFooter } from "@/features/qtv/components/qtv-footer";
import { QtvPlayerSidebar } from "@/features/qtv/components/qtv-sidebar";
import { useInitialQtvServer } from "@/features/qtv/hooks/use-initial-qtv-server";
import { ServerPoller } from "@/features/servers/components/servers";
import { SiteFooter } from "@/pages/layout/site-footer";
import { SiteHeader } from "@/pages/layout/site-header";
import { isEmbedded } from "@/utils/embed";

// app layout: header + body + footer fill the viewport, only the server list scrolls
export const QtvPage = () => {
  return (
    <div className="flex flex-col h-dvh">
      <div className="shrink-0">
        <SiteHeader />
      </div>
      <QtvContent />
      <div className="shrink-0">
        <SiteFooter />
      </div>
      <ServerPoller />
    </div>
  );
};

const QtvContent = () => {
  const server = useInitialQtvServer();

  return (
    <div className="flex flex-1 min-h-0 my-4">
      {!isEmbedded() && <QtvPlayerSidebar />}
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <div className="flex-1 min-h-0">
          {server ? (
            <FteQtvPlayer mapName={server.info.map} />
          ) : (
            <div className="h-full grid place-items-center text-slate-400">
              Select a server to watch.
            </div>
          )}
        </div>
        {/* same width as the player, the sidebar stretches alongside */}
        <div className="shrink-0">
          <QtvPlayerFooter />
        </div>
      </div>
    </div>
  );
};
