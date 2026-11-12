import { faBars, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { useServerPresentation } from "@/features/servers/hooks/use-server-presentation";

export const ServerPresentationBar = () => {
  const [presentation, setPresentation] = useServerPresentation();

  return (
    <ToggleGroup
      value={presentation}
      onChange={setPresentation}
      options={[
        {
          value: "grid",
          title: "Display as grid",
          label: (
            <>
              <FontAwesomeIcon fixedWidth icon={faTableCells} />
              <span>Grid</span>
            </>
          ),
        },
        {
          value: "list",
          title: "Display as list",
          label: (
            <>
              <FontAwesomeIcon fixedWidth icon={faBars} />
              <span>List</span>
            </>
          ),
        },
      ]}
    />
  );
};
