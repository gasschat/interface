/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CurrentModel, Streaming } from "./types";

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

export const getUserSelectedModel = ():CurrentModel|undefined=> {
    const isModeSelected = localStorage.getItem('selected-model')
    if(isModeSelected){
        const selectedModel = JSON.parse(isModeSelected) as CurrentModel
        return selectedModel
    }
    return undefined
}


export const getOrAPIKey = () => {
    const hasOpenRouterAPIKey = localStorage.getItem('openrouter-key')
    if(hasOpenRouterAPIKey){
      const orKey = JSON.parse(hasOpenRouterAPIKey) as string 
      return orKey
    }
    return undefined
  }

