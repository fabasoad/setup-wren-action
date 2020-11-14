import { downloadTool } from '@actions/tool-cache'
import fs from 'fs'
import { Logger } from 'winston'
import { CLI_NAME } from './consts'
import LoggerFactory from './LoggerFactory'

export default class Downloader implements IDownloader {
  private dt: typeof downloadTool
  private log: Logger

  constructor(dt: typeof downloadTool = downloadTool) {
    this.dt = dt
    this.log = LoggerFactory.create('Downloader')
  }

  async download(url: string): Promise<string> {
    this.log.info(`Downloading ${CLI_NAME} from ${url}`)
    const zipPathOld: string = await this.dt(url)
    this.log.info(`Downloaded to ${zipPathOld}`)
    const zipPathNew: string = zipPathOld + '.zip'
    fs.renameSync(zipPathOld, zipPathNew)
    this.log.info(`Renamed to ${zipPathNew}`)
    return zipPathNew
  }
}
