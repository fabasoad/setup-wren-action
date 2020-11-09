/* eslint-disable no-unused-vars */
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import extract from 'extract-zip'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

type AddPathType = (inputPath: string) => void
type CacheDirType = (_1: string, _2: string, _3: string, _4?: string)
  => Promise<string>
type DownloadToolType = (url: string, dest?: string, auth?: string)
  => Promise<string>
type ExtractZipType = (zipPath: string, opts: extract.Options) => Promise<void>

export default class Installer {
  EXEC_FILE: string = 'wren_cli'

  version: string
  logger: Logger
  addPath: AddPathType
  cacheDir: CacheDirType
  downloadTool: DownloadToolType
  extractZip: ExtractZipType

  constructor(
    version: string,
    addPath: AddPathType = core.addPath,
    cacheDir: CacheDirType = tc.cacheDir,
    downloadTool: DownloadToolType = tc.downloadTool,
    extractZip: ExtractZipType = extract) {
    this.version = version
    this.logger = LoggerFactory.create('Installer')
    this.addPath = addPath
    this.cacheDir = cacheDir
    this.downloadTool = downloadTool
    this.extractZip = extractZip
  }

  async install(): Promise<void> {
    this.logger.info(`Downloading Wren CLI ${this.version}...`)
    const zipPath: string = await this.downloadTool(this.getUrl())
    this.logger.info(`Downloaded to ${zipPath}.`)
    const folderPath: string = path.basename(path.dirname(zipPath))
    await this.extractZip(zipPath, { dir: folderPath })
    const filePath: string = path.join(folderPath, this.EXEC_FILE)
    this.logger.info(`Unzipped to ${folderPath}.`)
    fs.chmodSync(filePath, '777')
    this.logger.info('Access permissions changed to 777.')

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
