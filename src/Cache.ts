import { addPath } from '@actions/core'
import { cacheDir } from '@actions/tool-cache'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import { CLI_NAME } from './consts'
import LoggerFactory from './LoggerFactory'

export default class Cache implements ICache {
  private ap: typeof addPath
  private cd: typeof cacheDir
  private version: string
  private log: Logger

  constructor(
    version: string,
    ap: typeof addPath = addPath,
    cd: typeof cacheDir = cacheDir) {
    this.version = version
    this.ap = ap
    this.cd = cd
    this.log = LoggerFactory.create('Cache')
  }

  private getCliExecFileName(): string {
    switch (os.type()) {
    case 'Windows_NT':
      return `${CLI_NAME}-${this.version}.exe`
    default:
      return CLI_NAME
    }
  }

  async cache(execFilePath: string): Promise<void> {
    fs.chmodSync(execFilePath, '777')
    this.log.info('Access permissions changed to 777.')
    const folderPath: string = path.dirname(execFilePath)
    const cachedPath = await this.cd(
      folderPath, this.getCliExecFileName(), this.version)
    this.log.info(`Cached dir is ${cachedPath}`)
    this.ap(cachedPath)
    this._print(cachedPath)
  }

  private _print(folder: string) {
    fs.readdirSync(folder).forEach((f: string) => {
      console.log(f)
    })
  }
}
