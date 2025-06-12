/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Message } from "@ai-sdk/react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJsonFromStream(rawData: string):Message|null {
    try {
        const parts = rawData.split(',');
        const jsonString = parts.slice(2).join(','); // Join everything after the second comma
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Failed to parse JSON:', err);
        return null;
    }
}

