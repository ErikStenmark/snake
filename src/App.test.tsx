import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import Main from './game/main';

test('renders learn react link', () => {
  render(<App main={new Main()} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
