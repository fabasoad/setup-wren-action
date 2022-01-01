import itParam from 'mocha-param'
import os from 'os'
import { restore, SinonStub, stub } from 'sinon'
import CliFileNameBuilder from '../CliFileNameBuilder'
import { CLI_NAME } from '../consts'

interface IFixtureOS {
  input: string
  expected: string
}

interface IFixtureCLI {
  input: string
  expected: string
}

interface IFixture {
  os: IFixtureOS
  cli: IFixtureCLI
}

describe('CliFileNameBuilder', () => {
  const osFixtures: IFixtureOS[] = [{
    input: 'Windows_NT',
    expected: 'windows'
  }, {
    input: 'Darwin',
    expected: 'mac'
  }, {
    input: 'Linux',
    expected: 'linux'
  }]
  const cliFixtures: IFixtureCLI[] = [{
    input: '0.3.0',
    expected: CLI_NAME
  }, {
    input: '0.4.0',
    expected: 'wren-cli'
  }, {
    input: 'dy79bl7s', // random value
    expected: 'wren-cli'
  }]
  const items: IFixture[] = osFixtures.flatMap(
    (os: IFixtureOS) => cliFixtures.map(
      (cli: IFixtureCLI) => ({ os, cli })));

  let osTypeStub: SinonStub<[], string>

  beforeEach(() => {
    osTypeStub = stub(os, 'type')
  })

  itParam('should build successfully (${value.os1})',
    items, (item: IFixture) => {
      osTypeStub.returns(item.os.input)
      const b: CliFileNameBuilder = new CliFileNameBuilder(item.cli.input)
      expect(b.build())
        .toBe(`${item.cli.expected}-${item.os.expected}-${item.cli.input}`)
    })

  afterEach(() => restore())
})
