import { createClient } from './gen/.kubb/client'
import {
  deleteNotification,
  getSettings,
  getStateInstance,
  receiveNotification,
  sendMessage,
} from './gen/clients'
import type { SendMessageRequest } from './gen/types'

export type GreenApiCredentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export const createGreenApi = ({ apiUrl, idInstance, apiTokenInstance }: GreenApiCredentials) => {
  const client = createClient({ baseURL: apiUrl.replace(/\/+$/, '') })
  const path = { idInstance, apiTokenInstance }

  return {
    getStateInstance: (signal?: AbortSignal) => getStateInstance({ client, path, signal }).unwrap(),

    getSettings: (signal?: AbortSignal) => getSettings({ client, path, signal }).unwrap(),

    sendMessage: (body: SendMessageRequest) => sendMessage({ client, path, body }).unwrap(),

    receiveNotification: (receiveTimeout: number, signal?: AbortSignal) =>
      receiveNotification({ client, path, query: { receiveTimeout }, signal }).unwrap(),

    deleteNotification: (receiptId: number) =>
      deleteNotification({ client, path: { ...path, receiptId } }).unwrap(),
  }
}

export type GreenApi = ReturnType<typeof createGreenApi>
