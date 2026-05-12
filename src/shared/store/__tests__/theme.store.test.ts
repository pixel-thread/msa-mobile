import { useThemeStore } from '../theme.store';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ themePreference: 'system' });
  });

  it('should initialize with system preference', () => {
    const { themePreference } = useThemeStore.getState();
    expect(themePreference).toBe('system');
  });

  it('should update theme preference', () => {
    useThemeStore.getState().setThemePreference('dark');
    expect(useThemeStore.getState().themePreference).toBe('dark');
  });
});
