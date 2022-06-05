import { regions } from "./../../data/regions.js";

export const filterServers = (servers, filters, favorites) => {
  let result = filterServersByQuery(servers, filters.query);

  if (filters.isFavorite) {
    result = result.filter((s) => favorites.includes(s.Address));
  }

  if (filters.isStarted) {
    result = result.filter((s) => s.meta.isStarted);
  }

  if (filters.regionName) {
    if ("Undefined" === filters.regionName) {
      result = result.filter((s) => "" === s.Geo.Region);
    } else {
      const regionCountryCodes = regions[filters.regionName];
      result = result.filter((s) => regionCountryCodes.includes(s.Geo.CC));
    }
  }

  return result;
};

const filterServersByQuery = (servers, query) => {
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
