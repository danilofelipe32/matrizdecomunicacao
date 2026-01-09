
import { AssessmentRecord, Theme } from './types';

const DB_NAME = 'CommunicationMatrixDB';
const DB_VERSION = 1;
const STORE_RECORDS = 'assessments';
const STORE_SETTINGS = 'settings';

export const db = {
  // Abre a conexão com o banco
  open: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store para os registros de avaliação (chave primária: id)
        if (!db.objectStoreNames.contains(STORE_RECORDS)) {
          db.createObjectStore(STORE_RECORDS, { keyPath: 'id' });
        }

        // Store para configurações (chave primária: key)
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  },

  // Salva ou atualiza um registro de avaliação
  saveRecord: async (record: AssessmentRecord): Promise<void> => {
    const database = await db.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_RECORDS], 'readwrite');
      const store = transaction.objectStore(STORE_RECORDS);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Busca todos os registros
  getAllRecords: async (): Promise<AssessmentRecord[]> => {
    const database = await db.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_RECORDS], 'readonly');
      const store = transaction.objectStore(STORE_RECORDS);
      const request = store.getAll();

      request.onsuccess = () => {
        // Ordena por data de modificação (mais recente primeiro)
        const records = request.result as AssessmentRecord[];
        records.sort((a, b) => b.lastModified - a.lastModified);
        resolve(records);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Deleta um registro
  deleteRecord: async (id: string): Promise<void> => {
    const database = await db.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_RECORDS], 'readwrite');
      const store = transaction.objectStore(STORE_RECORDS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Salva o tema
  saveTheme: async (theme: Theme): Promise<void> => {
    const database = await db.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_SETTINGS], 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.put({ key: 'theme', value: theme });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Recupera o tema
  getTheme: async (): Promise<Theme> => {
    const database = await db.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_SETTINGS], 'readonly');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get('theme');

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : 'light');
      };
      request.onerror = () => reject(request.error);
    });
  }
};
