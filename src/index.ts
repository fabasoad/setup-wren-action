/* eslint-disable no-unused-vars */
import * as core from '@actions/core';
import { InputOptions } from '@actions/core';
import Installer from './Installer';

export interface IInputProvider {
  getInput(name: string, options?: InputOptions): string
}

export const run = async (
  installerFactory: (version: string) => Installer,
  inputProvider: IInputProvider) => {
  const installer = installerFactory(inputProvider.getInput('version'));
  await installer.install();
}

run((version: string) => new Installer(version), core)
