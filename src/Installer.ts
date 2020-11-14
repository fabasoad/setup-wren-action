/* eslint-disable no-unused-vars */
import * as c from '@actions/core'
import * as tc from '@actions/tool-cache'
import fs from 'fs'
import glob from 'glob'
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

  async _download(url: string): Promise<string> {
    this.logger.info(`Downloading Wren CLI ${this.version} from ${url}`)
    const zipPathOld: string = await this.toolCache.downloadTool(url)
    this.logger.info(`Downloaded to ${zipPathOld}`)
    const zipPathNew: string = zipPathOld + '.zip'
    fs.renameSync(zipPathOld, zipPathNew)
    this.logger.info(`Renamed to ${zipPathNew}`)
    return zipPathNew
  }

  async _unzip(zipPath: string): Promise<string> {
    let folderPath: string = path.dirname(zipPath)
    folderPath = await this.toolCache.extractZip(zipPath, folderPath)
    this.logger.info(`Unzipped ${zipPath} to ${folderPath}`)
    return folderPath
  }

  _findExecFile(folderPath: string): string {
    const files: string[] = glob.sync(
      `${folderPath}/**/${this.EXEC_FILE}-*-${this.version}/${this.EXEC_FILE}*`)
    if (files.length === 0) {
      throw new Error(
        `There are no folders have been found with ${this.EXEC_FILE} prefix`)
    } else if (files.length > 1) {
      throw new Error('There are more than 1 folder have been found with ' +
        `${this.EXEC_FILE} prefix: ${files}`)
    }
    this.logger.info(`Wren CLI path is ${files[0]}`)
    return files[0]
  }

  async _cache(folderPath: string): Promise<void> {
    const cachedPath = await this.toolCache.cacheDir(
      folderPath, this.EXEC_FILE, this.version)
    this.logger.info(`Cached dir is ${cachedPath}`)
    this.core.addPath(cachedPath)
  }

  async install(): Promise<void> {
    const url: string = this.getUrl()
    const zipPath: string = await this._download(url)
    const folderPath: string = await this._unzip(zipPath)
    let execFilePath: string
    try {
      execFilePath = this._findExecFile(folderPath)
    } catch (e) {
      this.core.error((e as Error).message)
      return
    }
    fs.chmodSync(execFilePath, '777')
    this.logger.info('Access permissions changed to 777.')
    this._cache(folderPath)
  }

  _print(folder: string) {
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
