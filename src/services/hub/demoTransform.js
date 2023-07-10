export function transformDemos(demos = []) {
  return demos.map((d) => ({
    ...d,
    ...parseDemoFilename(d.filename),
  }));
}

const parseDemoFilename = (filename) => {
  // duel_rasta_vs_igggy[aerowalk]311022-2051.mvd

  const mode = filename.substring(0, filename.indexOf("_"));
  const participants = filename
    .substring(1 + mode.length, filename.lastIndexOf("["))
    .replaceAll("_", " ");
  const map = filename.substring(
    2 + participants.length + mode.length,
    filename.lastIndexOf("]"),
  );

  return {
    mode,
    participants,
    map,
  };
};
