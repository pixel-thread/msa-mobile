import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme.provider';
import { useThemeStore } from '../../../store/theme.store';
import { useColorScheme as useTailwindColorScheme } from 'nativewind';

// Mock the store and nativewind
jest.mock('../../../store/theme.store', () => ({
  useThemeStore: jest.fn(),
}));

jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  return {
    ...rn,
    useColorScheme: jest.fn(),
  };
});

import { useColorScheme as useRNColorScheme } from 'react-native';

describe('ThemeProvider', () => {
  const mockSetColorScheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTailwindColorScheme as jest.Mock).mockReturnValue({ setColorScheme: mockSetColorScheme });
  });

  it('renders children correctly', () => {
    (useThemeStore as unknown as jest.Mock).mockReturnValue('system');
    (useRNColorScheme as jest.Mock).mockReturnValue('light');

    const { getByText } = render(
      <ThemeProvider>
        <Text>Test Child</Text>
      </ThemeProvider>
    );

    expect(getByText('Test Child')).toBeTruthy();
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });
});
