import os from 'os'
import { CLI_NAME } from './consts'

export default class CliFileNameBuilder implements ICliFileNameBuilder {
  private readonly version: string

  constructor(version: string) {
    this.version = version
  }

  private static getOS(): string {
    switch (os.type()) {
    case 'Darwin':
      return 'mac'
    case 'Linux':
      return 'linux'
    default:
      return 'windows'
    }
  }

  getCliName(): string {
    return this.version === '0.3.0' ? CLI_NAME : 'wren-cli'
  }

  build(): string {
    return `${this.getCliName()}-${CliFileNameBuilder.getOS()}-${this.version}`
  }
}
