import { useEffect, useState } from "react";
import { getGame } from "../services/supabase/supabase.ts";
import { Game } from "../services/supabase/supabase.types.ts";
import { DemoPlayer } from "./DemoPlayer.tsx";

export const GameDetails = ({ id }: { id: number }) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

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

  return <DemoPlayer game={game} demo_sha256={game.demo_sha256} />;
};
