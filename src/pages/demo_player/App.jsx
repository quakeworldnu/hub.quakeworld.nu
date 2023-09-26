import React from "react";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import FteComponent from "./nano/components/fte";
import { HorizontalSeparator } from "@qwhub/site/Common";

export const App = () => {
  const mapName = "e1m2";

  if (false) {
    const demoBaseUrl =
      "https://media.githubusercontent.com/media/qw-ctf/matches/main";
    const demoDirectory = "tournaments/qhlan-2022";
    const demoFilename =
      "qhlan_group_ax_v_bl_1of3_ctf_blue_vs_red[e2m2]20221118-1523.mvd";
  }

  const demoBaseUrl = "/public";
  const demoDirectory = "demos";
  const demoFilename = "4v4_-s-_vs_]sr[[e1m2]20220116-2312.mvd";
  const duration = 1210;

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
        <div className="p-3 bg-white/5 text-sm text-gray-200">
          Demos
          {breadcrumbs.map((b) => (
            <>
              <span className="mx-2 text-gray-500">/</span>
              <span>{b}</span>
            </>
          ))}
        </div>
        <div className="flex debug min-h-[800px]">
          <div className="flex flex-col h-auto grow">
            <div className="bg-white/5 px-5 py-4">
              <div className="text-xl font-bold">4on4: SR vs -SD- [e1m2]</div>
              <div className="text-sm text-neutral-300 mt-1">
                QHLAN 13 - 4on4 Playoffs - Semi Final A
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

            <div className="flex flex-row p-4">
              <div className="grow">
                <div className="opacity-50">Previous</div>
                <div>
                  4on4: SR vs -SD- [e1m2] QHLAN 13 - 4on4 Playoffs - Semi Final
                  A
                </div>
              </div>
              <div className="grow text-right">
                <div className="opacity-50">Next</div>
                <div>
                  4on4: SR vs -SD- [e1m2] QHLAN 13 - 4on4 Playoffs - Semi Final
                  A
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
            <div className="grow bg-blue-400/10 p-4">[messages]</div>
            <input
              type="text"
              className="bg-neutral-800 placeholder-white border border-white/10 w-full p-4"
              placeholder={"Say something..."}
            />
          </div>
        </div>

        <div className="py-4">
          <HorizontalSeparator />
        </div>

        <div>Related demos:</div>
      </div>

      <SiteFooter />
      {/*<ServerPoller />*/}
    </>
  );
};

export default App;

function ChatMessage({ message }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-400">{message.time}</span>
      <span className="text-gray-400">{message.player}</span>
      <span>{message.text}</span>
    </div>
  );
}
