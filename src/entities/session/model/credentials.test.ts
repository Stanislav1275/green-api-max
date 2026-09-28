import { credentialsSchema } from './credentials'

describe('credentialsSchema', () => {
  it('trims values and strips trailing slashes from apiUrl', () => {
    expect(
      credentialsSchema.parse({
        apiUrl: 'https://3100.api.green-api.com/v3//',
        idInstance: ' 3100000001 ',
        apiTokenInstance: ' token ',
      }),
    ).toEqual({
      apiUrl: 'https://3100.api.green-api.com/v3',
      idInstance: '3100000001',
      apiTokenInstance: 'token',
    })
  })

  it('rejects non-http urls', () => {
    const result = credentialsSchema.safeParse({
      apiUrl: 'ftp://x.y',
      idInstance: '1',
      apiTokenInstance: 't',
    })
    expect(result.error?.issues[0]?.path).toEqual(['apiUrl'])
  })
})
