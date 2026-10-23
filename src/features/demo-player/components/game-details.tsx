import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { getGame } from "@/lib/supabase/games";
import type { Game } from "@/lib/supabase/types";

// demo player is only needed on game pages, keep it out of the games browser bundle
const loadDemoPlayer = () => import("./demo-player");
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
