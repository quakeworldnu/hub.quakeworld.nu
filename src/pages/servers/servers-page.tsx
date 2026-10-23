import { AllStreams } from "@/components/streams/streams";
import { HorizontalSeparator } from "@/components/ui/separator";
import { useQueueStats } from "@/features/qwleague/api/queue";
import {
  QWLeague,
  QWLeagueBanner,
} from "@/features/qwleague/components/qwleague";
import { ScheduledGames } from "@/features/scheduled-games/components/scheduled-games";
import Servers, { ServerPoller } from "@/features/servers/components/servers";
import { KoFiGoal } from "@/features/support-goal/components/ko-fi-goal";
import { SiteFooter } from "@/pages/layout/site-footer";
import { SiteHeader } from "@/pages/layout/site-header";

export const ServersPage = () => {
  const qwleagueStats = useQueueStats();

  return (
    <>
      <SiteHeader />
      <QWLeagueBanner stats={qwleagueStats} className="mt-4 3xl:hidden" />
      <div className="3xl:flex 3xl:gap-x-8 4xl:gap-x-10">
        <div className="grow">
          <Servers />
        </div>

        <div className="w-full 3xl:hidden my-4">
          <HorizontalSeparator />
        </div>

        <div className="flex flex-row flex-wrap my-4 gap-y-6 gap-x-8 3xl:w-96 3xl:flex-col">
          <div className="hidden 3xl:block">
            <QWLeague stats={qwleagueStats} />
          </div>
          <KoFiGoal
            project="carapace51218"
            title="Support Antilag"
            description="Support the continued development of Antilag"
          />
          <ScheduledGames />
          <AllStreams />
        </div>
      </div>

      <SiteFooter />
      <ServerPoller />
    </>
  );
};
