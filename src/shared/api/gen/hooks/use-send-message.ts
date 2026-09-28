// @ts-nocheck

import type { RequestConfig, ResponseErrorConfig } from '../.kubb/client'
import type { SendMessageOptions, SendMessageStatus200 } from '../types/send-message'
import { sendMessage } from '../clients/send-message'
import { mutationOptions } from '@tanstack/react-query'

export const sendMessageMutationKey = () => [{ url: '/waInstance:idInstance/sendMessage/:apiTokenInstance' }] as const

export function sendMessageMutationOptions<TContext = unknown>(config: Partial<Omit<RequestConfig, 'path' | 'query' | 'body' | 'headers' | 'url'>> = {}) {
  const mutationKey = sendMessageMutationKey()
  return mutationOptions<SendMessageStatus200, ResponseErrorConfig<Error>, SendMessageOptions, TContext>({
    mutationKey,
    mutationFn: async({ path, body }) => {
      return sendMessage({ ...config, path, body, throwOnError: true }).unwrap()
    },
  })
}
