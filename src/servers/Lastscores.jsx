import React, { useEffect, useState } from "react";
import { useGetLastscoresQuery } from "@/services/hub/hub";
import classNames from "classnames";
import { LastscoresScoreboard } from "@/servers/LastscoresScoreboard";
import { Mapshot } from "@/servers/Mapshot";

export const Lastscores = ({ address, onClose }) => {
  const { data, isLoading, isSuccess, isError } =
    useGetLastscoresQuery(address);
  const [showAllScores, setShowAllScores] = useState(false);

  return (
    <div className="h-full text-xs">
      <div className="bg-black/50 shadow flex items-center">
        <div
          className="grow p-3 cursor-pointer hover:bg-black/70 hover:text-sky-300"
          onClick={onClose}
        >
          <img
            src="/assets/img/icons/chevron_forward.svg"
            alt=""
            width={12}
            height={12}
            className="mr-1 rotate-180 inline"
          />
          Back to scoreboard
        </div>
        {data && data.length > 0 && !showAllScores && (
          <div
            className="py-3 px-5 cursor-pointer hover:bg-black/70 hover:text-sky-300"
            onClick={() => setShowAllScores(true)}
          >
            Reveal all scores
          </div>
        )}
      </div>
      <div>
        {isError && <Placeholder text="Error: unable to fetch lastscores" />}
        {isSuccess && 0 === data.length && (
          <Placeholder text="no lastscores found" />
        )}
        {isLoading && <Placeholder text="Loading..." />}

        {data && data.length > 0 && (
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-white">
                <tr className="border-b border-black/20">
                  <th className="p-1">timestamp</th>
                  <th className="p-1">mode</th>
                  <th className="p-1">participants</th>
                  <th className="p-1">map</th>
                  <th className="p-1" width={1}>
                    scores
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((lastscores, index) => (
                  <LastscoresRow
                    key={index}
                    lastscores={lastscores}
                    showAllScores={showAllScores}
                    address={address}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Placeholder = ({ text }) => {
  return (
    <div className="flex min-h-[96px] text-gray-300 justify-center items-center">
      {text}
    </div>
  );
};

const LastscoresRow = ({ lastscores, showAllScores = false, address = "" }) => {
  const { timestamp, mode, participants, map, scores, demo } = lastscores;
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showScores, setShowScores] = useState(showAllScores);

  function toggleScoreboard() {
    setShowScoreboard(!showScoreboard);
    setShowScores(true);
  }

  useEffect(() => {
    if (showAllScores) {
      setShowScores(true);
    }
  }, [showAllScores]);

  const demoUrls = toDemoUrls(demo, address);

  return (
    <>
      <tr
        className="odd:bg-black/10 hover:bg-black/20 cursor-pointer"
        onClick={toggleScoreboard}
      >
        <td className="p-1">{timestamp}</td>
        <td className="p-1">{mode}</td>
        <td className="p-1">{participants}</td>
        <td className="p-1">{map}</td>
        <td className="p-1">
          <TextSpoiler text={scores} isRevealed={showScores} />
        </td>
      </tr>
      {showScoreboard && (
        <tr>
          <td colSpan={5} className="group">
            <Mapshot map={map}>
              {demoUrls && (
                <div className="flex transition-opacity opacity-0 group-hover:opacity-100 ml-4 mt-4 space-x-2 absolute">
                  <a
                    href={demoUrls.download}
                    title="Download demo"
                    className="p-1 rounded-full bg-black/70 opacity-60 hover:opacity-100"
                  >
                    <img
                      src="/assets/img/icons/download.svg"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    href={demoUrls.stream}
                    title="Stream demo"
                    className="p-1 rounded-full bg-black/70 opacity-60 hover:opacity-100"
                  >
                    <img
                      src="/assets/img/icons/play_arrow.svg"
                      width={24}
                      height={24}
                    />
                  </a>
                </div>
              )}

              <div className="flex justify-center py-4 bg-gray-700/20 border-y border-gray-900">
                <LastscoresScoreboard lastscores={lastscores} />
              </div>
            </Mapshot>
          </td>
        </tr>
      )}
    </>
  );
};

function toDemoUrls(demoFilename, serverAddress) {
  if (!demoFilename || !serverAddress.includes(":")) {
    return null;
  }
  const qtvAddress = `${serverAddress.split(":")[0]}:28000`;

  return {
    download: `http://${qtvAddress}/dl/demos/${demoFilename}`,
    stream: `qw://qtvplay file:${demoFilename}@${qtvAddress}`,
  };
}

const TextSpoiler = ({ text, isRevealed = false }) => {
  return (
    <span
      className={classNames({ "blur-sm": !isRevealed })}
      title="Reveal scores"
    >
      {text}
    </span>
  );
};
