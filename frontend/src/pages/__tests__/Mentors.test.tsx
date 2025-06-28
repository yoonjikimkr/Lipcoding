import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

jest.mock('../../api', () => ({
  ...jest.requireActual('../../api'),
  getMentors: jest.fn((_args?: any) => Promise.resolve([
    { id: 1, name: 'Alice', skillsets: ['React', 'Python'], bio: 'Mentor Alice', image_url: 'alice.jpg' },
    { id: 2, name: 'Bob', skillsets: ['Node', 'Java'], bio: 'Mentor Bob', image_url: 'bob.jpg' },
  ])),
}));

test('renders main navigation links', () => {
  render(<App />);
  expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  expect(screen.getByText(/Mentors/i)).toBeInTheDocument();
  expect(screen.getByText(/Requests/i)).toBeInTheDocument();
});