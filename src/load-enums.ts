import { getConfig, getService } from './config';
import { get } from '@42.nl/spring-connect';
import { Enums } from './models';

/**
 * Loads the enums from the back-end.
 *
 * The URL it will send the request to is defined by the 'enumsUrl'
 * from the Config object. The HTTP method it uses is 'get'.
 *
 * It will also send the credentials if 'needsAuthentication' from
 * the Config object is set to true.
 *
 * The entire response will be written to the Redux EnumsStore's
 * enums key. Whatever the JSON response is will be the enums.
 *
 *  An example response:
 *
 * ```JSON
 * {
 *   "UserRole": [
 *     "ADMIN",
 *     "USER"
 *  ],
 *  "BillingInterval": [
 *    "MONTHLY", "WEEKLY", "DAILY"
 *  ]
 * ```
 *
 * @returns {Promise}
 */
export async function loadEnums(): Promise<void> {
  const { enumsUrl } = getConfig();
  const service = getService();

  const enums = await get<Enums>(enumsUrl);

  service.setEnums(enums);
}
