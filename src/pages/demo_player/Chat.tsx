import { FormEvent, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import type { ChatMessage, User } from "../../../convex/schema.ts";

export function Chat() {
  const [userObj] = useLocalStorage<User | null>("demoplayer_user", null);

  if (userObj === null) {
    return (
      <div className="p-4 text-gray-400 text-sm">
        Start a group session to enable chat.
      </div>
    );
  }

  return (
    <>
      <ChatMessages
        sessionId={userObj.sessionId as Id<"demoplayer_sessions">}
      />
    </>
  );
}

export function ChatMessages({
  sessionId,
}: {
  sessionId: Id<"demoplayer_sessions">;
}) {
  const messages = useQuery(api.demoplayer_chats.list, { sessionId });

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

function ChatMessage({ message }: { message: ChatMessage }) {
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
  const addMessage = useMutation(api.demoplayer_chats.add);
  const [sessionIdStr] = useLocalStorage<string>("demoplayer_session_id", "");
  const [userObj] = useLocalStorage<User | null>("demoplayer_user", null);

  async function onSubmit(e: FormEvent) {
    if ("" === sessionIdStr) {
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
      sessionId: sessionIdStr as Id<"demoplayer_sessions">,
      name: userObj?.name || "Anonymous",
      content,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={!sessionIdStr}
        type="text"
        className="bg-white/5 border border-sky-200/20 w-full p-4 text-white"
        id="ChatMessageInput"
      />
    </form>
  );
}
