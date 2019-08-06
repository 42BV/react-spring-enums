import { Page } from '@42.nl/spring-connect';
import { EnumValues } from './models';

/**
 * Given the EnumValues it will filter them based on the provided query.
 *
 * All EnumValues which do not start with the query will be removed.
 *
 * @export
 * @param {EnumValues} enumValues
 * @param {string} [query]
 * @returns {string[]}
 */
export function filterEnumValues(
  enumValues: EnumValues,
  query?: string
): EnumValues {
  if (query && query !== '') {
    const queryLowerCased = query.toLowerCase();

    enumValues = enumValues.filter(value => {
      const valueLowerCase = value.toLowerCase();

      return (
        valueLowerCase.substring(0, queryLowerCased.length) === queryLowerCased
      );
    });
  }

  return enumValues;
}

/**
 * Takes an `EnumValues` and a page and a query and turns it into
 * a `Page` from `"@42.nl/spring-connect` which is based on a Spring
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
 *   enumValues: EnumValues;
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
 * @returns {Promise<Page<string>>}
 */
export function getEnumsAsPage({
  enumValues,
  page,
  size = 10,
  query,
  oneBased = true
}: {
  enumValues: EnumValues;
  size?: number;
  page: number;
  query: string;
  oneBased?: boolean;
}): Promise<Page<string>> {
  const content = filterEnumValues(enumValues, query);

  const actualPage = oneBased ? page - 1 : page;

  const slice = content.slice(size * actualPage, size * actualPage + size);

  const totalPages = Math.max(1, Math.ceil(content.length / size));

  return Promise.resolve({
    content: slice,
    last: oneBased ? page === totalPages : page === totalPages - 1,
    totalElements: content.length,
    totalPages,
    size: slice.length,
    number: page,
    first: oneBased ? page === 1 : page === 0,
    numberOfElements: slice.length
  });
}
