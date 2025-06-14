import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { useChat, type Message } from "@ai-sdk/react";
import type { ConnectedClients, MessageProps } from "@/lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "@/lib/baseUrl";
import { UserInput } from "@/components/app/userInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";
import { getChatHistory, getConnectedClients } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { v4 as uuid4 } from "uuid";

import { extractJsonFromStream } from "@/lib/utils";
import { db } from "@/local-db/db";

const Message = ({ id, message, isStreaming }: MessageProps) => {
  return (
    <div className={`px-4 py-3`} key={id}>
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
              <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
              {isStreaming && (
                <span className="block h-2 w-2 bg-accent-foreground"></span>
              )}
            </div>
          ) : (
            <p className="text-md font-light leading-relaxed ">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main layout component
export const Chat = () => {
  const cId = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clientId = useRef<string | null>(null);

  const { data: session, isPending } = useSession();
  const primaryConnectedClient = useRef<ConnectedClients>({});
  const { trigger: fetchConnectedClients } = useSWRMutation(
    `${api}/ai/connected-clients`,
    getConnectedClients
  );

  // move to layout
  useEffect(() => {
    const ff = async () => {
      if (!isPending && !session?.user) {
        await navigate("/login");
      }
    };
    ff().catch(console.log);
  }, [isPending, session, navigate]);

  useEffect(() => {
    if (!clientId.current) {
      clientId.current = "client-" + "" + uuid4();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your code to run every interval
      fetchConnectedClients()
        .catch(console.log)
        .then((clientConnected) => {
          primaryConnectedClient.current = clientConnected!;
        })
        .catch((e) => console.log(e));
    }, 3000);

    return () => {
      clearInterval(intervalId); // Clear the interval
    };
  }, [fetchConnectedClients]);

  if (!cId.chatId) {
    const nv = async () => await navigate("/not-found");
    nv().catch((err) => console.log(err));
  }
  const {
    trigger: fetchTheChatHis,
    data: chatHis,
    isMutating: isFetchingChatHistory,
  } = useSWRMutation(`${api}/ai/thread/${cId.chatId}`, getChatHistory);
  // make this hook like useChat
  const [chatsCopy, setChatsCopy] = useState<Message[]>(chatHis ? chatHis : []);
  const [chatCopyStatus, setChatCopyStatus] = useState<"ready" | "streaming"|"stopped">("ready")

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      streamProtocol: "data",
      api: `${api}/ai/generate`,
      id: cId.chatId,
      initialMessages: chatHis || [],
      sendExtraMessageFields: true,
      credentials: "include",
      body: {
        clientId: clientId.current,
      },
    });
  const scrollRef = useRef<HTMLDivElement>(null);

  const cc = useRef(0);
  const hasRevalidated = useRef(false);

  useEffect(() => {
    async function appendUserInput() {
      setChatsCopy([]);
      const newState = location.state as { chat?: string } | undefined;
      // remove the ref and make this fun in the way it shoud run one time only
      //cc is just tracking this fun running time should me alway 0 then 1 then done
      if (newState && cc.current === 0) {
        cc.current += 1;
        const userInput = newState.chat!;
        await navigate(location.pathname, { replace: true });
        await append({ role: "user", content: userInput });
        return;
      }
      fetchTheChatHis().catch(console.log);
    }

    appendUserInput().catch((err) => console.log("error while appending", err));
  }, [location]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatsCopy, scrollRef]);

  useEffect(() => {
    if (chatHis && chatsCopy.length === 0) {
      setChatsCopy(chatHis);
    }
  }, [chatHis, location]);

  // console.log("Chat Streaming Status", chatCopyStatus)

 useEffect(() => {
  if (!cId.chatId) return;

  let eventSource = null;
  let shouldReconnect = true;

  const connectToStream = () => {
    if (eventSource) eventSource.close();

    console.log(`Connecting to stream for chatId: ${cId.chatId}`);
    eventSource = new EventSource(
      `${api}/ai/stream/${cId.chatId}?clientId=${clientId.current}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      const msgObj = extractJsonFromStream(event.data);
      
      if (msgObj && (msgObj.type === "user_input" || msgObj.type === "chat_streaming")) {
        setChatCopyStatus("streaming")
        setChatsCopy((prevChats) => {
          const index = prevChats.findIndex(chat => chat.id === msgObj.id);
          
          if (index !== -1) {
            // Update existing message
            const updatedChats = [...prevChats];
            updatedChats[index] = { ...updatedChats[index], content: msgObj.content };
            return updatedChats;
          } else {
            // Add new message
            return [...prevChats, {
              id: msgObj.id,
              role: msgObj.role,
              content: msgObj.content,
            }];
          }
        });
      }

       if (msgObj && msgObj.type === "chat_completed") {
          setChatCopyStatus("stopped");
        }
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
      
      if (shouldReconnect) {
        setTimeout(connectToStream, 2000); // Simple 2s retry
      }
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };
  };

  // Stop streaming function
  const stopStream = () => {
    shouldReconnect = false;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    console.log("Stream stopped");
  };

  // Listen for stop signal
  const handleStopStream = () => stopStream();
  
  // You can trigger this with a custom event or prop
  window.addEventListener('stopSSEStream', handleStopStream);

  connectToStream();

  return () => {
    shouldReconnect = false;
    if (eventSource) eventSource.close();
    window.removeEventListener('stopSSEStream', handleStopStream);
  };
}, [cId.chatId]);

// To stop the stream from anywhere in your app:
// window.dispatchEvent(new CustomEvent('stopSSEStream'));

  //  useFetching at setinterval do not use sse for now
  useEffect(() => {
    if (!cId.chatId) return;
    if (!clientId.current) return;

    // Initial connection
  }, [cId.chatId]);

  useEffect(() => {
    if (
      chatsCopy.length === 2 &&
      status !== "streaming" &&
      !hasRevalidated.current
    ) {
      mutate(`${api}/ai/threads`);
      hasRevalidated.current = true;
    }
    // Reset the flag if chatId changes or messages are cleared
    if (chatsCopy.length < 2) {
      hasRevalidated.current = false;
    }
  }, [chatsCopy.length, status, cId.chatId]);

  useEffect(()=>{
    if(chatCopyStatus==="stopped"){
      if (primaryConnectedClient.current) {
        const chatId =  cId.chatId
        const getPrimaryClient = primaryConnectedClient.current.connectedClients as unknown as Record<string, string>;
        if(clientId.current===getPrimaryClient?.[chatId!]){
          console.log("This is the primary window")
          db.messages.put({id: chatId, messages: chatsCopy}).then(()=>console.log("The data is saaved ion the db")).catch(console.log)
          }
        }
    }
  },[chatCopyStatus])

  return (
    <div className="flex items-stretch h-[calc(100vh-76px)]">
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 max-w-full`}>
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 h-[26rem] w-full">
            {chatsCopy?.map((message, index) => {
              const isLastAssistantMessage =
                index === messages.length - 1 &&
                message.role === "assistant" &&
                status === "streaming";

              return (
                <Message
                  id={message.id}
                  key={message.id}
                  message={message}
                  isStreaming={isLastAssistantMessage}
                />
              );
            })}
            <div ref={scrollRef} className="mb-5"></div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div className="py-2 px-3">
            <div className="w-full max-w-xl place-self-center">
              <UserInput
                handleChatSubmit={handleSubmit}
                handleChatInputChange={handleInputChange}
                chatInput={input}
                disable={!isFetchingChatHistory && status === "streaming"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
