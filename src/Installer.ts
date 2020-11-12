/* eslint-disable no-unused-vars */
import * as c from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

export interface ICore {
  addPath(inputPath: string): void
  error(message: string | Error): void
}

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
  core: ICore
  toolCache: IToolCache

  constructor(
    version: string,
    core: ICore = c,
    toolCache: IToolCache = tc) {
    this.version = version
    this.logger = LoggerFactory.create('Installer')
    this.core = core
    this.toolCache = toolCache
  }

  async install(): Promise<void> {
    const url: string = this.getUrl()
    this.logger.info(`Downloading Wren CLI ${this.version} from ${url}`)
    let zipPath: string = await this.toolCache.downloadTool(url)
    fs.renameSync(zipPath, zipPath + '.zip')
    zipPath = zipPath + '.zip'
    this.logger.info(`Downloaded to ${zipPath}`)
    let folderPath: string = path.dirname(zipPath)
    this.logger.info(`Unzipped ${zipPath} to ${folderPath}`)
    folderPath = await this.toolCache.extractZip(zipPath, folderPath)
    // -----
    this.print(folderPath)
    // -----
    const files: string[] = fs.readdirSync(folderPath)
      .filter((f: string) => f.startsWith(this.EXEC_FILE))
    if (files.length === 0) {
      this.core.error(
        `There are no folders have been found with ${this.EXEC_FILE} prefix`)
      return
    } else if (files.length > 1) {
      this.core.error('There are more than 1 folder have ' +
        `been found with ${this.EXEC_FILE} prefix`)
      return
    }
    folderPath = path.join(folderPath, files[0])
    // -----
    this.print(folderPath)
    // -----
    const filePath: string = path.join(folderPath, this.EXEC_FILE)
    this.logger.info(`Wren CLI path is ${filePath}`)
    fs.chmodSync(filePath, '777')
    this.logger.info('Access permissions changed to 777.')

    const cachedPath = await this.toolCache.cacheDir(
      folderPath, this.EXEC_FILE, this.version)
    this.logger.info(`Cached dir is ${cachedPath}`)
    this.core.addPath(cachedPath)
    // -----
    this.print(cachedPath)
    // -----
  }

  print(folder: string) {
    this.logger.info(`PRINT ${folder}:`)
    fs.readdirSync(folder).forEach((file: string) => {
      // Do whatever you want to do with the file
      console.log(file)
    })
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
