import { Enums } from './models';

export interface EnumsState {
  enums: Enums;
}
export type Subscriber = (state: EnumsState) => void;

export interface EnumsService {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  getState: () => EnumsState;
  setEnums(enums: Enums): void;
}

export function getDefaultState(): EnumsState {
  return {
    enums: {},
  };
}

/**
 * Creates a EnumsService which stores Spring enums.
 *
 * Exposes a subscription to anyone who wants to listen to the
 * changes to the EnumsState.
 */
export function makeEnumsService(): EnumsService {
  let state: EnumsState = getDefaultState();
  let subscribers: Subscriber[] = [];

  function getState() {
    return state;
  }

  function subscribe(subscriber: Subscriber): void {
    subscribers.push(subscriber);

    subscriber(state);
  }

  function informSubscribers() {
    subscribers.forEach(subscriber => subscriber({ ...state }));
  }

  function setEnums(enums: Enums): void {
    state = { enums };

    informSubscribers();
  }

  function unsubscribe(subscriber: Subscriber): void {
    subscribers = subscribers.filter(s => s !== subscriber);
  }

  return {
    getState,
    subscribe,
    unsubscribe,
    setEnums,
  };
}
