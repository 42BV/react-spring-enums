import { useEffect, useState } from 'react';

import { getService } from './config';
import { EnumsState } from './service';
import { Enums, EnumValue } from './models';

class MissingEnumException extends Error {}

/**
 * Retrieves the entire enum state.
 */
export function useEnums<T = Enums>(): EnumsState<T> {
  const service = getService<T>();
  const [state, setState] = useState<EnumsState<T>>(service.getState());

  useEffect(() => {
    const subscriber = (nextState: EnumsState<T>) => {
      setState(nextState);
    };

    service.subscribe(subscriber);

    return () => {
      service.unsubscribe(subscriber);
    };
  }, []);

  return state;
}

/**
 * Retrieves a single enum from the state.
 *
 * @param enumName
 */
export function useEnum<T = EnumValue>(enumName: string): T[] {
  const { enums } = useEnums<{ [key: string]: T[] }>();
  const enumValues = enums[enumName];

  if (enumValues) {
    return enumValues;
  } else {
    throw new MissingEnumException(
      `@42.nl/spring-enum: The enum named '${enumName}' could not be found, make sure the enums are loaded before the using them and that the '${enumName}' enum actually exists.`
    );
  }
}
