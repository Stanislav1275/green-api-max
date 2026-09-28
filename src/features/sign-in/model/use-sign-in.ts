import { useMutation } from '@tanstack/react-query'

import { type Credentials, useSessionStore } from '@/entities/session'

import { type InstanceProblem, verifyInstance } from './verify-instance'

export class InstanceNotReadyError extends Error {
  readonly problems: InstanceProblem[]

  constructor(problems: InstanceProblem[]) {
    super('Instance is not ready for HTTP API')
    this.problems = problems
  }
}

export const useSignIn = () => {
  const signIn = useSessionStore((state) => state.signIn)

  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      const problems = await verifyInstance(credentials)
      if (problems.length > 0) {
        throw new InstanceNotReadyError(problems)
      }
      return credentials
    },
    onSuccess: signIn,
  })
}
