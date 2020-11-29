import * as tc from '@actions/tool-cache'
import fs from 'fs'
import { restore, SinonStub, stub } from 'sinon'
import Downloader from '../Downloader'

describe('Downloader', () => {
  let fsRenameSyncStub:
    SinonStub<[oldPath: fs.PathLike, newPath: fs.PathLike], void>
  let downloadToolStub: SinonStub

  beforeEach(() => {
    fsRenameSyncStub = stub(fs, 'renameSync')
    downloadToolStub = stub(tc, 'downloadTool')
  })

  it('should download successfully', async () => {
    const zipPathOld: string = 'yw86z9qw'
    const zipPathNew: string = zipPathOld + '.zip'
    const url: string = '9r1y2ryp'
    downloadToolStub.returns(Promise.resolve(zipPathOld))
    const d: Downloader = new Downloader()
    const actual: string = await d.download(url)
    expect(fsRenameSyncStub.withArgs(zipPathOld, zipPathNew).callCount).toBe(1)
    expect(actual).toBe(zipPathNew)
  })

  afterEach(() => restore())
})
