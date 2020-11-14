import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import Cache from '../Cache'
import { CLI_NAME } from '../consts'

interface IFixture {
  os: string
  execFileName: string
}

describe('Cache', () => {
  const expectedVersion: string = 'ey1r6c00'
  const items: IFixture[] = [{
    os: 'Windows_NT',
    execFileName: `${CLI_NAME}-${expectedVersion}.exe`
  }, {
    os: 'Darwin',
    execFileName: CLI_NAME
  }, {
    os: 'Linux',
    execFileName: CLI_NAME
  }]

  let fsChmodSyncStub: SinonStub<[path: fs.PathLike, mode: fs.Mode], void>
  let osTypeStub: SinonStub<[], string>

  beforeEach(() => {
    fsChmodSyncStub = stub(fs, 'chmodSync')
    osTypeStub = stub(os, 'type')
  })

  itParam('should cache successfully (${value.os})',
    items, async (item: IFixture) => {
      const folderPath: string = '1ef84ehe'
      const execFilePath: string = path.join(folderPath, 'm8x9p1sw')
      const cachedPath: string = '1r4wn1iw'
      osTypeStub.returns(item.os)

      const apMocked: jest.Mock<void, [inputPath: string]> = jest.fn()
      const cdMocked: jest.Mock<
      Promise<string>,
      [sourceDir: string, tool: string, version: string, arch?: string]> =
      jest.fn().mockImplementation(
        // eslint-disable-next-line no-unused-vars
        (sourceDir: string, tool: string, version: string, arch?: string) =>
          cachedPath)
      const cache: Cache = new Cache(expectedVersion, apMocked, cdMocked)
      await cache.cache(execFilePath)

      fsChmodSyncStub.calledOnceWithExactly(execFilePath, '777')
      expect(cdMocked.mock.calls.length).toBe(1)
      expect(cdMocked.mock.calls[0][0]).toBe(folderPath)
      expect(cdMocked.mock.calls[0][1]).toBe(item.execFileName)
      expect(cdMocked.mock.calls[0][2]).toBe(expectedVersion)
      expect(apMocked.mock.calls.length).toBe(1)
      expect(apMocked.mock.calls[0][0]).toBe(cachedPath)
    })

  afterEach(() => restore())
})
