import React from 'react';
import AppFunctional from './AppFunctional';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';


test('AppFunctional renders correctly', () => {
  const { getByText, getByPlaceholderText } = render(<AppFunctional />);


  expect(getByText('Coordinates (2, 2)')).toBeInTheDocument();
  expect(getByText('You moved 0 times')).toBeInTheDocument();
  expect(getByText('LEFT')).toBeInTheDocument();
  expect(getByText('UP')).toBeInTheDocument();
  expect(getByText('RIGHT')).toBeInTheDocument();
  expect(getByText('DOWN')).toBeInTheDocument();
  expect(getByText('RESET')).toBeInTheDocument();

  const emailInput = getByPlaceholderText('type email');
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  expect(emailInput.value).toBe('test@example.com');
});
