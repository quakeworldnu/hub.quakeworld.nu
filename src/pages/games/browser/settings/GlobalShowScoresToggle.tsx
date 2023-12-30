import { useLocalStorage } from "usehooks-ts";
import { Switch } from "../../ui/Switch.tsx";

export const GlobalShowScoresToggle = () => {
  const [showScores, setShowScores] = useLocalStorage<boolean>(
    "demoBrowserShowScores",
    false,
  );

  function handleClick() {
    setShowScores(!showScores);
  }

  return (
    <div className="text-sm">
      <Switch
        label={"Show scores"}
        enabled={showScores}
        onClick={handleClick}
      />
    </div>
  );
};
