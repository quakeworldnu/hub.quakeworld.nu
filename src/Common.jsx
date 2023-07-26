import React from "react";

export function SvgIcon({ filename, size = 24 }) {
  return (
    <img
      src={`https://hub.quakeworld.nu/assets/img/icons/${filename}.svg`}
      width={size}
      height={size}
      className="fill-white text-white inline mr-2"
      alt=""
    />
  );
}

export function Heading({
  text = "",
  icon = "",
  iconSize = 24,
  color = "text-gray-400",
}) {
  return (
    <div className={`flex items-center font-bold mb-1 ${color}`}>
      {text && <SvgIcon filename={icon} size={iconSize} />} {text}
    </div>
  );
}
