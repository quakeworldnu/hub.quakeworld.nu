export function setSearchParam(key: string, value: string) {
  const params = getSearchParams();

  if (params.get(key) === value) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState(null, "", url);
}

export function getSearchParam(key: string): string | null {
  return getSearchParams().get(key);
}

export function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}
