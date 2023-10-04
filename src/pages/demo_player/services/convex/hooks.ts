import { nanoid } from "nanoid";
import { useLocalStorage } from "usehooks-ts";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useEffect } from "react";
import { GroupId } from "../../../../../convex/schema.ts";

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

    console.log("updateUser()");
    updateUser();
  }, [uuid]);

  return uuid;
}

export function useUser() {
  // user
  const uuid = useUuid();
  const user = useQuery(api.users.getByUuid, { uuid });
  const join = useMutation(api.users.joinGroup);
  const leave = useMutation(api.users.leaveGroup);

  // groups
  const groupArgs = user?.groupId ? { id: user.groupId } : "skip";
  const group = useQuery(api.groups.get, groupArgs);
  const create = useMutation(api.groups.create);

  const createAndJoin = user?._id
    ? async () => {
        const newGroup = await create();

        if (newGroup !== null) {
          joinGroup(newGroup);
        }
      }
    : () => console.log("createAndJoin");

  const joinGroup = user?._id
    ? (groupId: GroupId) => join({ userId: user._id, groupId })
    : (groupId: GroupId) => console.log("join", groupId);

  const leaveGroup = user?._id
    ? () => leave({ userId: user._id })
    : () => console.log("leave");

  return {
    user,
    group,
    createGroup: createAndJoin,
    joinGroup,
    leaveGroup,
  };
}
