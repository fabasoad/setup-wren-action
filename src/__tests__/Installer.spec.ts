import { assert } from 'chai'
// import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
// import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Installer /* , { ICore, IToolCache }*/ from '../Installer'

interface IFixtureItem {
  type: string,
  suffix: string
}

const fixture: Array<IFixtureItem> = [
  { type: 'Darwin', suffix: 'mac' },
  { type: 'Linux', suffix: 'linux' },
  { type: 'Windows', suffix: 'windows' }
]

describe('Test Installer class', () => {
  // let addPathMocked: jest.Mock<void>
  // let errorMocked: jest.Mock<void>
  let osTypeStub: SinonStub<[], string>
  // let fsChmodSyncStub: SinonStub<[path: fs.PathLike, mode: fs.Mode], void>
  // let fsRenameSyncStub: SinonStub<
  //   [oldPath: fs.PathLike, newPath: fs.PathLike], void>
  // let fsReaddirSyncStub: SinonStub<[
  //   path: fs.PathLike,
  //   options?: { encoding: BufferEncoding | null; withFileTypes?: false }
  //     | BufferEncoding | null], string[]>
  // let cacheDirMocked: jest.Mock<Promise<string>>
  // let downloadToolMocked: jest.Mock<Promise<string>>
  // let extractZipMocked: jest.Mock<Promise<string>>

  const buildUrl = (version: string, suffix: string): string =>
    `https://github.com/wren-lang/wren-cli/releases/download/${version}/wren_cli-${suffix}-${version}.zip`

  beforeEach(() => {
    // addPathMocked = jest.fn()
    // errorMocked = jest.fn()
    osTypeStub = stub(os, 'type')
    // fsChmodSyncStub = stub(fs, 'chmodSync')
    // fsRenameSyncStub = stub(fs, 'renameSync')
    // fsReaddirSyncStub = stub(fs, 'readdirSync')
    // cacheDirMocked = jest.fn()
    // downloadToolMocked = jest.fn()
    // extractZipMocked = jest.fn()
  })

  // itParam(
  //   'should install correctly for ${value.type} OS',
  //   fixture,
  //   async (supportedOS: IFixtureItem) => {
  //     const execFile: string = 'wren_cli'
  //     const execFolderPath: string = `${execFile}_test`
  //     const folderPath: string = 'x2no1z63'
  //     const zipPathOld: string = folderPath + path.sep + 'gke7d78i'
  //     const zipPathNew: string = zipPathOld + '.zip'
  //     const filePath: string = execFolderPath + path.sep + execFile
  //     const cachedPath: string = 'oze9ptz2'
  //     const version: string = 'y50pgz2b'

  //     osTypeStub.returns(supportedOS.type)
  // downloadToolMocked.mockImplementation(() => Promise.resolve(zipPathOld))
  //     cacheDirMocked.mockImplementation(() => Promise.resolve(cachedPath))
  //     extractZipMocked.mockImplementation(() => Promise.resolve(folderPath))
  //     fsReaddirSyncStub.returns([execFolderPath, 'ioh3z85r'])

  //     const coreMock: ICore = {
  //       addPath: addPathMocked,
  //       error: errorMocked
  //     }
  //     const toolCacheMock: IToolCache = {
  //       cacheDir: cacheDirMocked,
  //       downloadTool: downloadToolMocked,
  //       extractZip: extractZipMocked
  //     }
  //     const installer: Installer = new Installer(
  //       version, coreMock, toolCacheMock)
  //     await installer.install()

  //     expect(downloadToolMocked.mock.calls.length).toBe(1)
  //     expect(downloadToolMocked.mock.calls[0][0])
  //       .toBe(buildUrl(version, supportedOS.suffix))
  //     fsRenameSyncStub.calledOnceWith(zipPathOld, zipPathNew)
  //     expect(extractZipMocked.mock.calls[0][0]).toBe(zipPathNew)
  //     expect(extractZipMocked.mock.calls[0][1]).toBe(folderPath)
  //     fsReaddirSyncStub.calledOnceWith(folderPath)
  //     fsChmodSyncStub.calledOnceWith(filePath, '777')
  //     expect(cacheDirMocked.mock.calls.length).toBe(1)
  //     expect(cacheDirMocked.mock.calls[0][0]).toBe(folderPath)
  //     expect(cacheDirMocked.mock.calls[0][1]).toBe(execFile)
  //     expect(cacheDirMocked.mock.calls[0][2]).toBe(version)
  //     expect(addPathMocked.mock.calls.length).toBe(1)
  //     expect(addPathMocked.mock.calls[0][0]).toBe(cachedPath)
  //     expect(extractZipMocked.mock.calls.length).toBe(1)
  //   })

  itParam(
    'should build correct url for ${value.type} OS',
    fixture,
    (supportedOS: IFixtureItem) => {
      osTypeStub.returns(supportedOS.type)

      const version: string = 'y50pgz2b'
      const installer: Installer = new Installer(version)

      const url: string = installer.getUrl()
      assert.equal(buildUrl(version, supportedOS.suffix), url)
    })

  afterEach(() => restore())
})
