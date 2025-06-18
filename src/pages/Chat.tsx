import { useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCompletion, type Message } from "@ai-sdk/react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserInput } from "@/components/app/userInput";
import { api } from "@/lib/baseUrl";

import useSWR, {useSWRConfig} from "swr";


import { getChatHistory } from "@/lib/fetch";

import { ChatMessage } from "@/components/app/ChatMessage";
import { extractMessageFromStream } from "@/lib/utils";
import { db } from "@/local-db/db";

export const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: mutateTitle } = useSWRConfig()

  const { data: chatHis, isLoading: isFetchingChatHistory, mutate } = useSWR<Message[]>(
    `${api}/ai/thread/${chatId}`,
    getChatHistory, {
      shouldRetryOnError:false,
      fallbackData: [] //initialized it with empty array
    }
  );
  const { complete, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      streamProtocol: "data",
      api: `${api}/ai/completion`,
      credentials: "include",
      body: {
        messages: chatHis,
        chatId:chatId
      }
    });

 // mutate the title which is just created
//  ===2 meaning that just new set of initials msg arrived
  useEffect(()=>{
    if(chatHis&&chatHis.length===2){
      mutateTitle(`${api}/ai/threads`).catch(console.log)
    }
  },[chatHis])

  // save the result in db
  useEffect(()=>{
    if(!chatHis) return;

    if(!isLoading){
      if(chatHis.length===2){
        db.messages.add({messages: chatHis}, chatId).catch(console.log)
      }
      if(chatHis.length>2){
        db.messages.put({id:chatId, messages:chatHis}).catch(console.log)
      }
    }
    
  },[isLoading])


  // users input from home screen to chat screen
  useEffect(() => {
    // if the user came from homepage append the input and subit in order to get the automtic answer
    const newState = location.state as { chat?: string } | undefined;
    async function appendUserInput() {
      //cc is just tracking this fun running time should me alway 0 then 1 then done
      if (newState?.chat) {
        const userInput = newState.chat;
        await navigate(location.pathname, { replace: true });
        await complete(userInput);
        return;
      }
    }

    if (!isLoading && newState?.chat) {
      appendUserInput().catch((err) =>
        console.log("error while appending", err)
      );
    }
  }, [location, isLoading, complete, navigate]);


  useEffect(() => {
    if (!chatId) return;

    let eventSource: EventSource | null = null;
    let shouldReconnect = true;

    const connectToStream = () => {
      if (eventSource) eventSource.close();

      eventSource = new EventSource(`${api}/ai/stream/${chatId}`, {
        withCredentials: true,
      });

      eventSource.onmessage = ({data}) => {
        const extractStreamText = extractMessageFromStream(data as string)
        if(!extractStreamText)  return 


        if(extractStreamText.type==="user_input"){
          mutate((messages) => {
            return [...(messages || []), { id: extractStreamText.id, role: 'user', content: extractStreamText.content }];
          }, false).catch(console.log);
        }
        
        if (extractStreamText.type === "chat_streaming") {
          mutate((messages) => {
            const currentMessages = messages || [];
            const messageIndex = currentMessages.findIndex(msg => msg.id === extractStreamText.id);

            if (messageIndex !== -1) {
              // Update existing message
              const updatedMessages = [...currentMessages];
              updatedMessages[messageIndex] = {
                ...updatedMessages[messageIndex],
                content: extractStreamText.content
              };
              return updatedMessages;

            } else {
              return [
                ...currentMessages,
                { id: extractStreamText.id, role: 'assistant', content: extractStreamText.content }
              ];
            }
          }, false).catch(console.log);
        }
      };

      eventSource.onerror = (error: Event) => {
        console.error("SSE connection error", error);
        eventSource?.close();

        if (shouldReconnect) {
          setTimeout(connectToStream, 2000); // 2s retry
        }
      };

      eventSource.onopen = () => {
        console.log("SSE connection opened");
      };
    };

    connectToStream();

    // A/B test this for background streaming
    return () => {
      shouldReconnect = false;
      if (eventSource) eventSource.close();
    };
  }, [chatId]);


  return (
    <div className="flex items-stretch h-[calc(100vh-76px)]">
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 max-w-full smooth-scroll`}>
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1 h-[26rem] w-full">
            {chatHis?.map((message) => (
              <ChatMessage key={message.id} id={message.id} message={message} />
            ))}
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>
            <span className="block h-3 w-full"></span>

            <ScrollBar orientation="vertical" />
          </ScrollArea>

          <div className="py-2 px-3 absolute bottom-0 w-full">
            <div className="w-full max-w-xl place-self-center ">
              <UserInput
                disable={isFetchingChatHistory || isLoading}
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
