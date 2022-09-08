import { TextBlur } from "./TextAnimations";

const hoverClasses = "hover:from-blue-500 hover:to-blue-600 hover:border-blue-400"

export const PrimaryButton = props => {
  const { href = "#", children, className = "" } = props;

  return (
    <a href={href}
       className={`text-white shadow-md border border-blue-500 bg-gradient-to-b from-blue-600 to-blue-700 ${hoverClasses}  ${className}`}>
      {children}
    </a>
  )
}

export const TwitchButton = props => {
  const { channel, title, viewers, className = "" } = props;

  return (
    <a href={`https://www.twitch.tv/${channel}`}
       rel="nofollow"
       className={`text-white rounded-lg border border-violet-600/60 bg-gradient-to-b from-violet-700/40 to-violet-900/40 hover:from-violet-700/60 hover:to-violet-900/60 ${className}`}>
       <span className="whitespace-nowrap space-x-1">
        <img
          src={`/assets/img/icons/twitch_glitch_purple.svg`}
          width="16"
          height="16"
          className="inline"
        />
        <strong>{channel}</strong>
        <span className="text-gray-400 text-xs">(<TextBlur key="viewers" value={viewers} />)</span>
      </span>

      <div className="text-violet-200 text-sm mt-1 sm:max-w-[420px] truncate">
        <TextBlur key="title" value={title} />
      </div>
    </a>
  )
}

export const SpectatorButton = props => {
  const { href, children, count = 0 } = props;
  return (
    <a
      href={href}
      className={`p-1 flex items-center justify-center shadow-md w-full rounded text-white shadow-md border border-gray-600 bg-gradient-to-b from-gray-600 to-gray-700 ${hoverClasses}`}
    >
      {children}

      {count > 0 && (
        <span className="ml-1 text-gray-400 text-xs">
          ({count})
        </span>
      )}
    </a>
  )
}
