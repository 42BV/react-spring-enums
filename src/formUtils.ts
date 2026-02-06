import { Page, pageOf } from '@42.nl/spring-connect';
import { EnumValue } from './models';

/**
 * Returns the enumValues matching the provided query.
 *
 * @export
 * @param {EnumValue[]} enumValues
 * @param {string} query
 * @param {Function} getDisplayValue Function that accepts an enum value and returns a string to match with the query
 * @returns {string[]}
 * @throws Throws an error if enumValues is not an array of type
 * EnumValue (string or object with displayName property), and
 * getDisplayValue is not provided.
 */
export function filterEnumValues<T>(
  enumValues: T[],
  query?: string,
  getDisplayValue = enumValueDisplayName<T>
): T[] {
  if (query) {
    return enumValues.filter((value) =>
      getDisplayValue(value).match(new RegExp(query, 'i'))
    );
  }

  return enumValues;
}

/**
 * Takes an `EnumValue` array, page and query and turns it into
 * a `Page` from `@42.nl/spring-connect` which is based on a Spring
 * boot Page:
 *
 * https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Page.html
 *
 * The `query` will filter out any enums which do not start with that
 * query.
 *
 * The `page` is the page it is currently on, it determines the slice
 * which the user currently sees.
 *
 * The `size` defaults to 10 but can be any positive number.
 *
 * The `oneBased`, which default to `true`, determines if the page
 * should start at page 1 or page 0.
 *
 * @export
 * @param {{
 *   enumValues: EnumValue[];
 *   size?: number;
 *   page: number;
 *   query: string;
 *   oneBased?: boolean;
 * }} {
 *   enumValues,
 *   page,
 *   size = 10,
 *   query,
 *   oneBased = true
 * }
 * @returns {Promise<Page<EnumValue>>}
 * @throws Throws an error if enumValues is not an array of type
 * EnumValue (string or object with displayName property), and
 * getDisplayValue is not provided.
 */
export function getEnumsAsPage<T = EnumValue>({
  enumValues,
  page,
  size = 10,
  query,
  oneBased = true,
  getDisplayValue
}: {
  enumValues: T[];
  size?: number;
  page: number;
  query: string;
  oneBased?: boolean;
  getDisplayValue?: (enumValue: T) => string;
}): Promise<Page<T>> {
  return new Promise((resolve) =>
    resolve(
      pageOf(
        filterEnumValues<T>(enumValues, query, getDisplayValue),
        page,
        size,
        oneBased
      )
    )
  );
}

function enumValueDisplayName<T = EnumValue>(enumValue: T): string {
  if (typeof enumValue === 'string') {
    return enumValue;
  }

  if (
    enumValue &&
    typeof enumValue === 'object' &&
    Object.prototype.hasOwnProperty.call(enumValue, 'displayName')
  ) {
    // @ts-expect-error We checked if property displayName exists but typescript somehow still doesn't understand
    return enumValue.displayName;
  }

  throw new Error(
    'You have to provide a custom getDisplayValue for getEnumsAsPage and filterEnumValues when the enum type is not a string and does not extend ComplexEnumType'
  );
}
