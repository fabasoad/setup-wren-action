import core from '@actions/core'
import tc from '@actions/tool-cache'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'


// eslint-disable-next-line no-unused-vars
type AddPathType = (inputPath: string) => void
// eslint-disable-next-line no-unused-vars
type CacheDirType = (_1: string, _2: string, _3: string, _4?: string)
  => Promise<string>
// eslint-disable-next-line no-unused-vars
type DownloadToolType = (url: string, dest?: string, auth?: string)
  => Promise<string>

export default class Installer {
  EXEC_FILE: string = 'wren-cli'

  version: string
  logger: Logger
  addPath: AddPathType
  cacheDir: CacheDirType
  downloadTool: DownloadToolType

  constructor(
    version: string,
    addPath: AddPathType = core?.addPath,
    cacheDir: CacheDirType = tc?.cacheDir,
    downloadTool: DownloadToolType = tc?.downloadTool) {
    this.version = version
    this.logger = LoggerFactory.create('Installer')
    this.addPath = addPath
    this.cacheDir = cacheDir
    this.downloadTool = downloadTool
  }

  async install(): Promise<void> {
    this.logger.info(`Downloading Wren CLI ${this.version}...`)
    const oldPath = await this.downloadTool(this.getUrl())
    this.logger.info(`Downloaded to ${oldPath}.`)
    const index = oldPath.lastIndexOf(path.sep)
    const folderPath = oldPath.substring(0, index)
    const newPath = path.join(folderPath, this.EXEC_FILE)
    fs.renameSync(oldPath, newPath)
    this.logger.info(`Renamed to ${newPath}.`)
    fs.chmodSync(newPath, '777')
    this.logger.info(`Access permissions changed to 777.`)

    const cachedPath = await this.cacheDir(
      folderPath, this.EXEC_FILE, this.version)
    this.logger.info(`Cached dir is ${cachedPath}`)
    this.addPath(cachedPath)
  }

  getUrl(): string {
    let suffix: string
    switch (os.type()) {
    case 'Darwin':
      suffix = 'mac'
      break
    case 'Linux':
      suffix = 'linux'
      break
    default:
      suffix = 'windows'
    }
    return `https://github.com/wren-lang/wren-cli/releases/download/${this.version}/wren_cli-${suffix}-${this.version}.zip`
  }
}
