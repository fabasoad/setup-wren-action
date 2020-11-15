import { error, getInput, InputOptions } from '@actions/core'
import { assert } from 'chai'
import { run } from '../index'

const TEST_VERSION: string = 'y5e30fn1xt'

class InstallerMock {
  calls: number = 0
  async install(): Promise<void> {
    this.calls++
    return Promise.resolve()
  }
}

describe('Main runner', () => {
  let errorMocked
  let getInputMocked

  beforeEach(() => {
    errorMocked = jest.fn((m: string) => assert.isNotNull(m))
    getInputMocked = jest.fn((name: string, options?: InputOptions): string => {
      assert.isUndefined(options)
      assert.equal(name, 'version')
      return TEST_VERSION
    })
  })

  it('should run successfully', async () => {
    const installerMock: InstallerMock = new InstallerMock()
    await run({
      get: (version: string) => {
        assert.equal(version, TEST_VERSION)
        return installerMock
      }
    }, getInputMocked as typeof getInput, errorMocked as typeof error)
    expect(installerMock.calls).toBe(1)
  })

  it('should print error', async () => {
    const expectedMessage: string = '0a77hs2u'
    await run({
      get: (version: string) => {
        assert.equal(version, TEST_VERSION)
        return {
          install(): Promise<void> {
            throw new Error(expectedMessage)
          }
        }
      }
    }, getInputMocked as typeof getInput, errorMocked as typeof error)
    expect(errorMocked.mock.calls.length).toBe(1)
    expect(errorMocked.mock.calls[0][0]).toBe(expectedMessage)
  })

  afterEach(() => {
    errorMocked.mockReset();
    getInputMocked.mockReset();
  })
})
