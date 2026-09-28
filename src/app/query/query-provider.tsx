import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

import { resolveErrorAsync } from '@/shared/lib/errors'

const createQueryClient = () =>
  new QueryClient({
    // one place where failed POST/PUT/PATCH/DELETE turn into a toast
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (!mutation.meta?.manualErrorHandling) {
          void resolveErrorAsync(error)
        }
      },
    }),
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
