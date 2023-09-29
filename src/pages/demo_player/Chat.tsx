import { FormEvent, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { GroupId, Message } from "../../../convex/schema.ts";
import { useUser } from "./hooks.ts";
import * as classNames from "classnames";

export function Chat() {
  const { user } = useUser();

  if (!user?.groupId) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Start or join a group to enable chat.
      </div>
    );
  }

  return (
    <>
      <ChatMessages groupId={user.groupId} />
    </>
  );
}

export function ChatMessages({ groupId }: { groupId: GroupId }) {
  const messages = useQuery(api.messages.list, { groupId: groupId });

  useEffect(() => {
    if (messages && messages?.length > 0) {
      document
        .getElementById("ChatMessages")
        ?.scrollTo({ top: 9999999, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div id="ChatMessages" className="h-full p-4 overflow-auto">
      {messages?.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const time = new Date(message._creationTime).toLocaleTimeString();

  return (
    <div className="flex items-center space-x-2 app-effect-fade-in">
      <span className="text-gray-400">{time}</span>
      <span className="text-gray-400">{message.name}</span>
      <span>{message.content}</span>
    </div>
  );
}

export function ChatInput() {
  const addMessage = useMutation(api.messages.add);
  const { user } = useUser();

  async function onSubmit(e: FormEvent) {
    if (!user?.groupId) {
      return;
    }

    e.preventDefault();
    const input = document.getElementById(
      "ChatMessageInput",
    ) as HTMLInputElement;
    const content = input.value.trim();

    if (content.length === 0) return;

    input.value = "";
    await addMessage({
      groupId: user.groupId,
      name: user.name,
      content,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={!user?.groupId}
        type="text"
        className={classNames(
          { hidden: !user?.groupId },
          "bg-white/5 border border-sky-200/20 w-full p-4 text-white",
        )}
        id="ChatMessageInput"
      />
    </form>
  );
}
