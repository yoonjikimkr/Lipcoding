import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main navigation links', () => {
  render(<App />);
  expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  expect(screen.getByText(/Mentors/i)).toBeInTheDocument();
  expect(screen.getByText(/Requests/i)).toBeInTheDocument();
});
