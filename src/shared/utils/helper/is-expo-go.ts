import Constants from 'expo-constants';

export function isExpoGo(): boolean {
  return Constants.expoGoConfig !== null;
}
