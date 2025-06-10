import type { Message as AIMessage} from "@ai-sdk/react";

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
}
