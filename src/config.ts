import { EnumsService, makeEnumsService } from './service';

export interface Config {
  // The URL which will provide the enums over a GET request.
  enumsUrl: string;

  // Whether or not the 'enumsUrl' should be called with authentication.
  needsAuthentication: boolean;
}

let config: Config | null = null;
let service: EnumsService | null = null;

/**
 * Configures the Constraint libary.
 *
 * @param {Config} The new configuration
 */
export function configureEnums(c: Config): void {
  config = c;
  service = makeEnumsService();
}

/**
 * Either returns the a Config or throws an error when the
 * config is not yet initialized.
 *
 * @returns The Config
 */
export function getConfig(): Config {
  if (config === null) {
    throw new Error('The enum service is not initialized.');
  } else {
    return config;
  }
}

export function getService(): EnumsService {
  if (service === null) {
    throw new Error('The enum service is not initialized.');
  } else {
    return service;
  }
}
