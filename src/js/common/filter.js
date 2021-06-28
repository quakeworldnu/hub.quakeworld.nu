export const filterServers = (servers, filters, favoriteServers) => {
  let result = filterByQuery(servers, filters.query);

  if (filters.isFavorite) {
    result = result.filter((s) => favoriteServers.includes(s.Address));
  }

  if (filters.isStarted) {
    result = result.filter((s) => s.meta.isStarted);
  }

  if (filters.regionName) {
    result = result.filter((s) => s.meta.regionName === filters.regionName);
  }

  return result;
};

export const filterByQuery = (servers, query) => {
  const minQueryLength = 2;

  if (query.length < minQueryLength) {
    return servers;
  }

  const queryWords = query.toLowerCase().split(" ");
  const keywordFilterFunc = (server) => {
    return queryWords.every((word) => {
      return server.meta.keywords.indexOf(word) !== -1;
    });
  };
  return servers.filter(keywordFilterFunc);
};

const isBot = (p) => p.IsBot || p.Name.toLowerCase().includes("[serveme]");
const isSpectatingBot = (client) => isBot(client) && client.Spec;

export const ignoreSpectatingBots = (clients) =>
  clients.filter((c) => !isSpectatingBot(c));
