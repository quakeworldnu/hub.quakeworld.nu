import { useUser } from "./services/convex/hooks";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GroupId } from "../../../convex/schema";
import copyTextToClipboard from "copy-text-to-clipboard";
import { useRef } from "react";

export function UserInfo() {
  const { user, group, createGroup, leaveGroup, joinGroup } = useUser();
  const convex = useConvex();
  const codeErrorRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  async function onJoinGroup() {
    if (!codeErrorRef.current || !codeRef.current) {
      return;
    }
    const codeEl = codeRef.current;
    const code = codeEl.value.trim();
    const groupTojoin = await convex.query(api.groups.getByCode, { code });

    const errorEl = codeErrorRef.current;

    if (!groupTojoin) {
      errorEl.classList.add("bg-red-600");
      codeEl.focus();
    } else {
      errorEl.classList.remove("bg-red-600");
      joinGroup(groupTojoin._id as GroupId);
    }
  }

  if (!user) {
    return <div>loading..</div>;
  }
  return (
    <div className="space-y-2">
      <div>
        <strong>{user.name}</strong>{" "}
        <span className="font-mono text-xs">({user.uuid})</span>
      </div>
      <div>
        {!group && (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => createGroup()}
              className="py-1 px-2 text-sm rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer"
            >
              Create group
            </button>
            <div className="flex items-center">
              <div className="p-0.5 mr-1" ref={codeErrorRef}>
                <input
                  ref={codeRef}
                  type="text"
                  className="p-1 bg-neutral-800 text-white w-12 text-sm"
                  id="GroupCode"
                  maxLength={4}
                />
              </div>
              <button
                onClick={onJoinGroup}
                className="py-1 px-2 text-sm rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer"
              >
                Join group
              </button>
            </div>
          </div>
        )}
        {group && (
          <div className="flex items-center space-x-6">
            <input
              type="text"
              disabled
              className="inline-block w-16 text-center border border-white/30 px-1 py-0.5 font-mono text-lg select-auto cursor-text bg-slate-700 hover:bg-white/10"
              onClick={() => copyTextToClipboard(group.code)}
              title="Copy to clipboard"
              value={group.code}
            />
            <button
              onClick={() => leaveGroup()}
              className="py-1 px-2 text-sm rounded bg-blue-600/50 hover:bg-blue-600/80 cursor-pointer"
            >
              Leave group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
