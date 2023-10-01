import { useGroup } from "@qwhub/pages/demo_player/services/convex/hooks";
import copyTextToClipboard from "copy-text-to-clipboard";
import React from "react";

export function GroupInfo() {
  const { group, join, leave } = useGroup();
  const onCreateGroup = async () => await join();
  const onLeaveGroup = async () => await leave();

  async function onJoinGroup() {
    const code = document.getElementById("GroupCode").value.trim();
    await join(code);
  }

  return (
    <div>
      <div>
        <strong>Group</strong>
      </div>

      {!group && (
        <div className="flex items-center space-x-6">
          <button onClick={onCreateGroup} className="p-2 border">
            Create group
          </button>
          <div className="flex items-center">
            <input
              type="text"
              className="border p-2 bg-black text-white"
              id="GroupCode"
            />
            <button onClick={onJoinGroup} className="p-2 border">
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
            className="inline-block w-16 text-center border border-white/30 px-2 py-1 font-mono text-xl cursor-text bg-black hover:bg-white/10"
            onClick={() => copyTextToClipboard(group.code)}
            title="Copy to clipboard"
            value={group.code}
          />
          <button onClick={onLeaveGroup} className="border p-2">
            Leave group
          </button>
        </div>
      )}
    </div>
  );
}
