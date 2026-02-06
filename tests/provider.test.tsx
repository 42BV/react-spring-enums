import React from 'react';
import { render } from '@testing-library/react';
import { EnumsContext, EnumsProvider } from '../src/provider';
import { configureEnums, getService } from '../src/config';
import { useEnum } from '../src/hooks';
import { EnumValue } from '../src/models';

const HookTest = () => {
  const CAR_TYPES = useEnum<string>('CAR_TYPES');
  return <p>I really like {CAR_TYPES[0]} cars</p>;
};

const ConsumerTest = ({ favoriteCar }: { favoriteCar: EnumValue }) => {
  return (
    <h2>
      My favorite car brand is{' '}
      {typeof favoriteCar === 'string' ? favoriteCar : favoriteCar.displayName}
    </h2>
  );
};

describe('EnumProvider', () => {
  function setup(): void {
    configureEnums({
      enumsUrl: '/api/enums'
    });

    getService().setEnums({ CAR_TYPES: ['AUDI', 'TESLA'] });
  }

  test('should provide context as hook', () => {
    setup();
    const { container } = render(
      <EnumsProvider>
        <HookTest />
      </EnumsProvider>
    );

    expect(container.innerHTML).toContain('I really like AUDI cars');
  });

  test('should provide context as consumer', () => {
    setup();
    const { container } = render(
      <EnumsProvider>
        <EnumsContext.Consumer>
          {({ enums: { CAR_TYPES } }) => (
            <ConsumerTest favoriteCar={CAR_TYPES[1]} />
          )}
        </EnumsContext.Consumer>
      </EnumsProvider>
    );

    expect(container.innerHTML).toContain('My favorite car brand is TESLA');
  });
});
