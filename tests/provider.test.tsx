import React from 'react';
import { EnumsProvider, EnumsContext } from '../src/provider';
import { configureEnums, getService } from '../src/config';
import { useEnums } from '../src/hooks';
import renderer from 'react-test-renderer';

const HookTest = () => {
  const {
    enums: { CAR_TYPES },
  } = useEnums();
  return <h2>I really like {CAR_TYPES[0]} cars</h2>;
};

class ConsumerTest extends React.Component<{ favoriteCar: string }> {
  render() {
    const { favoriteCar } = this.props;
    return <h2>My favorite car brand is {favoriteCar}</h2>;
  }
}

describe('EnumProvider', () => {
  function setup({ needsAuthentication }: { needsAuthentication: boolean }): void {
    configureEnums({
      enumsUrl: '/api/enums',
      needsAuthentication,
    });

    getService().setEnums({ CAR_TYPES: ['AUDI', 'TESLA'] });
  }

  test('should provide context as hook', () => {
    setup({ needsAuthentication: false });
    const tree = renderer
      .create(
        <EnumsProvider>
          <HookTest />
        </EnumsProvider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('should provide context as consumer', () => {
    const tree = renderer
      .create(
        <EnumsProvider>
          <EnumsContext.Consumer>
            {({ enums: { CAR_TYPES } }) => <ConsumerTest favoriteCar={CAR_TYPES[1]} />}
          </EnumsContext.Consumer>
        </EnumsProvider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
