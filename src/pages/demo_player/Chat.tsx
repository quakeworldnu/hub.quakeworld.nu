import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FormEvent, useEffect } from "react";

export function ChatMessages() {
  const messages = useQuery(api.demoplayer_chats.list);

  useEffect(() => {
    if (messages && messages?.length > 0) {
      document
        .getElementById("ChatMessages")
        ?.scrollTo({ top: 9999999, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div id="ChatMessages" className="p-4 max-h-[60vh] overflow-auto">
      {messages?.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  );
}

function ChatMessage({ message }) {
  const time = new Date(message._creationTime).toLocaleTimeString();

  return (
    <div className="flex items-center space-x-2 app-effect-fade-in">
      <span className="text-gray-400">{time}</span>
      <span className="text-gray-400">{message.author}</span>
      <span>{message.content}</span>
    </div>
  );
}

export function ChatInput() {
  const addMessage = useMutation(api.demoplayer_chats.add);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const input = document.getElementById(
      "ChatMessageInput",
    ) as HTMLInputElement;
    const content = input.value;
    input.value = "";
    await addMessage({ author: "vikpe", content });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="bg-white/10 border border-red-400 w-full p-4 text-white"
        id="ChatMessageInput"
      />
    </form>
  );
}
