import classNames from "classnames";

const regions = ["All", "Europe", "North America", "South America", "Australia"];

// Theme constants matching the games page
const sizeSmall = "py-2 px-2.5 text-xs";
const controlDisabled = "select-none transition-opacity disabled:opacity-60 disabled:cursor-not-allowed disabled:events-none";
const control = `flex items-center whitespace-nowrap cursor-pointer ${controlDisabled}`;
const toggleBtn = `${control} space-x-1 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 first:rounded-l last:rounded-r`;
const toggleBtnSelected = "text-white font-bold bg-gradient-to-b from-sky-700 to-sky-900";

export const RegionFilter = ({ region, setRegion }) => {
  return (
    <div className="flex items-center space-x-px">
      {regions.map((r) => (
        <div
          key={r}
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]: region === r,
          })}
          onClick={() => setRegion(r)}
        >
          {r}
        </div>
      ))}
    </div>
  );
};