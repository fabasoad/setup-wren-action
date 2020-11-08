import { InputOptions } from '@actions/core'
import { assert } from 'chai'
import { InputProvider, run } from '../index'
import Installer from '../Installer'

const TEST_VERSION: string = 'y5e30fn1xt'

class InputProviderMock implements InputProvider {
  getInput(name: string, options?: InputOptions): string {
    assert.isUndefined(options)
    assert.equal(name, 'version')
    return TEST_VERSION
  }
}

class InstallerMock extends Installer {
  calls: number = 0
  constructor() {
    super(TEST_VERSION)
  }
  async install(): Promise<void> {
    this.calls++
    return Promise.resolve()
  }
}

describe('Main runner', () => {
  it('should run successfully', async () => {
    const installerMock: InstallerMock = new InstallerMock()
    await run((version: string) => {
      assert.equal(version, TEST_VERSION)
      return installerMock
    }, new InputProviderMock())
    expect(installerMock.calls).toBe(1)
  })
})
