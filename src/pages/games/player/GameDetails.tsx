import { useQuery } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { getGame } from "../services/supabase/supabase.ts";
import { Game } from "../services/supabase/supabase.types.ts";

// demo player is only needed on game pages, keep it out of the games browser bundle
const loadDemoPlayer = () => import("./DemoPlayer.tsx");
const DemoPlayer = lazy(() =>
  loadDemoPlayer().then((m) => ({ default: m.DemoPlayer })),
);

export const GameDetails = ({ id }: { id: number }) => {
  const { data: game = null } = useQuery<Game | null>({
    queryKey: ["game", id],
    queryFn: ({ signal }) => getGame(id, signal),
    enabled: Boolean(id),
  });

  // fetch player code in parallel with game data
  useEffect(() => {
    if (id) {
      loadDemoPlayer();
    }
  }, [id]);

  if (!game) {
    return <div>Loading...</div>;
  } else if (!game.demo_sha256) {
    return <div>No demo available</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoPlayer game={game} demo_sha256={game.demo_sha256} />
    </Suspense>
  );
};
