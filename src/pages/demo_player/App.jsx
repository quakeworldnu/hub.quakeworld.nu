import React from "react";
import queryString from "query-string";
import { SiteHeader } from "@qwhub/site/Header";
import { SiteFooter } from "@qwhub/site/Footer";
import { DemoDropdown } from "./DemoDropdown";

import FtePlayer from "./fte/fte";
import {
  demoFilenameToMapName,
  demoFilenameToTitle,
  demoUrlToFilename,
  demoUrlToQuakeRelativePath,
} from "./demoUtil";
import { Chat } from "./Chat";
import { UserInfo } from "./UserInfo";
import { getAssets } from "./fte/assets";

function getCurrentUrlWithoutQueryString() {
  return window.location.href.split("?")[0];
}

export const App = () => {
  return (
    <>
      {false && <SiteHeader />}
      <DemoPlayerApp />
      {false && <SiteFooter />}
    </>
  );
};

export const DemoPlayerApp = () => {
  const query = queryString.parse(location.search);
  const demoUrl = query.demoUrl ?? "";

  function onDemoDropdownChange(value) {
    const currentUrl = getCurrentUrlWithoutQueryString();
    window.location.href = `${currentUrl}?demoUrl=${value}`;
  }

  return (
    <div className="my-6 space-y-4">
      <div className="flex justify-between items-center">
        {demoUrl && (
          <div>
            <DemoDropdown
              onChange={onDemoDropdownChange}
              currentValue={demoUrl}
            />
          </div>
        )}
        <UserInfo />
      </div>
      {demoUrl && <DemoPlayer demoUrl={demoUrl} />}
      {!demoUrl && (
        <div className="flex flex-col justify-center items-center w-full h-[600px] bg-white/5 space-y-5">
          <div className="font-bold text-xl">Select a demo</div>
          <DemoDropdown
            onChange={onDemoDropdownChange}
            currentValue={demoUrl}
          />
        </div>
      )}
    </div>
  );
};

function demoUrlToBreadcrumbs(demoUrl) {
  const parts = demoUrlToQuakeRelativePath(demoUrl).split("/");
  return parts.slice(0, parts.length - 1).map((p) => p.replaceAll("_", " "));
}

export const DemoPlayer = ({ demoUrl }) => {
  const demoFilename = demoUrlToFilename(demoUrl);
  const demoMapName = demoFilenameToMapName(demoFilename);
  const demoTitle = demoFilenameToTitle(demoFilename);
  const demoBreadcrumbs = demoUrlToBreadcrumbs(demoUrl);
  const demoEventTitle = demoBreadcrumbs.slice(-2).join(" / ");
  const files = getAssets(demoUrl, demoMapName);

  return (
    <>
      <div className="flex p-3 bg-white/5 text-sm text-gray-200 justify-between">
        <div>
          Demos
          {demoBreadcrumbs.map((b, i) => (
            <span key={i}>
              <span className="mx-2 text-gray-500">/</span>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-h-[800px]">
        <div className="flex flex-col grow">
          <div className="flex grow bg-black items-center justify-center max-h-[60vh]">
            {<FtePlayer files={files} demoUrl={demoUrl} />}
          </div>
          <div className="py-6 flex justify-between">
            <div>
              <div className="text-2xl font-bold">{demoTitle}</div>
              <div className="text-sm text-neutral-300 mt-1">
                {demoEventTitle}
              </div>
            </div>
            <div>
              <a
                href={demoUrl}
                className="py-3 px-4 rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer"
              >
                Download demo
              </a>
            </div>
          </div>

          <div className="flex flex-row py-8 justify-around border-t border-white/10">
            <div className="flex space-x-28 text-sm">
              <div>
                <div className="text-gray-500 text-right">Previous</div>
                <div className="text-gray-300">
                  4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final A
                </div>
              </div>
              <div>
                <div className="text-sky-400">Next</div>
                <div className="text-sky-300 font-bold">
                  4on4: SR vs -SD- [dm3] QHLAN 13 - 4on4 Playoffs - Semi Final A
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[400px] ml-4">
          <div className="flex px-6 py-7 bg-white/5 space-x-6">
            <div className="border-b-2 border-blue-500 font-bold">Chat</div>
            <div>Playlist</div>
            <div>Related demos</div>
          </div>
          <div className="flex flex-col bg-blue-400/10 h-full">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
