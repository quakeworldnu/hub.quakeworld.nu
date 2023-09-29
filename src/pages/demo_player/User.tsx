import { useUser } from "./hooks.ts";
import { FormEvent } from "react";

export const UserNameInput = () => {
  const { user } = useUser();

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    let value = target.value.trim();

    if ("" === value) {
      target.value = value = "Player";
    }

    console.log("TODO: update user name", value);
  }

  return (
    <div>
      <input
        type="text"
        disabled={user === null}
        defaultValue={user?.name ?? ""}
        className="bg-blue-950 text-white border border-white/10 p-2"
        onChange={onSubmit}
      />
    </div>
  );
};
