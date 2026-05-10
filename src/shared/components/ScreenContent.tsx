import { Text, View } from 'react-native';

interface ScreenContentProps {
  path: string;
  title: string;
}

export const ScreenContent = ({ path, title }: ScreenContentProps) => (
  <View className="flex flex-1 items-center justify-center bg-white">
    <View className="absolute left-0 right-0 top-[120] flex flex-row justify-center">
      <View className="absolute h-[1] flex-1 bg-black opacity-10" />
      <View className="bg-white px-2">
        <Text className="text-center text-xs font-medium uppercase tracking-wider text-gray-400">
          {path}
        </Text>
      </View>
    </View>
    <Text className="text-2xl font-bold">{title}</Text>
  </View>
);
