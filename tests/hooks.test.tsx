import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { configureEnums, getService } from '../src/config';
import { useEnum, useEnums } from '../src/hooks';
import { Enums } from '../src/models';

afterEach(cleanup);

describe('useEnum', () => {
  class ErrorBoundary extends React.Component {
    state = {
      hasError: false,
      message: ''
    };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, message: error.message };
    }

    render() {
      const { hasError, message } = this.state;
      if (hasError) {
        return <h1 data-testid="error">{message}</h1>;
      }

      return this.props.children;
    }
  }

  function setup({
    component: Component,
    enums
  }: {
    component: React.ComponentType<unknown>;
    enums: Enums;
  }) {
    configureEnums({
      enumsUrl: '/api/enums',
      needsAuthentication: false
    });

    getService().setEnums(enums);

    return render(
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    );
  }

  it('should fetch all enums', async () => {
    expect.assertions(1);

    const { getByTestId } = setup({
      component: function Component() {
        const { enums } = useEnums();
        return <p data-testid="header">{Object.keys(enums).join(' ')}</p>;
      },
      enums: {
        CAR_BRANDS: ['AUDI', 'TESLA'],
        CAR_TYPES: ['ELECTRIC', 'DIESEL', 'GAS']
      }
    });

    await waitFor(() => {
      expect(getByTestId('header')).toHaveTextContent('CAR_BRANDS CAR_TYPES');
    });
  });

  it('should fetch a single enum', async () => {
    expect.assertions(1);

    const { getByTestId } = setup({
      component: function Component() {
        const carTypes = useEnum('CAR_BRANDS');
        return <p data-testid="header">{carTypes.join(' ')}</p>;
      },
      enums: { CAR_BRANDS: ['AUDI', 'TESLA'] }
    });

    await waitFor(() => {
      expect(getByTestId('header')).toHaveTextContent('AUDI TESLA');
    });
  });

  it('should throw an error when fetching a non-existent enum', async () => {
    expect.assertions(1);

    // Prevent the error from logging
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const { getByTestId } = setup({
      component: function Component() {
        const carBrands = useEnum('CAR_BRANDS');
        return <p data-testid="header">{carBrands.join(' ')}</p>;
      },
      enums: { CAR_TYPES: ['ELECTRIC', 'DIESEL'] }
    });

    await waitFor(() => {
      expect(getByTestId('error')).toHaveTextContent(
        "@42.nl/spring-enum: The enum named 'CAR_BRANDS' could not be found, make sure the enums are loaded before the using them and that the 'CAR_BRANDS' enum actually exists."
      );
    });
  });
});
