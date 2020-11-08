import { assert } from 'chai'
import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Installer from '../Installer'

interface FixtureItem {
  type: string,
  suffix: string
}

const fixture: Array<FixtureItem> = [
  { type: 'Darwin', suffix: 'mac' },
  { type: 'Linux', suffix: 'linux' },
  { type: 'Windows', suffix: 'windows' }
]

describe('Test Installer class', () => {
  let addPathMocked: jest.Mock<void>
  let osTypeStub: SinonStub<[], string>
  let fsChmodSyncStub: SinonStub<[path: fs.PathLike, mode: fs.Mode], void>
  let fsRenameSyncStub:
    SinonStub<[oldPath: fs.PathLike, newPath: fs.PathLike], void>
  let cacheDirMocked: jest.Mock<Promise<string>>
  let downloadToolMocked: jest.Mock<Promise<string>>

  const buildUrl = (version: string, suffix: string): string =>
    `https://github.com/wren-lang/wren-cli/releases/download/${version}/wren_cli-${suffix}-${version}.zip`

  beforeEach(() => {
    addPathMocked = jest.fn()
    osTypeStub = stub(os, 'type')
    fsChmodSyncStub = stub(fs, 'chmodSync')
    fsRenameSyncStub = stub(fs, 'renameSync')
    cacheDirMocked = jest.fn()
    downloadToolMocked = jest.fn()
  })

  itParam(
    'should install correctly for ${value.type} OS',
    fixture,
    async (supportedOS: FixtureItem) => {
      const folderPath: string = 'x2no1z63'
      const oldPath: string = folderPath + path.sep + 'gke7d78i'
      const newPath: string = folderPath + path.sep + 'mint'
      const cachedPath: string = 'oze9ptz2'
      const version: string = 'y50pgz2b'

      osTypeStub.returns(supportedOS.type)
      downloadToolMocked.mockImplementation(() => Promise.resolve(oldPath))
      cacheDirMocked.mockImplementation(() => Promise.resolve(cachedPath))

      const installer: Installer = new Installer(
        version, addPathMocked, cacheDirMocked, downloadToolMocked)
      await installer.install()

      expect(downloadToolMocked.mock.calls.length).toBe(1)
      expect(downloadToolMocked.mock.calls[0][0])
        .toBe(buildUrl(version, supportedOS.suffix))
      fsRenameSyncStub.calledOnceWith(oldPath, newPath)
      fsChmodSyncStub.calledOnceWith(newPath, '777')
      expect(cacheDirMocked.mock.calls.length).toBe(1)
      expect(cacheDirMocked.mock.calls[0][0]).toBe(folderPath)
      expect(cacheDirMocked.mock.calls[0][1]).toBe('wren-cli')
      expect(cacheDirMocked.mock.calls[0][2]).toBe(version)
      expect(addPathMocked.mock.calls.length).toBe(1)
      expect(addPathMocked.mock.calls[0][0]).toBe(cachedPath)
    })

  itParam(
    'should build correct url for ${value.type} OS',
    fixture,
    (supportedOS: FixtureItem) => {
      osTypeStub.returns(supportedOS.type)

      const version: string = 'y50pgz2b'
      const installer: Installer = new Installer(version)

      const url: string = installer.getUrl()
      assert.equal(buildUrl(version, supportedOS.suffix), url)
    })

  afterEach(() => restore())
})
