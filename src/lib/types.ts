export interface Model {
  id: string;
  title: string;
  name: string;
  llmId: string;
}

// LLM Providers
export interface Provider {
  id: string;
  title: string;
  name: string;
  models: Model[];
}

export type LLMProvidersList = Provider[];

export interface LocalAIKeys {
  openai:string|null
  gemini:string|null
  anthropic:string|null
}

export type SelectedModel = {llm:string, model:string}

export const LLMSvg: Record<string, string> = {
  "openai": "/chatgpt-icon.svg",
  "anthropic": "/anthropic-icon.svg",
  "gemini": "/gemini-icon.svg",
};

export interface Msg{
  id:string
  role: "user" | "assistant" | "data" | "system"
  content: string
}

export interface CurrentCode{
  status: "not_yet" | "streaming" | "completed",
  code: string | null
}
