import { openDB } from 'idb';
import { ReactFlowJsonObject } from '@xyflow/react';

const dbName = 'react-flow-db';
const storeName = 'flows';

const getDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    },
  });
};

export const saveFlowToIndexedDB = async (key: string, flow: ReactFlowJsonObject) => {
  const db = await getDB();
  await db.put(storeName, flow, key);
};

export const getFlowFromIndexedDB = async (key: string) => {
  const db = await getDB();
  return await db.get(storeName, key);
};
