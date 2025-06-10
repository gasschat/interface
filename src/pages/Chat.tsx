import { useLocation, useNavigate } from "react-router";
import { useChat } from "@ai-sdk/react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserInput } from "@/components/app/userInput";
import { useEffect } from "react";
import { api } from "@/lib/baseUrl";
import type { Message } from "@ai-sdk/react";


// Message component for chat
const Message = ({ id, role, content }: Message) => {
  console.log(id)

  return (
    <div className={`px-4 py-3`}>
      <div className="max-w-lg mx-auto flex gap-4">
        <div
          className={`h-6 w-6 rounded-[13px] flex items-center justify-center shrink-0 ${
            role === "user"
              ? "bg-gray-200"
              : "bg-gradient-to-br from-pink-400 to-yellow-400"
          }`}
        >
          {role === "user" ? "U" : "A"}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-md font-light">{content}</p>
        </div>
      </div>
    </div>
  );
};


// Main layout component
export const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    streamProtocol:"data",
    api:`${api}/ai/generate`
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { pathname, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function appendUserInput() {
      const isNewPage = pathname.split("/")[2] === "new";
      if (isNewPage) {
        const newState = state as { chat?: string } | undefined;
        if (newState) {
          const userInput = newState.chat!;
          await append({ role: "user", content: userInput });
        }
        await navigate(pathname, {replace:true})
      }
    }

    appendUserInput().catch((err)=>console.log("error while appending", err))
  }, []);

  console.log(messages)

  return (
    <div className="flex items-stretch h-[calc(100vh-76px)]">
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 max-w-full`}>
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 h-[26rem] w-full">
            {messages.map((message) => (
          <Message 
            key={message.id} 
            id={message.id}
            role={message.role} 
            content={message.content} 
          />
        ))}

            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div className="py-2 px-3">
            <div className="w-full max-w-xl place-self-center">
              <UserInput
                handleChatSubmit={handleSubmit}
                handleChatInputChange={handleInputChange}
                chatInput={input}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
