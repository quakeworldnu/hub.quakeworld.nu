import { isQwleagueOfficial } from "@/lib/qworld/server-utils";

export const QWLeagueBanner = ({
  matchtag = "",
  hostname = "",
  isLink = true,
}: {
  matchtag?: string | null;
  hostname?: string | null;
  isLink?: boolean; // false when inside another link (links can't be nested)
}) => {
  const showMatchtag = (matchtag ?? "").trim().length > 0;
  const matchtagColor = isQwleagueOfficial(hostname, matchtag)
    ? "bg-yellow-500"
    : "bg-red-600";

  return (
    <div className="flex items-stretch w-full bg-black/70 uppercase font-bold tracking-widest text-xs app-text-shadow">
      {showMatchtag && (
        <div
          className={`py-1.5 pl-2 sm:pl-3 pr-5 ${matchtagColor} [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)]`}
        >
          {matchtag}
        </div>
      )}
      {isLink ? (
        <a
          href="https://qwleague.com"
          target="_top"
          title="QWLeague"
          className="relative z-10 flex items-center ml-auto py-1.5 px-2 sm:px-3 text-[#999] hover:text-white transition-colors"
        >
          <QWLeagueLogo />
        </a>
      ) : (
        <div className="flex items-center ml-auto py-1.5 px-2 sm:px-3 text-[#999]">
          <QWLeagueLogo />
        </div>
      )}
    </div>
  );
};

const QWLeagueLogo = () => (
  <>
    <img
      src="/assets/img/qwleague_logo.svg"
      alt="qwleague"
      className="h-4 w-auto mr-[5px]"
    />
    QWLeague.com
  </>
);
