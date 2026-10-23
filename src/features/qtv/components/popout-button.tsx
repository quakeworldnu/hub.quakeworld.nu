import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/fte-player/icon-button";
import { useFteController } from "@/lib/fte/hooks";
import { getSearchParam } from "@/utils/search-params";

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
