import { filterEnumValues, getEnumsAsPage } from '../src/formUtils';

describe('filterEnumValues', () => {
  test('string enums', () => {
    const enumValues = [
      'aap',
      'noot',
      'MIES',
      'appel',
      'pear',
      'nutmeg',
      'peach'
    ];

    expect(filterEnumValues(enumValues, 'aap')).toEqual(['aap']);
    expect(filterEnumValues(enumValues, 'm')).toEqual(['MIES', 'nutmeg']);
    expect(filterEnumValues(enumValues, 'n')).toEqual(['noot', 'nutmeg']);
    expect(filterEnumValues(enumValues, 'a')).toEqual([
      'aap',
      'appel',
      'pear',
      'peach'
    ]);
    expect(filterEnumValues(enumValues, 'pea')).toEqual(['pear', 'peach']);
    expect(filterEnumValues(enumValues, 'pear')).toEqual(['pear']);
    expect(filterEnumValues(enumValues, '')).toBe(enumValues);
    expect(filterEnumValues(enumValues, undefined)).toBe(enumValues);
  });

  test('complex enums', () => {
    const enumValues = [
      { code: 'AAP', displayName: 'Aap' },
      { code: 'NOOT', displayName: 'Noot' },
      { code: 'MIES', displayName: 'Mies' },
      { code: 'APPEL', displayName: 'Appel' },
      { code: 'PEAR', displayName: 'Pear' },
      { code: 'NUTMEG', displayName: 'Nutmeg' },
      { code: 'PEACH', displayName: 'Peach' }
    ];

    expect(filterEnumValues(enumValues, 'aap')).toEqual([
      { code: 'AAP', displayName: 'Aap' }
    ]);
    expect(filterEnumValues(enumValues, 'm')).toEqual([
      { code: 'MIES', displayName: 'Mies' },
      { code: 'NUTMEG', displayName: 'Nutmeg' }
    ]);
    expect(filterEnumValues(enumValues, 'n')).toEqual([
      { code: 'NOOT', displayName: 'Noot' },
      { code: 'NUTMEG', displayName: 'Nutmeg' }
    ]);
    expect(filterEnumValues(enumValues, 'a')).toEqual([
      { code: 'AAP', displayName: 'Aap' },
      { code: 'APPEL', displayName: 'Appel' },
      { code: 'PEAR', displayName: 'Pear' },
      { code: 'PEACH', displayName: 'Peach' }
    ]);
    expect(filterEnumValues(enumValues, 'pea')).toEqual([
      { code: 'PEAR', displayName: 'Pear' },
      { code: 'PEACH', displayName: 'Peach' }
    ]);
    expect(filterEnumValues(enumValues, 'pear')).toEqual([
      { code: 'PEAR', displayName: 'Pear' }
    ]);
    expect(filterEnumValues(enumValues, '')).toBe(enumValues);
    expect(filterEnumValues(enumValues, undefined)).toBe(enumValues);
  });

  it('should thrown an error when enumValues is not an array of string or ComplexEnumType', () => {
    expect(() => filterEnumValues([null], 'test')).toThrowError(
      'You have to provide a custom getDisplayValue for getEnumsAsPage and filterEnumValues when the enum type is not a string and does not extend ComplexEnumType'
    );
  });
});

describe('getEnumsAsPage', () => {
  describe('is one based', () => {
    function setup(page: number) {
      return getEnumsAsPage({
        enumValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        page,
        size: 3,
        query: ''
      });
    }

    test('1 / 4', async () => {
      expect.assertions(1);

      const page = await setup(1);

      expect(page).toEqual({
        content: ['1', '2', '3'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 1,
        first: true,
        numberOfElements: 3
      });
    });

    test('2 / 4', async () => {
      expect.assertions(1);

      const page = await setup(2);

      expect(page).toEqual({
        content: ['4', '5', '6'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 2,
        first: false,
        numberOfElements: 3
      });
    });

    test('3 / 4', async () => {
      expect.assertions(1);

      const page = await setup(3);

      expect(page).toEqual({
        content: ['7', '8', '9'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 3,
        first: false,
        numberOfElements: 3
      });
    });

    test('4 / 4', async () => {
      expect.assertions(1);

      const page = await setup(4);

      expect(page).toEqual({
        content: ['10'],
        last: true,
        totalElements: 10,
        totalPages: 4,
        size: 1,
        number: 4,
        first: false,
        numberOfElements: 1
      });
    });
  });

  describe('is zero based', () => {
    function setup(page: number) {
      return getEnumsAsPage({
        enumValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        page,
        size: 3,
        query: '',
        oneBased: false
      });
    }

    test('0 / 3', async () => {
      expect.assertions(1);

      const page = await setup(0);

      expect(page).toEqual({
        content: ['1', '2', '3'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 0,
        first: true,
        numberOfElements: 3
      });
    });

    test('1 / 3', async () => {
      expect.assertions(1);

      const page = await setup(1);

      expect(page).toEqual({
        content: ['4', '5', '6'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 1,
        first: false,
        numberOfElements: 3
      });
    });

    test('2 / 3', async () => {
      expect.assertions(1);

      const page = await setup(2);

      expect(page).toEqual({
        content: ['7', '8', '9'],
        last: false,
        totalElements: 10,
        totalPages: 4,
        size: 3,
        number: 2,
        first: false,
        numberOfElements: 3
      });
    });

    test('3 / 3', async () => {
      expect.assertions(1);

      const page = await setup(3);

      expect(page).toEqual({
        content: ['10'],
        last: true,
        totalElements: 10,
        totalPages: 4,
        size: 1,
        number: 3,
        first: false,
        numberOfElements: 1
      });
    });
  });

  it('should return a Page of size 10 by default', async () => {
    expect.assertions(1);

    const content = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const page = await getEnumsAsPage({
      enumValues: content,
      page: 0,
      query: '',
      oneBased: false
    });

    expect(page).toEqual({
      content,
      last: true,
      totalElements: 10,
      totalPages: 1,
      size: 10,
      number: 0,
      first: true,
      numberOfElements: 10
    });
  });

  it('should filter when query is provided', async () => {
    expect.assertions(1);

    const userRoles = ['aap', 'app', 'noot', 'mies', 'nutmeg'];
    const page = await getEnumsAsPage({
      enumValues: userRoles,
      page: 0,
      size: 1,
      query: 'a',
      oneBased: false
    });

    expect(page).toEqual({
      content: ['aap'],
      last: false,
      totalElements: 2,
      totalPages: 2,
      size: 1,
      number: 0,
      first: true,
      numberOfElements: 1
    });
  });
});
