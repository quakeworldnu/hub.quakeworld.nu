const calcRows = (itemsPerRow, itemCount, maxRowCount) => {
  const rowsTotal = Math.ceil(itemCount / itemsPerRow);
  const rowsVisible = Math.min(maxRowCount, rowsTotal);

  const itemsVisible = Math.min(itemCount, rowsVisible * itemsPerRow);
  const itemsHidden = itemCount - itemsVisible;

  return {
    rowsVisible,
    itemsHidden,
    itemsVisible,
  };
};

const calcPlayerRows = (serverMeta, maxRowCount) => {
  const playersPerRow = serverMeta.showAsTwoColumns ? 2 : 1;
  return calcRows(playersPerRow, serverMeta.playerCount, maxRowCount);
};

const calcSpectatorRows = (serverMeta, maxRows) => {
  const spectatorsPerRow = 2;
  return calcRows(spectatorsPerRow, serverMeta.spectatorCount, maxRows);
};

export const calcServerRows = (meta, maxRows) => {
  const miscRowCount = meta.hasMatchtag + 2 * meta.showAsTwoColumns;

  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);
  const playerRows = calcPlayerRows(meta, maxPlayerRows);

  const maxSpectatorRows = Math.max(0, maxPlayerRows - playerRows.rowsVisible);
  const spectatorRows = calcSpectatorRows(meta, maxSpectatorRows);

  return {
    maxRows,
    miscRowCount,
    maxPlayerRows,
    players: playerRows,
    maxSpectatorRows,
    spectators: spectatorRows,
  };
};
