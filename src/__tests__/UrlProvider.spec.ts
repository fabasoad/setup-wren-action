import UrlProvider from '../UrlProvider'

describe('UrlProvider', () => {
  it('should return url successfully', () => {
    const version: string = 'yx874q60'
    const fileName: string = '3iy81j7i'
    const provider: UrlProvider = new UrlProvider(version, {
      build: (): string => fileName
    })
    const actual: string = provider.getUrl()
    expect(actual).toBe(
      `https://github.com/wren-lang/wren-cli/releases/download/${version}/${fileName}.zip`)
  })
})
