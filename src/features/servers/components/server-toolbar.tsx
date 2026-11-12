import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SearchInput } from "@/components/ui/search-input";
import { setServerSearch, useServerSearch } from "@/stores/settings";
import { RadomskoToggle } from "./radomsko-toggle";
import { SettingsToggleButton } from "./server-filters";
import { ServerListShowBar } from "./server-list-show-bar";
import { ServerPresentationBar } from "./server-presentation-bar";

// servers page filters (row below the site navigation)
export const ServerToolbar = () => {
  const search = useServerSearch();

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 -mt-1">
      <SearchInput
        icon={faMagnifyingGlass}
        title="Search hostname or player/spectator"
        className="w-56"
        value={search}
        onChange={setServerSearch}
      />
      <RadomskoToggle />
      <ServerListShowBar />
      <ServerPresentationBar />
      <SettingsToggleButton />
    </div>
  );
};
