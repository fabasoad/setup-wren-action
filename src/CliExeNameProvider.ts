import os from 'os'
import { CLI_NAME } from './consts'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private version: string

  constructor(version: string) {
    this.version = version
  }

  getExeFileName(): string {
    switch (os.type()) {
    case 'Windows_NT':
      return `${CLI_NAME}-${this.version}.exe`
    default:
      return CLI_NAME
    }
  }
}
