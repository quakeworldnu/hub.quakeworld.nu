export const calcPlayerDisplay = (server, maxRows) => {

  const showAsTwoColumns = "1on1" === server.Mode || 2 === server.Teams.length;

  const miscRowCount = Number("matchtag" in server.Settings) + 2 *
    showAsTwoColumns;
  const maxPlayerRows = Math.max(0, maxRows - miscRowCount);

  const playersPerRow = showAsTwoColumns ? 2 : 1;
  const totalPlayerRows = Math.ceil(server.PlayerSlots.Used / playersPerRow);
  const visiblePlayerRows = Math.min(maxPlayerRows, totalPlayerRows);

  const visiblePlayers = Math.min(
    server.PlayerSlots.Used,
    visiblePlayerRows * playersPerRow
  );
  const hiddenPlayers = server.PlayerSlots.Used - visiblePlayers;

  return {
    visible: visiblePlayers,
    hidden: hiddenPlayers,
  };
};
