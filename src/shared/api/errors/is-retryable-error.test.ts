import { ResponseError } from '../gen/.kubb/client'
import { isRetryableError } from '.'

const responseError = (status: number) =>
  new ResponseError({
    data: null,
    status,
    statusText: '',
    request: new Request('https://api.test'),
    response: new Response(),
  })

it.each([
  [responseError(429), true],
  [responseError(500), true],
  [responseError(503), true],
  [new DOMException('t', 'TimeoutError'), true],
  [new TypeError('Failed to fetch'), true],
  [responseError(400), false],
  [responseError(401), false],
  [new DOMException('a', 'AbortError'), false],
  [new Error('bug'), false],
])('isRetryableError(%s) → %s', (error, expected) => {
  expect(isRetryableError(error)).toBe(expected)
})
