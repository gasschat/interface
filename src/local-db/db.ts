// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { Message } from '@ai-sdk/react';

interface LocalMessage {
  id: string; //this will be chatId/threadId
  messages: Message[];
}

const db = new Dexie('MessageDatabase') as Dexie & {
  messages: EntityTable<
    LocalMessage,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  messages: '++id, messages' // primary key "id" (for the runtime!)
});

export type { LocalMessage };
export { db };