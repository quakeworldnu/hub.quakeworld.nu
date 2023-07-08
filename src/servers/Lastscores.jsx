import React, { useEffect, useState } from "react";
import { useGetLastscoresQuery } from "@/services/hub/hub";
import classNames from "classnames";
import { LastscoresScoreboard } from "@/servers/LastscoresScoreboard";

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
        {data && !showAllScores && (
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

        {data && (
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-white">
                <tr className="border-b border-black/20">
                  <th className="p-1">timestamp</th>
                  <th className="p-1">mode</th>
                  <th className="p-1">participants</th>
                  <th className="p-1">map</th>
                  <th className="p-1">scores</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lastscores, index) => (
                  <LastscoresRow
                    key={index}
                    lastscores={lastscores}
                    showAllScores={showAllScores}
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

const LastscoresRow = ({ lastscores, showAllScores = false }) => {
  const { timestamp, mode, participants, map, scores } = lastscores;
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
          <td colSpan={5}>
            <LastscoresScoreboard lastscores={lastscores} />
          </td>
        </tr>
      )}
    </>
  );
};

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
