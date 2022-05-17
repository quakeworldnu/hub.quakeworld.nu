export const filterServers = (servers, filters, favoriteServers) => {
  let result = filterServersByQuery(servers, filters.query);

  if (filters.isFavorite) {
    result = result.filter((s) => favoriteServers.includes(s.Address));
  }

  if (filters.isStarted) {
    result = result.filter((s) => s.meta.isStarted);
  }

  if (filters.regionName) {
    result = result.filter((s) => s.Geo.Region === filters.regionName);
  }

  return result;
};

export const filterServersByQuery = (servers, query) => {
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
