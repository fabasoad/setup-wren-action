/* eslint-disable no-unused-vars */
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

type AddPathType = (inputPath: string) => void

export interface IToolCache {
  cacheDir(sourceDir: string, tool: string, version: string, arch?: string):
    Promise<string>
  downloadTool(url: string, dest?: string, auth?: string): Promise<string>
  extractZip(file: string, dest?: string): Promise<string>
}

export default class Installer {
  EXEC_FILE: string = 'wren_cli'

  version: string
  logger: Logger
  addPath: AddPathType
  toolCache: IToolCache

  constructor(
    version: string,
    addPath: AddPathType = core.addPath,
    toolCache: IToolCache = tc) {
    this.version = version
    this.logger = LoggerFactory.create('Installer')
    this.addPath = addPath
    this.toolCache = toolCache
  }

  async install(): Promise<void> {
    const url: string = this.getUrl()
    this.logger.info(`Downloading Wren CLI ${this.version} from ${url}`)
    const zipPath: string = await this.toolCache.downloadTool(url)
    const uuid: string = path.basename(zipPath)
    this.logger.info(`Downloaded to ${zipPath}.`)
    let folderPath: string = path.dirname(zipPath)
    this.logger.info(`Unzipped ${zipPath} to ${folderPath}`)
    folderPath = await this.toolCache.extractZip(zipPath, folderPath)
    // -----
    fs.readdirSync(folderPath).forEach((file: string) => {
      // Do whatever you want to do with the file
      console.log(file)
    })
    // -----
    const filePath: string = path.join(folderPath, this.EXEC_FILE)
    this.logger.info(`Wren CLI path is ${filePath}`)
    fs.chmodSync(filePath, '777')
    this.logger.info('Access permissions changed to 777.')

    const cachedPath = await this.toolCache.cacheDir(
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
