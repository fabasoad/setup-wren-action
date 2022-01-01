import itParam from 'mocha-param'
import os from 'os'
import { restore, SinonStub, stub } from 'sinon'
import CliExeNameProvider from '../CliExeNameProvider'
import { CLI_NAME } from '../consts'

interface IFixture {
  expectedVersion: string
  os: string
  execFileName: string
}

describe('CliExeNameProvider', () => {
  let osTypeStub: SinonStub<[], string>

  const expectedVersion: string = 'ey1r6c00'
  const items: IFixture[] = [{
    expectedVersion: '0.3.0',
    os: 'Windows_NT',
    execFileName: `${CLI_NAME}-0.3.0.exe`
  }, {
    expectedVersion, // random value
    os: 'Windows_NT',
    execFileName: `${CLI_NAME}.exe`
  }, {
    expectedVersion,
    os: 'Darwin',
    execFileName: CLI_NAME
  }, {
    expectedVersion,
    os: 'Linux',
    execFileName: CLI_NAME
  }]

  beforeEach(() => {
    osTypeStub = stub(os, 'type')
  })

  itParam('should return exe name successfully', items, (item: IFixture) => {
    osTypeStub.returns(item.os)
    const provider: CliExeNameProvider =
      new CliExeNameProvider(item.expectedVersion)
    const actual: string = provider.getExeFileName()
    expect(actual).toBe(item.execFileName)
  })

  afterEach(() => restore())
})
