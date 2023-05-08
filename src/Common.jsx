import React from "react";

export function SvgIcon({ filename, size = 24 }) {
  return (
    <img
      src={`/assets/img/icons/${filename}.svg`}
      width={size}
      height={size}
      className="fill-white text-white inline mr-2"
      alt=""
    />
  );
}

export function Heading({ text = "", icon = "" }) {
  return (
    <div className="flex items-center font-bold mb-2 text-gray-400">
      {text && <SvgIcon filename={icon} />} {text}
    </div>
  );
}
