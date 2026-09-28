// @ts-nocheck

import type { RequestConfig, ResponseErrorConfig } from '../.kubb/client'
import type { GetSettingsOptions, GetSettingsStatus200 } from '../types/get-settings'
import { getSettings } from '../clients/get-settings'
import { queryOptions } from '@tanstack/react-query'

export const getSettingsQueryKey = ({ path }: Omit<GetSettingsOptions, 'headers'>) => [{ url: '/waInstance:idInstance/getSettings/:apiTokenInstance', params: path }] as const

type GetSettingsQueryKey = ReturnType<typeof getSettingsQueryKey>

export function getSettingsQueryOptions({ path }: GetSettingsOptions, config: Partial<Omit<RequestConfig, 'path' | 'query' | 'body' | 'headers' | 'url'>> = {}) {
  const queryKey = getSettingsQueryKey({ path })
  return queryOptions<GetSettingsStatus200, ResponseErrorConfig<Error>, GetSettingsStatus200, typeof queryKey>({
   queryKey,
   queryFn: async ({ signal }) => {
      return getSettings({ ...config, path, signal: config.signal ?? signal, throwOnError: true }).unwrap()
   },
  })
}
