import { useEffect, useRef, useState} from "react";

import { useLocation, useNavigate, useParams } from "react-router";
import { useChat, type Message } from "@ai-sdk/react";
import type { MessageProps } from "@/lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { api } from "@/lib/baseUrl";
import { UserInput } from "@/components/app/userInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";
import { getChatHistory } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";

import { extractJsonFromStream } from "@/lib/utils";


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
  const [chatsCopy, setChatsCopy] = useState<Message[]>(chatHis?chatHis:[])

  const { messages, input, handleInputChange, handleSubmit, append, status} =
    useChat({
      streamProtocol: "data",
      api: `${api}/ai/generate`,
      id:cId.chatId,
      initialMessages:chatHis || [],
      sendExtraMessageFields:true,
      credentials:"include",
    });
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("----- ----- ---chatCope ", chatsCopy)
  const cc = useRef(0)
  
 useEffect(() => {
    async function appendUserInput() {
      setChatsCopy([])
        const newState = location.state as { chat?: string } | undefined;
        // remove the ref and make this fun in the way it shoud run one time only
        //cc is just tracking this fun running time should me alway 0 then 1 then done
        if (newState && cc.current===0) {
          cc.current += 1
          const userInput = newState.chat!;
          await navigate(location.pathname, { replace: true });
          await append({ role: "user", content: userInput });
          return;
        }
        fetchTheChatHis().catch(console.log)
      
    }

    appendUserInput().catch((err) => console.log("error while appending", err));
  }, [location]);

  // console.log("`````````````CC CURENT``````````````", cc.current)
  console.log("~~~~~~~~~~~~`The append data~~~~~~~~~~~~~", location.state as { chat?: string })

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatsCopy, scrollRef]);

  useEffect(()=>{
    if(chatHis && chatsCopy.length===0){
      setChatsCopy(chatHis)
    }
  },[chatHis, location])

useEffect(() => {
  if (!cId.chatId) return;

  let eventSource = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  const connectToStream = () => {
    // Close existing connection if any
    if (eventSource) {
      eventSource.close();
    }

    console.log(`Connecting to stream for chatId: ${cId.chatId}`);
    eventSource = new EventSource(`${api}/ai/stream/${cId.chatId}`, {
      withCredentials: true
    });

    // Handle different message types
    eventSource.addEventListener('message', (event:any) => {
      // console.log('Regular message:', event.data);
      // Handle your chat messages here
      // setMessages(prev => [...prev, JSON.parse(event.data)]);
        const msgObj = extractJsonFromStream(event.data);

  if (msgObj) {
    setChatsCopy(prevChats => {
      const index = prevChats.findIndex(chat => chat.id === msgObj.id);

      if (index !== -1) {
        // If the message exists → update its content
        const updatedChats = [...prevChats];
        updatedChats[index] = {
          ...updatedChats[index],
          content: msgObj.content, // Only update the content
        };
        return updatedChats;
      } else {
        // If it doesn't exist → append the new message
        const newChats: Message = {
          id: msgObj.id,
          role: msgObj.role,
          content: msgObj.content,
        };
        return [...prevChats, newChats];
      }
    });

      }
    });

    eventSource.addEventListener('subscribed', (event) => {
      console.log('Subscription confirmed:', event.data);
      reconnectAttempts = 0; // Reset reconnect counter on successful connection
    });

    eventSource.addEventListener('ping', (event) => {
      console.log('Keep-alive ping:', event.data);
      // Connection is healthy
    });

    eventSource.addEventListener('error', (event) => {
      console.log('Error event from server:', event.data);
      // Handle server-side errors
    });

    eventSource.onopen = () => {
      console.log('SSE connection opened');
      reconnectAttempts = 0;
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      console.log('ReadyState:', eventSource?.readyState);
      
      if (eventSource?.readyState === EventSource.CLOSED) {
        console.log('Connection closed by server');
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts) * 1000; // 1s, 2s, 4s, 8s, 16s
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
          
          setTimeout(() => {
            reconnectAttempts++;
            connectToStream();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      }
    };
  };

  // Initial connection
  connectToStream();

  // Cleanup function
  return () => {
    console.log('Cleaning up SSE connection');
    if (eventSource) {
      eventSource.close();
    }
  };
}, [cId.chatId]);


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
                disable={!isFetchingChatHistory && status==="streaming"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
