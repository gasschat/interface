import type { Message as AIMessage, Message} from "@ai-sdk/react";

export interface Model{
  id:string
  title:string;
  name:string
}

export interface LLM{
  id:string
  title:string
  name:string
}

export interface AvailableModels{
  id:string
  title:string
  name:string
  models:Model[]
}

export interface CurrentModel{
  llm:string
  model:string
}

export interface MessageProps{
  message:AIMessage;
  isStreaming:boolean;
  id:string
}

export interface ThreadOverview{
  id:string;
  title:string;
  updatedAt:Date
}

export type GetThreads = {
  threads: ThreadOverview[]
}

export type ChatHostory = {
  chats: Message[]
}

export type Streaming = Message & {
  type: "user_input" | "chat_streaming" | "chat_completed"
}

export interface ConnectedClients{
  [key:string]: string
}