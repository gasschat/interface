/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Streaming } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJsonFromStream(rawData: string):Streaming|null {
    try {
        const parts = rawData.split(',');
        const jsonString = parts.slice(2).join(',');
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to parse JSON:', err);
        return null;
    }
}
