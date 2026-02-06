import { loadEnums } from '../src/load-enums';
import { configureEnums, getService } from '../src/config';
import { get } from '@42.nl/spring-connect';

vi.mock('@42.nl/spring-connect', () => ({
  get: vi.fn()
}));

vi.mock('../src/service', () => ({
  makeEnumsService: () => ({
    setEnums: vi.fn()
  })
}));

describe('EnumsService', () => {
  function setup(): void {
    configureEnums({
      enumsUrl: '/api/enums'
    });
  }

  describe('loadEnums', () => {
    test('200', async () => {
      expect.assertions(2);

      setup();
      const service = getService();

      vi.mocked(get).mockResolvedValue({ fake: 'enums' });

      await loadEnums();
      expect(service.setEnums).toHaveBeenCalledTimes(1);
      expect(service.setEnums).toHaveBeenCalledWith({ fake: 'enums' });
    });

    test('500', async () => {
      expect.assertions(2);

      setup();
      const service = getService();

      vi.mocked(get).mockRejectedValue('');

      try {
        await loadEnums();
        fail();
      } catch {
        expect(service.setEnums).toHaveBeenCalledTimes(0);
        expect(service.setEnums).not.toBeCalledWith({ enums: undefined });
      }
    });
  });
});
