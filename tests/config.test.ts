import { configureEnums, getConfig, getService } from '../src/config';

test('configuration lifecycle', () => {
  // When not initialized it should throw an error.
  expect(() => getConfig()).toThrow('The enum service is not initialized.');
  expect(() => getService()).toThrow('The enum service is not initialized.');

  // Next we initialize the config.
  const config = {
    enumsUrl: '/api/enums',
    needsAuthentication: false,
  };

  configureEnums(config);

  // Now we expect the config to be set.
  expect(getConfig()).toBe(config);
  expect(getService()).not.toBe(null);
});
