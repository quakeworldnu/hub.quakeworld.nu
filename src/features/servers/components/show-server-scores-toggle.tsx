import { Switch } from "@/components/ui/switch";
import { useShowServerScores } from "@/features/servers/hooks/use-show-server-scores";

export const ShowServerScoresToggle = () => {
  const [showScores, setShowScores] = useShowServerScores();

  return (
    <div className="text-sm">
      <Switch
        label={"Show scores"}
        enabled={showScores}
        onClick={() => setShowScores(!showScores)}
      />
    </div>
  );
};
