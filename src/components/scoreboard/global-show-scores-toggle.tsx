import { Switch } from "@/components/ui/switch";
import { useShowScores } from "@/hooks/use-show-scores";

export const GlobalShowScoresToggle = () => {
  const [showScores, setShowScores] = useShowScores();

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
