import itParam from 'mocha-param'
import os from 'os'
import { restore, SinonStub, stub } from 'sinon'
import CliFileNameBuilder from '../CliFileNameBuilder'
import { CLI_NAME } from '../consts'

interface IFixture {
  os1: string
  os2: string
}

describe('CliFileNameBuilder', () => {
  const expectedVersion: string = 'dy79bl7s'
  const items: IFixture[] = [{
    os1: 'Windows_NT',
    os2: 'windows'
  }, {
    os1: 'Darwin',
    os2: 'mac'
  }, {
    os1: 'Linux',
    os2: 'linux'
  }]

  let osTypeStub: SinonStub<[], string>

  beforeEach(() => {
    osTypeStub = stub(os, 'type')
  })

  itParam('should build successfully (${value.os1})',
    items, (item: IFixture) => {
      osTypeStub.returns(item.os1)
      const b: CliFileNameBuilder = new CliFileNameBuilder(expectedVersion)
      expect(b.build()).toBe(`${CLI_NAME}-${item.os2}-${expectedVersion}`)
    })

  afterEach(() => restore())
})
