import fetchMock from 'fetch-mock';

import { loadEnums } from '../src/load-enums';
import { configureEnums, getService } from '../src/config';
jest.mock('../src/service', () => ({
  makeEnumsService: () => ({
    setEnums: jest.fn()
  })
}));

describe('EnumsService', () => {
  function setup({
    needsAuthentication
  }: {
    needsAuthentication: boolean;
  }): void {
    configureEnums({
      enumsUrl: '/api/enums',
      needsAuthentication
    });
  }

  afterEach(() => {
    fetchMock.restore();
  });

  describe('loadEnums', () => {
    test('200 with authentication', async () => {
      expect.assertions(2);

      setup({ needsAuthentication: true });
      const service = getService();

      fetchMock.get('/api/enums', {
        body: { fake: 'enums' },
        headers: { 'Access-Control-Allow-Credentials': 'include' }
      });

      await loadEnums();
      expect(service.setEnums).toHaveBeenCalledTimes(1);
      expect(service.setEnums).toHaveBeenCalledWith({ fake: 'enums' });
    });

    test('200 without authentication', async () => {
      expect.assertions(2);

      setup({ needsAuthentication: false });
      const service = getService();

      fetchMock.get('/api/enums', { fake: 'enums' }, {});
      await loadEnums();

      expect(service.setEnums).toHaveBeenCalledTimes(1);
      expect(service.setEnums).toHaveBeenCalledWith({ fake: 'enums' });
    });

    test('500', async () => {
      expect.assertions(2);

      setup({ needsAuthentication: false });
      const service = getService();

      fetchMock.get('/api/enums', 500);

      try {
        await loadEnums();
        fail();
      } catch (response) {
        expect(service.setEnums).toHaveBeenCalledTimes(0);
        expect(service.setEnums).not.toBeCalledWith({ enums: undefined });
      }
    });
  });
});
