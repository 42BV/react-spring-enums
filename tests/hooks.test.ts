import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { configureEnums, getService } from '../src/config';
import { useEnum, useEnums } from '../src/hooks';
import { renderHook } from '@testing-library/react-hooks';

afterEach(cleanup);

describe('useEnum', () => {
  function setup() {
    configureEnums({
      enumsUrl: '/api/enums'
    });

    getService().setEnums({
      CAR_BRANDS: ['AUDI', 'TESLA'],
      CAR_TYPES: ['ELECTRIC', 'DIESEL', 'GAS']
    });
  }

  it('should fetch all enums', async () => {
    expect.assertions(1);

    setup();

    const { result } = renderHook(() => useEnums());

    expect(result.current).toEqual({
      enums: {
        CAR_BRANDS: ['AUDI', 'TESLA'],
        CAR_TYPES: ['ELECTRIC', 'DIESEL', 'GAS']
      }
    });
  });

  it('should fetch a single enum', async () => {
    expect.assertions(1);

    setup();

    const { result } = renderHook(() => useEnum('CAR_BRANDS'));

    expect(result.current).toEqual(['AUDI', 'TESLA']);
  });

  it('should throw an error when fetching a non-existent enum', async () => {
    expect.assertions(1);

    setup();

    // Prevent the error from logging
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useEnum('NON_EXISTING'));

    expect(result.error?.message).toBe(
      "@42.nl/spring-enum: The enum named 'NON_EXISTING' could not be found, make sure the enums are loaded before the using them and that the 'NON_EXISTING' enum actually exists."
    );
  });
});
