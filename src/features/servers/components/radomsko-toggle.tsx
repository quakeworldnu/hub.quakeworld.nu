import { Switch } from "@/components/ui/switch";
import { useRadomskoFilter } from "@/features/servers/hooks/use-radomsko-filter";
import { getFlagUrl } from "@/utils/flags";

export const RadomskoToggle = () => {
  const [enabled, setEnabled] = useRadomskoFilter();

  return (
    <div className="text-sm">
      <Switch
        label={
          <span className="flex items-center">
            <img
              src={getFlagUrl("pl")}
              alt="PL"
              className="inline h-3 w-auto mr-1.5"
            />
            Radomsko
          </span>
        }
        title="Only show servers at the Radomsko LAN (play.qwlan.pl)"
        enabled={enabled}
        onClick={() => setEnabled(!enabled)}
      />
    </div>
  );
};
