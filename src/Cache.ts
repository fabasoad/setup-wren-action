import { addPath } from '@actions/core'
import { cacheDir } from '@actions/tool-cache'
import fs from 'fs'
import path from 'path'
import { Logger } from 'winston'
import CliExeNameProvider from './CliExeNameProvider'
import LoggerFactory from './LoggerFactory'

export default class Cache implements ICache {
  private ap: typeof addPath
  private cd: typeof cacheDir
  private version: string
  private provider: ICliExeNameProvider
  private log: Logger

  constructor(
    version: string,
    ap: typeof addPath = addPath,
    cd: typeof cacheDir = cacheDir,
    provider: ICliExeNameProvider = new CliExeNameProvider(version)) {
    this.version = version
    this.ap = ap
    this.cd = cd
    this.provider = provider
    this.log = LoggerFactory.create('Cache')
  }

  async cache(execFilePath: string): Promise<void> {
    fs.chmodSync(execFilePath, '777')
    this.log.info(
      `Access permissions of ${execFilePath} file was changed to 777.`)
    const folderPath: string = path.dirname(execFilePath)
    const cachedPath = await this.cd(
      folderPath, this.provider.getExeFileName(), this.version)
    this.log.info(`Cached dir is ${cachedPath}`)
    this.ap(cachedPath)
  }
}
