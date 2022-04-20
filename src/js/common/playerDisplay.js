export const calcPlayerDisplay = (meta, maxRows) => {
  const miscRowCount = meta.hasMatchtag + 2 * meta.showAsTwoColumns;
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);

  const playersPerRow = meta.showAsTwoColumns ? 2 : 1;
  const totalPlayerRows = Math.ceil(meta.playerCount / playersPerRow);
  const visiblePlayerRows = Math.min(maxPlayerRows, totalPlayerRows);

  const visiblePlayers = Math.min(
    meta.playerCount,
    visiblePlayerRows * playersPerRow
  );
  const hiddenPlayers = meta.playerCount - visiblePlayers;

  return {
    visible: visiblePlayers,
    hidden: hiddenPlayers,
  };
};
