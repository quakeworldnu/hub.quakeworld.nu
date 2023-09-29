import { nanoid } from "nanoid";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export function useUuid() {
  const [uuid, setUuid] = useLocalStorage<string>("uuid", nanoid());
  const getOrCreate = useMutation(api.users.getOrCreate);

  useEffect(() => {
    async function updateUser() {
      const user = await getOrCreate({ uuid });

      if (user === null) {
        return;
      }

      setUuid(user.uuid);
    }

    updateUser();
  }, [getOrCreate, uuid, setUuid]);

  return uuid;
}

export function useUser() {
  const uuid = useUuid();
  const user = useQuery(api.users.getByUuid, { uuid });
  return { user };
}

export function useGroup() {
  const { user } = useUser();
  const groupArgs = user?.groupId ? { id: user.groupId } : "skip";
  const group = useQuery(api.groups.get, groupArgs);
  const join = useMutation(api.groups.join);
  const leave = useMutation(api.groups.leave);

  return {
    group,
    join: user?._id
      ? (code: string = "") => join({ userId: user._id, code })
      : (code: string = "") => console.log(code),
    leave: user?._id ? () => leave({ userId: user._id }) : () => {},
  };
}
