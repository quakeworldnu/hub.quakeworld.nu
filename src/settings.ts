import {
  getInitialServerFilters,
  type ServerFilters,
} from "@qwhub/serverFilters";
import { localStorageSet } from "@qwhub/util";
import { useSyncExternalStore } from "react";

// app settings (per page load), server filters are persisted in local storage
type Settings = {
  showSettings: boolean;
  serverFilters: ServerFilters;
};

let settings: Settings = {
  showSettings: false,
  serverFilters: getInitialServerFilters(),
};
const listeners = new Set<() => void>();

function update(changes: Partial<Settings>) {
  settings = { ...settings, ...changes };
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useShowSettings(): boolean {
  return useSyncExternalStore(subscribe, () => settings.showSettings);
}

export function useServerFilters(): ServerFilters {
  return useSyncExternalStore(subscribe, () => settings.serverFilters);
}

export function setShowSettings(showSettings: boolean) {
  update({ showSettings });
}

export function setServerFilters(serverFilters: ServerFilters) {
  localStorageSet("serverFilters", Object.assign({}, serverFilters));
  update({ serverFilters });
}
