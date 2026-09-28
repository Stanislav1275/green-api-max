import { setupServer } from 'msw/node'

import { createGreenApiMock } from '@/shared/mocks'

export const TEST_CREDENTIALS = {
  apiUrl: 'https://api.test',
  idInstance: '3100000001',
  apiTokenInstance: 'test-token',
}

export const greenApiMock = createGreenApiMock({ emptyQueueDelayMs: 20, replyDelayMs: 50 })

export const server = setupServer(...greenApiMock.handlers)
