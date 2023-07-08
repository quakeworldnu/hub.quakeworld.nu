import React, { useEffect, useState } from "react";
import { useGetLastscoresQuery } from "@/services/hub/hub";
import classNames from "classnames";

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
        {isError && (
          <div className="my-4 text-gray-300 text-center">
            Error: unable to fetch lastscores
          </div>
        )}
        {isSuccess && 0 === data.length && (
          <div className="my-4 text-gray-300 text-center">
            no lastscores found
          </div>
        )}
        {isLoading && (
          <div className="my-4 text-gray-300 text-center">Loading...</div>
        )}

        {data && (
          <div className="max-h-[320px]">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-white">
                <tr className="border-b border-black/20">
                  <th className="p-1">timestamp</th>
                  <th className="p-1">mode</th>
                  <th className="p-1">participants</th>
                  <th className="p-1">map</th>
                  <th className="p-1">scores</th>
                  <th className="p-1">#</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lastscores, index) => (
                  <LastscoresRow
                    key={index}
                    lastscores={lastscores}
                    showScores={showAllScores}
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

const LastscoresRow = ({ lastscores, showScores = false }) => {
  const { timestamp, mode, participants, map, scores } = lastscores;

  return (
    <tr className="odd:bg-black/10 hover:bg-black/20">
      <td className="p-1">{timestamp}</td>
      <td className="p-1">{mode}</td>
      <td className="p-1">{participants}</td>
      <td className="p-1">{map}</td>
      <ScoresCell text={scores} showScores={showScores} />
      <td>asd</td>
    </tr>
  );
};

const ScoresCell = ({ text, showScores = false }) => {
  const [_showScores, setShowScores] = useState(showScores);

  useEffect(() => {
    setShowScores(showScores);
  }, [showScores]);

  return (
    <td
      className={classNames("p-1", {
        "cursor-pointer": !_showScores,
      })}
      onClick={() => setShowScores(true)}
    >
      <span
        className={classNames({ "blur-sm": !_showScores })}
        title="Reveal scores"
      >
        {text}
      </span>
    </td>
  );
};
