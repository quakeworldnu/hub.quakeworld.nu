import { themeBaseDefault } from "@/components/ui/buttons";
import { getFlagUrl } from "@/utils/flags";
import { isTwitchExtensionEmbedded } from "@/utils/twitch-embed";

const themeTwitch = {
  default: `${themeBaseDefault} from-violet-700/40 to-violet-900/40 hover:from-violet-700/80 hover:to-violet-900/80 border-violet-600/60`,
  hover:
    "hover:from-violet-700/80 hover:to-violet-900/80 hover:border-violet-500",
};

// extra highlighted streams (radomsko lan)
const themeHighlight = {
  default: `${themeBaseDefault} from-red-700/50 to-violet-900/50 border-red-500 ring-1 ring-red-500/40 shadow-red-900/40`,
  hover: "hover:from-red-600/80 hover:to-violet-800/80 hover:border-red-400",
};

type TwitchButtonProps = {
  label: string;
  login: string;
  title?: string;
  viewers?: number;
  className?: string;
  highlight?: boolean;
};

export const TwitchButton = (props: TwitchButtonProps) => {
  const {
    label,
    login,
    title = "",
    viewers = 0,
    className = "",
    highlight = false,
  } = props;
  const theme = highlight ? themeHighlight : themeTwitch;

  return (
    <a
      href={`https://www.twitch.tv/${login}`}
      title={title}
      rel="nofollow"
      target="_top"
      className={`items-center justify-center p-1 ${theme.default} ${theme.hover} ${className}`}
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
        {highlight && (
          <img
            src={getFlagUrl("pl")}
            alt="PL"
            className="inline h-3 w-auto mb-px"
          />
        )}
        <strong>{label}</strong>
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
