import core, { InputOptions } from '@actions/core';
import Installer from './Installer';

export interface InputProvider {
  // eslint-disable-next-line no-unused-vars
  getInput(name: string, options?: InputOptions): string
}

export const run = async (
  // eslint-disable-next-line no-unused-vars
  installerFactory: (version: string) => Installer,
  inputProvider: InputProvider) => {
  const installer = installerFactory(inputProvider.getInput('version'));
  await installer.install();
}

run((version: string) => new Installer(version), core)
