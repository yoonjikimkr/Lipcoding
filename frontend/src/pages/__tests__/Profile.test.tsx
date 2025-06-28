import { render, screen } from '@testing-library/react';
import Profile from '../Profile';

jest.mock('../../api', () => ({
  ...jest.requireActual('../../api'),
  getProfile: jest.fn(() => Promise.resolve({
    name: 'Test User',
    bio: 'Test bio',
    skillsets: 'React,Python',
    image_url: 'test.jpg',
    role: 'mentor',
  })),
  updateProfile: jest.fn(() => Promise.resolve({ success: true })),
}));

test('renders profile form', async () => {
  render(<Profile />);
  expect(await screen.findByPlaceholderText(/name/i)).toBeInTheDocument();
  expect(await screen.findByPlaceholderText(/bio/i)).toBeInTheDocument();
  expect(await screen.findByTestId('save')).toBeInTheDocument();
});
