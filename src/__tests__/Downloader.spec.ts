import fs from 'fs'
import { restore, SinonStub, stub } from 'sinon'
import Downloader from '../Downloader'

describe('Downloader', () => {
  let fsRenameSyncStub:
    SinonStub<[oldPath: fs.PathLike, newPath: fs.PathLike], void>

  beforeEach(() => {
    fsRenameSyncStub = stub(fs, 'renameSync')
  })

  it('should download successfully', async () => {
    const zipPathOld: string = 'yw86z9qw'
    const zipPathNew: string = zipPathOld + '.zip'
    const url: string = '9r1y2ryp'
    const downloadToolMocked: jest.Mock<
      Promise<string>, [url: string, dest?: string, auth?: string]> =
      // eslint-disable-next-line no-unused-vars
      jest.fn((url: string, dest?: string, auth?: string) =>
        Promise.resolve(zipPathOld))
    const d: Downloader = new Downloader(downloadToolMocked)
    const actual: string = await d.download(url)
    fsRenameSyncStub.calledOnceWithExactly(zipPathOld, zipPathNew)
    expect(actual).toBe(zipPathNew)
  })

  afterEach(() => restore())
})
