export const themePrimary =
  "bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800";
export const themeSecondary =
  "bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700";
export const themeSuccess =
  "bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800";

const controlDisabled =
  "select-none transition-opacity disabled:opacity-60 disabled:cursor-not-allowed disabled:events-none";
const control = `flex items-center whitespace-nowrap cursor-pointer ${controlDisabled}`;

const btn = `${control} rounded text-slate-200 hover:text-white`;
export const btnPrimary = `${btn} ${themePrimary}`;
export const btnSecondary = `${btn} ${themeSecondary}`;
export const btnSuccess = `${btn} ${themeSuccess}`;

export const sizeSmall = "py-2 px-2.5 text-xs";
export const sizeLarge = "py-2.5 px-3 text-sm";

export const formInput =
  "inline-block py-2 px-3 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export const toggleBtn = `${control} space-x-1 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 first:rounded-l last:rounded-r`;
export const toggleBtnSelected =
  "text-white font-bold bg-gradient-to-b from-sky-700 to-sky-900";
