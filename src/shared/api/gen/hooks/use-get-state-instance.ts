// @ts-nocheck

import type { RequestConfig, ResponseErrorConfig } from '../.kubb/client'
import type { GetStateInstanceOptions, GetStateInstanceStatus200 } from '../types/get-state-instance'
import { getStateInstance } from '../clients/get-state-instance'
import { queryOptions } from '@tanstack/react-query'

export const getStateInstanceQueryKey = ({ path }: Omit<GetStateInstanceOptions, 'headers'>) => [{ url: '/waInstance:idInstance/getStateInstance/:apiTokenInstance', params: path }] as const

type GetStateInstanceQueryKey = ReturnType<typeof getStateInstanceQueryKey>

export function getStateInstanceQueryOptions({ path }: GetStateInstanceOptions, config: Partial<Omit<RequestConfig, 'path' | 'query' | 'body' | 'headers' | 'url'>> = {}) {
  const queryKey = getStateInstanceQueryKey({ path })
  return queryOptions<GetStateInstanceStatus200, ResponseErrorConfig<Error>, GetStateInstanceStatus200, typeof queryKey>({
   queryKey,
   queryFn: async ({ signal }) => {
      return getStateInstance({ ...config, path, signal: config.signal ?? signal, throwOnError: true }).unwrap()
   },
  })
}
