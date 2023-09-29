import { useUser } from "@qwhub/pages/demo_player/hooks";
import { UserNameInput } from "@qwhub/pages/demo_player/User";
import React from "react";

export function UserInfo() {
  const { user } = useUser();

  if (!user) {
    return <div>loading..</div>;
  }
  return (
    <div>
      <div>
        <strong>User</strong>
      </div>
      <div>
        <UserNameInput /> [{user.uuid}]
      </div>
    </div>
  );
}
