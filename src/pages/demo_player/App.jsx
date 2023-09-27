import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import FteComponent from "./nano/components/fte";
import { ChatInput, ChatMessages } from "@qwhub/pages/demo_player/Chat";

export const App = () => {
  // https://quakeworld.s3.eu-central-1.amazonaws.com/qw/demos/tournaments/allstars/allstars_2015/20150920-1345_showmatch_666_vs_star%5Bdm3%5D.mvd
  const demoBaseUrl = "https://quakeworld.s3.eu-central-1.amazonaws.com";
  const demoDirectory = "qw/demos/tournaments/allstars/allstars_2015";
  const demoFilename = "20150920-1345_showmatch_666_vs_star[dm3].mvd";
  const duration = 1210;
  const mapName = "dm3";

  const breadcrumbs = [
    "Tournaments",
    "QLAN",
    "QHLAN 13",
    "4on4",
    "Playoffs - Semi Final A",
  ];

  return (
    <>
      <SiteHeader />

      <div className="my-6 space-y-4">
        <div className="flex p-3 bg-white/5 text-sm text-gray-200 justify-between">
          <div>
            Demos
            {breadcrumbs.map((b) => (
              <>
                <span className="mx-2 text-gray-500">/</span>
                <span>{b}</span>
              </>
            ))}
          </div>
          <div>[START SESSION] [JOIN SESSION]</div>
        </div>
        <div className="flex debug min-h-[800px]">
          <div className="flex flex-col h-auto grow">
            <div className="flex bg-white/5 px-5 py-4 items-center">
              <div className="grow">
                <div className="text-xl font-bold">4on4: SR vs -SD- [dm3]</div>
                <div className="text-sm text-neutral-300 mt-1">
                  QHLAN 13 - 4on4 Playoffs - Semi Final A
                </div>
              </div>
              <div className="border border-white/30 bg-blue-400/20 font-mono text-lg p-2 px-3">
                Create group session
              </div>
            </div>
            <div className="flex grow bg-red-400/20 items-center justify-center max-h-[60vh]">
              <FteComponent
                demo={demoFilename}
                map={mapName}
                demoBaseUrl={demoBaseUrl}
                directory={demoDirectory}
                duration={duration}
              />
            </div>
            <div className="flex w-full p-4 space-x-4">
              <div className="flex space-x-4">
                <button className="p-2 px-3 text-sm rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer">
                  Create clip
                </button>

                <button className="p-2 px-3 text-sm rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer">
                  Download
                </button>
              </div>
            </div>

            <div className="flex flex-row p-4 justify-around">
              <div className="flex space-x-28">
                <div>
                  <div className="opacity-50 text-right">Previous</div>
                  <div>
                    4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final
                    A
                  </div>
                </div>
                <div>
                  <div className="opacity-50">Next</div>
                  <div>
                    4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final
                    A
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[400px]">
            <div className="flex px-6 py-7 bg-white/5 space-x-6">
              <div className="border-b-2 border-blue-500 font-bold">Chat</div>
              <div>Playlist</div>
              <div>Related demos</div>
            </div>
            <div className="grow bg-blue-400/10">
              <ChatMessages />
            </div>

            <ChatInput />
          </div>
        </div>
      </div>

      <SiteFooter />
      {/*<ServerPoller />*/}
    </>
  );
};

export default App;
