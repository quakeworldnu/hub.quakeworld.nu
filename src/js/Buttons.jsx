import React from "react";
import { TextBlur } from "./TextAnimations";

const themeBaseDefault = "text-white rounded shadow-md border bg-gradient-to-b"

const themePrimary = {
  default: `${themeBaseDefault} from-blue-600 to-blue-700 border-blue-500`,
  hover: "hover:from-blue-500 hover:to-blue-600 hover:border-blue-400",
};

const themeTwitch = {
  default: `${themeBaseDefault} from-violet-700/40 to-violet-900/40 hover:from-violet-700/80 hover:to-violet-900/80 border-violet-600/60`,
  hover: "hover:from-violet-700/80 hover:to-violet-900/80 hover:border-violet-500",
}

const themeSecondary = {
  default: `${themeBaseDefault} from-gray-600 to-gray-700 border-gray-600`,
  hover: themePrimary.hover
}

export const PrimaryButton = React.memo(props => {
  const { href = "#", children, className = "" } = props;

  return (
    <a href={href} className={`${themePrimary.default} ${themePrimary.hover} ${className}`}>{children}</a>
  )
});

export const SecondaryButton = React.memo(props => {
  const { href, children, count = 0, className = "" } = props;
  return (
    <a
      href={href}
      className={`flex items-center justify-center p-1 ${themeSecondary.default} ${themeSecondary.hover} ${className}`}
    >
      {children}

      {count > 0 && (
        <span className="ml-1 text-gray-400 text-xs">
          ({count})
        </span>
      )}
    </a>
  )
});

export const TwitchButton = React.memo(props => {
  const { channel = "", title = "", viewers = 0, className = "" } = props;

  return (
    <a href={`https://www.twitch.tv/${channel}`}
       title={title}
       rel="nofollow"
       className={`items-center justify-center p-1 ${themeTwitch.default} ${themeTwitch.hover} ${className}`}>
       <span className="whitespace-nowrap space-x-1">
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16" height="16"
          className="inline"
        />
        <strong>{channel}</strong>
         {
           (viewers > 0) && (
             <span className="text-gray-400 text-xs">(<TextBlur key="viewers" value={viewers} />)</span>
           )
         }
      </span>

      {
        (title.length > 0) && (
          <div className="text-violet-200 text-xs mt-0.5 sm:max-w-[420px] truncate">
            <TextBlur key="title" value={title} />
          </div>
        )
      }
    </a>
  )
});

