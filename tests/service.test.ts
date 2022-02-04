import { makeEnumsService } from '../src/service';

describe('EnumsService', () => {
  test('setting enums should inform subscribers', async () => {
    expect.assertions(1);

    const service = makeEnumsService();
    const CAR_TYPES = ['AUDI', 'TESLA'];
    service.setEnums({
      CAR_TYPES
    });

    service.subscribe((state) => {
      expect(state.enums).toEqual({ CAR_TYPES });
    });
  });

  test('subscription lifecycle', () => {
    const service = makeEnumsService();

    // Subscribe a subscriber.
    const subscriber = jest.fn();
    service.subscribe(subscriber);

    // It should immediately receive the state after subscribing.
    expect(subscriber).toBeCalledTimes(1);
    service.setEnums({
      CAR_TYPES: ['AUDI', 'TESLA']
    });

    expect(subscriber).toBeCalledTimes(2);
    // Unsubscribe the subscriber, and call logout.
    service.unsubscribe(subscriber);
    service.setEnums({
      CAR_TYPES: ['AUDI', 'TESLA']
    });

    // It should not have been informed anymore.
    expect(subscriber).toBeCalledTimes(2);
  });
});
