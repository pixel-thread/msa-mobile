import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = process.env.APP_VARIANT || 'production';

  const getName = () => {
    if (variant === 'development') return 'msa (Dev)';
    if (variant === 'preview') return 'msa (Preview)';
    return 'msa';
  };

  const getIdentifier = () => {
    if (variant === 'development') return 'com.pixelthread.msa.dev';
    if (variant === 'preview') return 'com.pixelthread.msa.preview';
    return 'com.pixelthread.msa';
  };

  return {
    ...config,
    name: getName(),
    slug: 'msa',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/shared/assets/icon.png',
    userInterfaceStyle: 'automatic',
    scheme: 'msa',
    platforms: ['ios', 'android'],
    splash: {
      image: './src/shared/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getIdentifier(),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/shared/assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: getIdentifier(),
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './src/shared/assets/favicon.png',
    },
    plugins: ['expo-router', 'expo-notifications'],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '76bf6558-f870-4eb0-b4a2-698184fefb41',
      },
    },
    owner: 'pixel-thread',
  };
};
