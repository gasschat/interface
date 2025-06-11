import { useEffect, useRef} from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { useChat } from "@ai-sdk/react";
import type { MessageProps } from "@/lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "@/lib/baseUrl";
import { UserInput } from "@/components/app/userInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";
import { getChatHistory } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";

const Message = ({ message, isStreaming }: MessageProps) => {
  return (
    <div className={`px-4 py-3`}>
      <div className="max-w-xl mx-auto flex gap-4">
        <div
          className={`h-6 w-6 rounded-[13px] flex items-center justify-center shrink-0 ${
            message.role === "user"
              ? "bg-gray-200"
              : "bg-gradient-to-br from-pink-400 to-yellow-400"
          }`}
        >
          {message.role === "user" ? "U" : "A"}
        </div>
        <div className="flex flex-col gap-4">
          {message.role === "assistant" ? (
            <div className="leading-relaxed flex flex-col gap-4">
               <Markdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </Markdown>
            {isStreaming&&(
              <span className="block h-2 w-2 bg-accent-foreground"></span>
            )}
            </div>
          ) : (
            <p className="text-md font-light leading-relaxed ">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main layout component
export const Chat = () => {
  const cId = useParams()
  const navigate = useNavigate();
  const location = useLocation();

  const { data: session, isPending } = useSession();
  // move to layout
  useEffect(() => {
    const ff = async()=>{
     if (!isPending && !session?.user) {
      await navigate("/login")}
    }
    ff().catch(console.log)
  }, [isPending, session, navigate]);

  if(!cId.chatId){
    const nv  = async() => await navigate("/not-found")
    nv().catch((err)=>console.log(err))
  }
  const {trigger:fetchTheChatHis, data:chatHis, isMutating: isFetchingChatHistory} = useSWRMutation(`${api}/ai/thread/${cId.chatId}`,  getChatHistory)

  const { messages, input, handleInputChange, handleSubmit, append, status} =
    useChat({
      streamProtocol: "data",
      api: `${api}/ai/generate`,
      id:cId.chatId,
      initialMessages:chatHis || [],
      sendExtraMessageFields:true,
      credentials:"include"
    });
  const scrollRef = useRef<HTMLDivElement>(null);

  // 
  useEffect(() => {
    async function appendUserInput() {
        const newState = location.state as { chat?: string } | undefined;
        if (newState) {
          const userInput = newState.chat!;
          await navigate(location.pathname, { replace: true });
          await append({ role: "user", content: userInput });
          return;
        }
        fetchTheChatHis().catch(console.log)
      
    }

    appendUserInput().catch((err) => console.log("error while appending", err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className="flex items-stretch h-[calc(100vh-76px)]">
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 max-w-full`}>
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 h-[26rem] w-full">
            {messages.map((message, index) => {
              const isLastAssistantMessage =
                index === messages.length - 1 &&
                message.role === "assistant" &&
                status === "streaming";

              return (
                <Message
                  key={message.id}
                  message={message}
                  isStreaming={isLastAssistantMessage}
                />
              );
            })}

            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div className="py-2 px-3">
            <div className="w-full max-w-xl place-self-center">
              <UserInput
                handleChatSubmit={handleSubmit}
                handleChatInputChange={handleInputChange}
                chatInput={input}
                disable={!isFetchingChatHistory && status==="streaming"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
