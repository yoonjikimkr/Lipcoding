import { render, screen } from '@testing-library/react';
import Login from '../Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByTestId('login')).toBeInTheDocument();
});
