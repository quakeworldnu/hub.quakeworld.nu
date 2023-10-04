import { FormEvent, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { GroupId, Message } from "../../../convex/schema.ts";
import { useUser } from "./services/convex/hooks.ts";
import classNames from "classnames";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Chat() {
  const { user } = useUser();
  const membersArgs = user?.groupId ? { id: user.groupId } : "skip";
  const members = useQuery(api.groups.members, membersArgs) || [];

  if (!user?.groupId) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Start or join a group to enable chat.
      </div>
    );
  }

  return (
    <>
      <div className="bg-black/40 border-b border-white/10 p-3 text-xs">
        <span className="mr-2">
          <FontAwesomeIcon icon={faUsers} />
        </span>
        {members.map((m) => m.name).join(", ")}
      </div>
      <div className="flex flex-col h-full">
        <ChatMessages groupId={user.groupId} />
        <ChatInput />
      </div>
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
  const time = formatTime(message._creationTime);

  return (
    <div className="flex items-center space-x-2 app-effect-fade-in text-sm">
      <span className="text-gray-400 text-xs">{time}</span>
      <span className="text-sky-200 font-bold">{message.name}:</span>
      <span>{message.content}</span>
    </div>
  );
}

function formatTime(time: number) {
  const format = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: "UTC",
  });

  return format.format(new Date(time));
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
