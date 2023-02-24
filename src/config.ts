import { EnumsService, makeEnumsService } from './service';
import { Enums } from './models';

export type Config = {
  // The URL which will provide the enums over a GET request.
  enumsUrl: string;
};

let config: Config | null = null;
let service: EnumsService | null = null;

/**
 * Configures the Constraint library.
 *
 * @param {Config} c The new configuration
 */
export function configureEnums(c: Config): void {
  config = c;
  service = makeEnumsService();
}

/**
 * Either returns a Config or throws an error when the
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

export function getService<T = Enums>(): EnumsService<T> {
  if (service === null) {
    throw new Error('The enum service is not initialized.');
  } else {
    return service as EnumsService<T>;
  }
}
