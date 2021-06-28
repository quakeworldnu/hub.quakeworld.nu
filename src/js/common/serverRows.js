const calcRows = (itemsPerRow, itemCount, maxRowCount) => {
  const total = Math.ceil(itemCount / itemsPerRow);
  const display = Math.min(maxRowCount, total);
  const hide = total - display;

  return {
    total,
    display,
    hide,
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
  const miscRows = meta.hasMatchtag + meta.showAsTwoColumns;

  const playerMaxRows = Math.max(0, maxRows - miscRows);
  const playerRows = calcPlayerRows(meta, playerMaxRows);

  const spectatorMaxRows = Math.max(0, playerMaxRows - playerRows.display);
  const spectatorRows = calcSpectatorRows(meta, spectatorMaxRows);

  return {
    maxRows,
    miscRows,
    playerMaxRows,
    playerRows,
    spectatorMaxRows,
    spectatorRows,
  };
};
