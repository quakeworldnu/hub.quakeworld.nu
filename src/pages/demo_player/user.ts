import { nanoid } from "nanoid";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { User } from "../../../convex/schema.ts";
import { useEffect, useState } from "react";

export function useUser() {
  const [uuid, setUuid] = useLocalStorage<string>("uuid", nanoid());
  const [user, setUser] = useState<User | null>(null);
  const getOrCreate = useMutation(api.demoplayer_users.getOrCreate);

  useEffect(() => {
    async function run() {
      setUser(await getOrCreate({ uuid }));
    }

    run();
  }, [getOrCreate, uuid]);

  return {
    clearUser: () => setUuid(nanoid()),
    user,
    isLoading: user === null,
  };
}
