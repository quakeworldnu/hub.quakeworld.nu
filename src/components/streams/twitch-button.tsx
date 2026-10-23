import { themeBaseDefault } from "@/components/ui/buttons";
import { isTwitchExtensionEmbedded } from "@/utils/twitch-embed";

const themeTwitch = {
  default: `${themeBaseDefault} from-violet-700/40 to-violet-900/40 hover:from-violet-700/80 hover:to-violet-900/80 border-violet-600/60`,
  hover:
    "hover:from-violet-700/80 hover:to-violet-900/80 hover:border-violet-500",
};

type TwitchButtonProps = {
  channel?: string;
  login?: string;
  title?: string;
  viewers?: number;
  className?: string;
};

export const TwitchButton = (props: TwitchButtonProps) => {
  const {
    channel = "",
    login = channel,
    title = "",
    viewers = 0,
    className = "",
  } = props;

  return (
    <a
      href={`https://www.twitch.tv/${login}`}
      title={title}
      rel="nofollow"
      target="_top"
      className={`items-center justify-center p-1 ${themeTwitch.default} ${themeTwitch.hover} ${className}`}
    >
      <span className="whitespace-nowrap space-x-1">
        {!isTwitchExtensionEmbedded() && (
          <img
            src={
              "https://hub.quakeworld.nu/assets/img/icons/twitch_glitch_purple.svg"
            }
            width="16"
            height="16"
            className="inline"
          />
        )}
        <strong>{channel}</strong>
        {viewers > 0 && (
          <span className="text-gray-400 text-xs">({viewers})</span>
        )}
      </span>

      {title.length > 0 && (
        <div className="text-violet-200 text-xs mt-0.5 sm:max-w-[420px] truncate">
          {title}
        </div>
      )}
    </a>
  );
};
