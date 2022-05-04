import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';
import Engine from './game/engine/engine';

test('renders learn react link', () => {
  render(<App game={new Engine()} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
