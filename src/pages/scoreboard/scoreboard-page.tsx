import { ServerBody } from "@/features/servers/components/server";
import { useServer } from "@/lib/qworld/queries";

export const App = () => {
  const address = new URLSearchParams(location.search).get("address") ?? "";
  // embedded page: keep polling while hidden
  const { data: server, isSuccess } = useServer(address, {
    interval: 5000,
    inBackground: true,
  });

  return (
    <div className="h-[400px] max-w-[480px]">
      {isSuccess && <ServerBody server={server} />}
      {!isSuccess && "Server has no players."}
    </div>
  );
};

export default App;
