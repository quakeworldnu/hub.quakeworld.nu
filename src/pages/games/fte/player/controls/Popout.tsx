import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useFteController } from "@qwhub/pages/games/fte/hooks.ts";
import { getSearchParam } from "@qwhub/pages/qtv/url";
import { IconButton } from "./IconButton.tsx";

export const PopoutButton = () => {
  const fte = useFteController();

  function handleClick() {
    const address = getSearchParam("address");

    if (address) {
      document.location.href = `/qtv-popout/?address=${address}`;
    }
  }

  if (!fte) {
    return null;
  }

  return (
    <IconButton
      onClick={handleClick}
      title={"Popout player"}
      icon={faExternalLink}
    />
  );
};
