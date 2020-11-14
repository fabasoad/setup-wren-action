import glob from 'glob'
import path from 'path'
import { Logger } from 'winston'
import CliFileNameBuilder from './CliFileNameBuilder'
import { CLI_NAME } from './consts'
import LoggerFactory from './LoggerFactory'

export default class ExecutableFileFinder implements IExecutableFileFinder {
  private log: Logger
  private builder: ICliFileNameBuilder

  constructor(
    version: string,
    builder: ICliFileNameBuilder = new CliFileNameBuilder(version)) {
    this.builder = builder
    this.log = LoggerFactory.create('ExecutableFileFinder')
  }

  find(folderPath: string): string {
    const pattern: string =
      `${folderPath}${path.sep}**${path.sep}${CLI_NAME}*`
    const files: string[] = glob.sync(pattern)
      .filter((f: string) => f.endsWith(this.builder.build()))
    if (files.length === 0) {
      throw new Error('Execution file has not been found under ' +
        `${folderPath} folder using ${pattern} pattern`)
    } else if (files.length > 1) {
      throw new Error('There are more than 1 execution file has been found ' +
        `under ${folderPath} folder using ${pattern} pattern: ${files}`)
    }
    this.log.info(`${CLI_NAME} path is ${files[0]}`)
    return files[0]
  }
}
