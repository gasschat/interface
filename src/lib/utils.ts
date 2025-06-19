/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {  Streaming, CurrentModel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractMessageFromStream(rawData: string):Streaming|null {
    try {
        const parts = rawData.split(',');
        const jsonString = parts.slice(2).join(',');
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to parse JSON:', err);
        return null;
    }
}

export const saveKeys = (llm: string, key: string) => {
  const haveKeys = localStorage.getItem('llmKeys')
  
  if (!haveKeys) {
    const newKeys = { [llm]: key }
    return localStorage.setItem('llmKeys', JSON.stringify(newKeys))
  }
  
  // eslint-disable-next-line prefer-const
  let existingKeys = JSON.parse(haveKeys) as Record<string, string>
  existingKeys[llm] = key
  
  localStorage.setItem('llmKeys', JSON.stringify(existingKeys))
}


// saveKeys("gemini", "123456")
export const getApiKeys = (): Record<string, string> | null => {
const keys = localStorage.getItem('llmKeys')
return keys ? JSON.parse(keys) as Record<string, string> : null
}

export const getApiKey = (llm: string): string | null => {
const keys = getApiKeys()
return keys ? keys[llm] || null : null
}

export const getSelectedModel = (): CurrentModel | null => {
  const getCurrentModel = localStorage.getItem("selected-model");
    if (getCurrentModel) {
      const selectedModel = JSON.parse(getCurrentModel) as CurrentModel;
      return selectedModel
    }
  return null
}


export const LLMProviderIcons: Record<string, string> = {
  openai: "/chatgpt-icon.svg",
  anthropic: "/anthropic-icon.svg",
  gemini: "/gemini-icon.svg",
  openrouter: "/openrouter.jpeg",
  groq: "/groq.png",
};