import { Enums } from './models';

export type EnumsState<T = Enums> = {
  enums: T;
};
export type Subscriber<T> = (state: EnumsState<T>) => void;

export type EnumsService<T = Enums> = {
  subscribe(subscriber: Subscriber<T>): void;
  unsubscribe(subscriber: Subscriber<T>): void;
  getState: () => EnumsState<T>;
  setEnums(enums: T): void;
};

export function getDefaultState<T>(): EnumsState<T> {
  return {
    enums: {} as T
  };
}

/**
 * Creates a EnumsService which stores Spring enums.
 *
 * Exposes a subscription to anyone who wants to listen to the
 * changes to the EnumsState.
 */
export function makeEnumsService<T = Enums>(): EnumsService<T> {
  let state = getDefaultState<T>();
  let subscribers: Subscriber<T>[] = [];

  function getState() {
    return state;
  }

  function subscribe(subscriber: Subscriber<T>): void {
    subscribers.push(subscriber);

    subscriber(state);
  }

  function informSubscribers() {
    subscribers.forEach((subscriber) => subscriber({ ...state }));
  }

  function setEnums(enums: T): void {
    state = { enums };

    informSubscribers();
  }

  function unsubscribe(subscriber: Subscriber<T>): void {
    subscribers = subscribers.filter((s) => s !== subscriber);
  }

  return {
    getState,
    subscribe,
    unsubscribe,
    setEnums
  };
}
