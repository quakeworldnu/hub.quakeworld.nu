import React, { useState } from "react";
import { useGetLastscoresQuery } from "@/services/hub/hub";
import classNames from "classnames";

export const Lastscores = ({ address, onClose }) => {
  const { data, isLoading, isSuccess, isError } =
    useGetLastscoresQuery(address);

  return (
    <div className="text-xs h-full">
      <div
        className="p-2 bg-black/50 shadow flex items-center cursor-pointer hover:bg-black/70"
        onClick={onClose}
      >
        <img
          src="/assets/img/icons/chevron_forward.svg"
          alt=""
          width={12}
          height={12}
          className="mr-1 rotate-180"
        />
        <div>Back to scoreboard</div>
      </div>
      <div className="h-full max-h-[214px] overflow-y-auto">
        {isError && (
          <div className="h-full">Error: unable to fetch lastscores</div>
        )}
        {isSuccess && 0 === data.length && (
          <div className="flex h-full items-center justify-center text-gray-300">
            <div>no lastscores found</div>
          </div>
        )}
        {isLoading && (
          <div className="flex h-full items-center justify-center text-gray-300">
            Loading...
          </div>
        )}
        {data && (
          <div className="p-2">
            {data.map((d, index) => (
              <Result key={index} title={d.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Result = ({ title }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const parts = title.split(" ");
  const result = parts.slice(-1);
  const allButResult = parts.slice(0, parts.length - 1).join(" ");

  return (
    <div
      className="py-0.5 cursor-pointer hover:text-red-400"
      onClick={() => setIsRevealed(true)}
    >
      {allButResult}: <Spoiler text={result} isRevealed={isRevealed} />
    </div>
  );
};

const Spoiler = ({ text, isRevealed }) => {
  return <span className={classNames({ "blur-sm": !isRevealed })}>{text}</span>;
};
