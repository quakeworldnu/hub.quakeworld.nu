import { Suspense, lazy, useEffect, useState } from "react";
import { getGame } from "../services/supabase/supabase.ts";
import { Game } from "../services/supabase/supabase.types.ts";

// demo player is only needed on game pages, keep it out of the games browser bundle
const loadDemoPlayer = () => import("./DemoPlayer.tsx");
const DemoPlayer = lazy(() =>
  loadDemoPlayer().then((m) => ({ default: m.DemoPlayer })),
);

export const GameDetails = ({ id }: { id: number }) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    // fetch player code in parallel with game data
    loadDemoPlayer();

    async function init() {
      setGame(await getGame(id));
    }

    init();
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
