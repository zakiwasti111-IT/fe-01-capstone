import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SettingsForm inside App', () => {
  render(<App />);
  const headerElement = screen.getByText(/Account Settings/i);
  expect(headerElement).toBeInTheDocument();
});
