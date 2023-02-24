import { Page, pageOf } from '@42.nl/spring-connect';
import { EnumValue } from './models';

/**
 * Returns the `EnumValue`s matching the provided query.
 *
 * @export
 * @param {EnumValue[]} enumValues`
 * @param {string} [query]
 * @returns {string[]}
 */
export function filterEnumValues(
  enumValues: EnumValue[],
  query?: string
): EnumValue[] {
  if (query) {
    const queryLowerCased = query.toLowerCase();

    return enumValues.filter((value) => {
      const valueLowerCase =
        typeof value === 'string'
          ? value.toLowerCase()
          : value.displayName.toLowerCase();

      return (
        valueLowerCase.substring(0, queryLowerCased.length) === queryLowerCased
      );
    });
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
 */
export function getEnumsAsPage({
  enumValues,
  page,
  size = 10,
  query,
  oneBased = true
}: {
  enumValues: EnumValue[];
  size?: number;
  page: number;
  query: string;
  oneBased?: boolean;
}): Promise<Page<EnumValue>> {
  return new Promise((resolve) =>
    resolve(pageOf(filterEnumValues(enumValues, query), page, size, oneBased))
  );
}
