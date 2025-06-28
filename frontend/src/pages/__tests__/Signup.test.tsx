import { render, screen } from '@testing-library/react';
import Signup from '../Signup';

test('renders signup form', () => {
  render(<Signup />);
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByTestId('signup')).toBeInTheDocument();
});
