import axios from "axios";

import type {
  AvailableModels,
  GetThreads,
  ThreadOverview,
  ChatHistory,
  ConnectedClients,
  ForkThread,
} from "./types";

import { db } from "@/local-db/db";
import type { Message } from "@ai-sdk/react";

export const getModels = async (url: string): Promise<AvailableModels[]> => {
  const response = await axios.get<AvailableModels[]>(url, {
    withCredentials: true,
  });
  return response.data;
};

export const threads = async (url: string): Promise<ThreadOverview[]> => {
  const response = await axios.get<GetThreads>(url, {
    withCredentials: true,
  });
  return response.data.threads;
};

// Refactor this
export const deleteThread = async (url: string) => {
    const splitChatId = url.split("/");
    const chatId = splitChatId[splitChatId.length - 1];

   const isChatInLocal = (await db.messages.get(chatId)) || undefined;

    const response = await axios.delete(url, {
        withCredentials: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if(isChatInLocal && response.data.message){
        console.log("Deleteing from local")
    // await db.messages.delete(chatId)
    db.messages.delete(chatId).then(()=>console.log("Deleted from the localDB")).catch(console.log)
   }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const shareThread = async (url:string):Promise<ThreadOverview> => {
  const response = await axios.get<ThreadOverview>(url, {
    withCredentials:true
  })
  return response.data
}

export const getChatHistory = async (url: string)=> {
  const splitChatId = url.split("/");
  const chatId = splitChatId[splitChatId.length - 1];

  const isChatInLocal = (await db.messages.get(chatId)) || undefined;
  if (!isChatInLocal) {
    console.log("Getting chat from backend")
    const response = await axios.get<ChatHistory>(url, {
      withCredentials: true,
    });
    const chats = response.data.chats;

    // if doesnot exist while retriving save the msg in db no next tike it will be fucking fast, even if users cjust visit the chat didn' intract just save it
    //save in local db on first visti 
    if(chats.length>0){
        db.messages.put({id:chatId, messages:chats}).catch(console.log)
    }

    return chats;
  }
//   console.log("Getting chat from Local DB", isChatInLocal.messages)
  return isChatInLocal.messages
};

export const getSharedChat = async(url:string): Promise<Message[]> => {
  const response = await axios.get<ChatHistory>(url)
  return response.data.chats
}

export const forkChat = async(url:string):Promise<string>=>{
  const response = await axios.get<ForkThread>(url, {
    withCredentials:true
  })
  return response.data.newThreadId
}


export const getConnectedClients = async (
  url: string
): Promise<ConnectedClients> => {
  const response = await axios.get<ConnectedClients>(url, {
    withCredentials: true,
  });
  const cc = response.data;
  return cc;
};
