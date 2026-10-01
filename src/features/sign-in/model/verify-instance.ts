import { type Credentials } from '@/entities/session'
import { createGreenApi } from '@/shared/api'

export type InstanceProblem = 'notAuthorized' | 'webhookUrlSet' | 'notificationsDisabled'

export const verifyInstance = async (credentials: Credentials): Promise<InstanceProblem[]> => {
  const api = createGreenApi(credentials)
  const [{ stateInstance }, settings] = await Promise.all([
    api.getStateInstance(),
    api.getSettings(),
  ])

  const problems: InstanceProblem[] = []
  if (stateInstance !== 'authorized') {
    problems.push('notAuthorized')
  }
  if (settings.webhookUrl) {
    problems.push('webhookUrlSet')
  }
  if (settings.incomingWebhook === 'no' || settings.outgoingAPIMessageWebhook === 'no') {
    problems.push('notificationsDisabled')
  }
  return problems
}
