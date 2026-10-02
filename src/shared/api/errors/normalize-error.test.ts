import { ResponseError } from '../gen/.kubb/client'
import { normalizeError, UNKNOWN_ERROR_MESSAGE } from '.'

const responseError = (status: number, data: unknown) =>
  new ResponseError({
    data,
    status,
    statusText: '',
    request: new Request('https://api.test'),
    response: new Response(),
  })

describe('normalizeError', () => {
  it('turns 400/422 with field errors into a validation error', async () => {
    await expect(
      normalizeError(responseError(422, { errors: { chatId: ['обязателен', 'формат'] } })),
    ).resolves.toEqual({
      kind: 'validation',
      message: 'errors.checkFields',
      fields: { chatId: 'обязателен, формат' },
    })
  })

  it('accepts field errors as a list and keeps the server message', async () => {
    await expect(
      normalizeError(
        responseError(400, {
          message: 'Validation failed',
          errors: [{ field: 'message', message: 'пусто' }],
        }),
      ),
    ).resolves.toEqual({
      kind: 'validation',
      message: 'Validation failed',
      fields: { message: 'пусто' },
    })
  })

  it('shows the server explanation for a plain 400', async () => {
    await expect(
      normalizeError(responseError(400, { details: 'chatId is wrong' })),
    ).resolves.toEqual({
      kind: 'http',
      status: 400,
      message: 'chatId is wrong',
    })
    await expect(normalizeError(responseError(400, 'not json'))).resolves.toMatchObject({
      message: 'errors.status.400',
    })
  })

  it.each([
    [401, 'errors.status.401'],
    [403, 'errors.status.403'],
    [404, 'errors.status.404'],
    [429, 'errors.status.429'],
    [466, 'errors.status.466'],
    [503, 'errors.server'],
  ])('maps %i to a translation key', async (status, message) => {
    await expect(normalizeError(responseError(status, { error: 'x' }))).resolves.toEqual({
      kind: 'http',
      status,
      message,
    })
  })

  it('parses a raw Response body', async () => {
    const response = Response.json({ errors: { phone: 'нет' } }, { status: 400 })
    await expect(normalizeError(response)).resolves.toMatchObject({
      kind: 'validation',
      fields: { phone: 'нет' },
    })
  })

  it('survives a Response with a broken body', async () => {
    await expect(normalizeError(new Response('<html>', { status: 502 }))).resolves.toMatchObject({
      kind: 'http',
      status: 502,
    })
  })

  it('turns a timeout into "server did not respond"', async () => {
    await expect(normalizeError(new DOMException('timed out', 'TimeoutError'))).resolves.toEqual({
      kind: 'timeout',
      message: 'errors.timeout',
    })
  })

  it('recognises network failures and aborts', async () => {
    await expect(normalizeError(new TypeError('Failed to fetch'))).resolves.toMatchObject({
      kind: 'network',
    })
    await expect(normalizeError(new DOMException('stop', 'AbortError'))).resolves.toMatchObject({
      kind: 'aborted',
    })
  })

  it.each([
    responseError(418, {}),
    new Error('boom'),
    'string',
    new DOMException('x', 'NotFoundError'),
  ])('falls back to the unknown server error for %s', async (error) => {
    await expect(normalizeError(error)).resolves.toEqual({
      kind: 'unknown',
      message: UNKNOWN_ERROR_MESSAGE,
    })
  })
})
