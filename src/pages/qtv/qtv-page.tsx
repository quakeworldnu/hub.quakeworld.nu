import { presets, Shortcuts } from "@/components/fte-player/shortcuts";
import { FteQtvPlayer } from "@/features/qtv/components/fte-qtv-player";
import { QtvPlayerFooter } from "@/features/qtv/components/qtv-footer";
import { QtvPlayerSidebar } from "@/features/qtv/components/qtv-sidebar";
import { useInitialQtvServer } from "@/features/qtv/hooks/use-initial-qtv-server";
import { ServerPoller } from "@/features/servers/components/servers";
import { SiteFooter } from "@/pages/layout/site-footer";
import { SiteHeader } from "@/pages/layout/site-header";

export const QtvPage = () => {
  return (
    <>
      <SiteHeader />
      <QtvContent />
      <SiteFooter />
      <ServerPoller />
    </>
  );
};

const QtvContent = () => {
  const server = useInitialQtvServer();

  return (
    <div>
      <div className="lg:flex gap-x-4 ">
        <div className="my-4 flex flex-col w-full">
          <div className="grow">
            {server && (
              <FteQtvPlayer
                mapName={server.info.map}
                timelimit={Number.parseInt(server.info.timelimit, 10)}
              />
            )}
          </div>
          <QtvPlayerFooter />
        </div>

        <div className="lg:w-1/2 xl:w-1/3 lg:max-w-[540px] order-first my-4 max-h-[80vh] overflow-auto">
          <QtvPlayerSidebar />

          <div className="lg:hidden">
            <hr className="my-6 border-slate-800" />
            <Shortcuts preset={presets.qtvPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
};
