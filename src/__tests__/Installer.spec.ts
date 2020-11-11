import { assert } from 'chai'
import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Installer, { ToolCache } from '../Installer'

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
  let cacheDirMocked: jest.Mock<Promise<string>>
  let downloadToolMocked: jest.Mock<Promise<string>>
  let extractZipMocked: jest.Mock<Promise<string>>

  const buildUrl = (version: string, suffix: string): string =>
    `https://github.com/wren-lang/wren-cli/releases/download/${version}/wren_cli-${suffix}-${version}.zip`

  beforeEach(() => {
    addPathMocked = jest.fn()
    osTypeStub = stub(os, 'type')
    fsChmodSyncStub = stub(fs, 'chmodSync')
    cacheDirMocked = jest.fn()
    downloadToolMocked = jest.fn()
    extractZipMocked = jest.fn()
  })

  itParam(
    'should install correctly for ${value.type} OS',
    fixture,
    async (supportedOS: FixtureItem) => {
      const execFile: string = 'wren_cli'
      const folderPath: string = 'x2no1z63'
      const zipPath: string = folderPath + path.sep + 'gke7d78i.zip'
      const filePath: string = folderPath + path.sep + execFile
      const cachedPath: string = 'oze9ptz2'
      const version: string = 'y50pgz2b'

      osTypeStub.returns(supportedOS.type)
      downloadToolMocked.mockImplementation(() => Promise.resolve(zipPath))
      cacheDirMocked.mockImplementation(() => Promise.resolve(cachedPath))
      extractZipMocked.mockImplementation(() => Promise.resolve(folderPath))

      const toolCacheMock: ToolCache = {
        cacheDir: cacheDirMocked,
        downloadTool: downloadToolMocked,
        extractZip: extractZipMocked
      }
      const installer: Installer = new Installer(
        version, addPathMocked, toolCacheMock)
      await installer.install()

      expect(downloadToolMocked.mock.calls.length).toBe(1)
      expect(downloadToolMocked.mock.calls[0][0])
        .toBe(buildUrl(version, supportedOS.suffix))
      expect(extractZipMocked.mock.calls[0][0]).toBe(zipPath)
      expect(extractZipMocked.mock.calls[0][1]).toBe(folderPath)
      fsChmodSyncStub.calledOnceWith(filePath, '777')
      expect(cacheDirMocked.mock.calls.length).toBe(1)
      expect(cacheDirMocked.mock.calls[0][0]).toBe(folderPath)
      expect(cacheDirMocked.mock.calls[0][1]).toBe(execFile)
      expect(cacheDirMocked.mock.calls[0][2]).toBe(version)
      expect(addPathMocked.mock.calls.length).toBe(1)
      expect(addPathMocked.mock.calls[0][0]).toBe(cachedPath)
      expect(extractZipMocked.mock.calls.length).toBe(1)
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
