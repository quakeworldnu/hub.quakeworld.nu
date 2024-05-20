import { useMutation, useQuery } from "convex/react";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "../../../../../convex/_generated/api";
import type { GroupId, Playback } from "../../../../../convex/schema.ts";

export function useUuid() {
  const [id, setId] = useLocalStorage<string | null>("uuid", null);
  const getOrCreate = useMutation(api.users.getOrCreate);

  useEffect(() => {
    async function updateUser() {
      if (id === null) {
        const uuid = nanoid();
        console.log("new id!", uuid);
        setId(uuid);
        await getOrCreate({ uuid });
      }
    }

    updateUser();
  }, [id]);

  return id;
}

export function useUser() {
  // user
  const uuid = useUuid();
  const user = useQuery(api.users.getByUuid, { uuid });
  const userJoinGroup = useMutation(api.users.joinGroup);
  const usersLeaveGroup = useMutation(api.users.leaveGroup);

  // groups
  const groupArgs = user?.groupId ? { id: user.groupId } : "skip";
  const group = useQuery(api.groups.get, groupArgs);
  const groupsCreate = useMutation(api.groups.create);

  const createAndJoinGroup = user?._id
    ? async () => {
        const newGroup = await groupsCreate();

        if (newGroup !== null) {
          joinGroup(newGroup);
        }
      }
    : () => console.log("createAndJoinGroup");

  const joinGroup = user?._id
    ? (groupId: GroupId) => userJoinGroup({ userId: user._id, groupId })
    : (groupId: GroupId) => console.log("join", groupId);

  const leaveGroup = user?._id
    ? () => usersLeaveGroup({ userId: user._id })
    : () => console.log("leave");

  // playback
  const playbackArgs = user?.groupId ? { groupId: user.groupId } : "skip";
  const playback = useQuery(api.playback.getByGroupId, playbackArgs);
  const playbackCreate = useMutation(api.playback.create);
  const playbackUpdate = useMutation(api.playback.update);

  const createPlayback =
    user?._id && group?._id
      ? (props: {
          demo_jump: number;
          demo_setspeed: number;
          cl_autotrack: string;
          track: number;
        }) =>
          playbackCreate({
            groupId: group._id,
            updateUserId: user._id,
            ...props,
          })
      : () => console.log("createPlayback");

  const updatePlayback =
    user?._id && playback?._id
      ? (props: Partial<Playback>) => {
          props.updateUserId = user._id;
          playbackUpdate({ id: playback._id, props });
        }
      : (props: Partial<Playback>) => console.log("updatePlayback", props);

  return {
    user,
    group,
    playback,
    createPlayback,
    updatePlayback,
    createGroup: createAndJoinGroup,
    joinGroup,
    leaveGroup,
  };
}
