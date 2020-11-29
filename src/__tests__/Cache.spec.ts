import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Cache from '../Cache'

describe('Cache', () => {
  let addPathStub: SinonStub<[inputPath: string], void>
  let cacheDirStub: SinonStub<[sourceDir: string,
    tool: string, version: string, arch?: string], Promise<string>>
  let chmodSyncStub: SinonStub<[path: fs.PathLike, mode: fs.Mode], void>

  beforeEach(() => {
    addPathStub = stub(core, 'addPath')
    cacheDirStub = stub(tc, 'cacheDir')
    chmodSyncStub = stub(fs, 'chmodSync')
  })

  it('should cache successfully', async () => {
    const version: string = 'ey1r6c00'
    const exeFileName: string = 'O7DF0gox'
    const getExeFileNameMock: jest.Mock<string, []> = jest.fn(() => exeFileName)
    const folderPath: string = '1ef84ehe'
    const execFilePath: string = path.join(folderPath, 'm8x9p1sw')
    const cachedPath: string = '1r4wn1iw';
    cacheDirStub.returns(Promise.resolve(cachedPath))
    const cache: Cache = new Cache(version, {
      getExeFileName: getExeFileNameMock
    })
    await cache.cache(execFilePath)

    expect(getExeFileNameMock.mock.calls.length).toBe(1)
    expect(chmodSyncStub.withArgs(execFilePath, '777').callCount).toBe(1)
    expect(cacheDirStub.withArgs(folderPath, exeFileName, version).callCount)
      .toBe(1)
    expect(addPathStub.withArgs(cachedPath).callCount).toBe(1)
  })

  afterEach(() => restore())
})
