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

export const calcServerRows = (meta, maxRows) => {
  const miscRowCount = meta.hasMatchtag + 2 * meta.showAsTwoColumns;
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);
  const playerRows = calcPlayerRows(meta, maxPlayerRows);

  return {
    maxRows,
    miscRowCount,
    maxPlayerRows,
    players: playerRows,
  };
};
