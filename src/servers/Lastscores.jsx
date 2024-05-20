import { LastscoresScoreboard } from "@qwhub/servers/LastscoresScoreboard";
import { Mapshot } from "@qwhub/servers/Mapshot";
import { useGetLastscoresQuery } from "@qwhub/services/hub/hub";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

export const Lastscores = ({ address, onClose }) => {
  const { data, isLoading, isSuccess, isError } =
    useGetLastscoresQuery(address);
  const [showAllScores, setShowAllScores] = useState(false);

  return (
    <div className="h-full text-xs">
      <div className="bg-gray-900 shadow flex items-center">
        <div
          className="flex grow p-3 cursor-pointer hover:bg-black/70 hover:text-sky-300"
          onClick={onClose}
        >
          <img
            src="https://hub.quakeworld.nu/assets/img/icons/chevron_forward.svg"
            width={12}
            height={12}
            className="mr-1 rotate-180 inline"
          />
          Back to scoreboard
        </div>
        {data && data.length > 0 && !showAllScores && (
          <div
            className="p-3 cursor-pointer hover:bg-black/70 hover:text-sky-300"
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
              <thead className="bg-black/20 text-gray-300">
                <tr className="border-b border-gray-800">
                  <th className="p-1">timestamp</th>
                  <th className="py-1 pr-3 text-right">mode</th>
                  <th className="p-1">participants</th>
                  <th className="p-1">map</th>
                  <th className="p-1 text-center" width={1}>
                    scores
                  </th>
                  <th />
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
  const { timestamp, mode, participants, map, scores, demo, players } =
    lastscores;
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

  return (
    <>
      <tr
        className="odd:bg-black/10 hover:bg-black/20 cursor-pointer"
        onClick={toggleScoreboard}
      >
        <td className="p-1 text-gray-300">{timestamp}</td>
        <td className="py-1 pr-3 text-right text-gray-300">{mode}</td>
        <td className="p-1">
          {mode === "ffa" ? `${players.length} players` : participants}
        </td>
        <td className="p-1">{map}</td>
        <td className="p-1 text-center">
          {mode !== "ffa" && (
            <TextSpoiler text={scores} isRevealed={showScores} />
          )}
        </td>
      </tr>
      {showScoreboard && (
        <tr>
          <td colSpan={5}>
            <Mapshot map={map}>
              <div className="border-y border-gray-800 py-6">
                <DemoButtons address={address} demo={demo} />

                <div className="flex justify-center bg-gray-700/20 -mt-4">
                  <LastscoresScoreboard lastscores={lastscores} />
                </div>
              </div>
            </Mapshot>
          </td>
        </tr>
      )}
    </>
  );
};

const DemoButtons = ({ demo, address }) => {
  const demoUrls = toDemoUrls(demo, address);

  if (!demoUrls) {
    return <></>;
  }

  const links = [
    {
      url: demoUrls.download,
      icon: "download.svg",
      title: "Download demo",
    },
    {
      url: demoUrls.stream,
      icon: "play_arrow.svg",
      title: "Stream demo via QTV",
    },
  ];

  return (
    <div className="flex transition-opacity ml-2 -mt-4 space-x-1.5">
      {links.map((link) => (
        <a
          key={link.title}
          href={link.url}
          title={link.title}
          target="_top"
          className="p-1 rounded-full bg-gray-950 opacity-60 hover:opacity-100 "
        >
          <img
            src={`https://hub.quakeworld.nu/assets/img/icons/${link.icon}`}
            width={20}
            height={20}
          />
        </a>
      ))}
    </div>
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
      title="Show scores"
    >
      {text}
    </span>
  );
};
