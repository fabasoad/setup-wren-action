import os from 'os'
import { CLI_NAME } from './consts'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private readonly version: string

  constructor(version: string) {
    this.version = version
  }

  getExeFileName(): string {
    switch (os.type()) {
    case 'Windows_NT':
      const suffix = this.version === '0.3.0' ? `-${this.version}` : ''
      return `${CLI_NAME}${suffix}.exe`
    default:
      return CLI_NAME
    }
  }
}
