import { View } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <View className="p-safe flex flex-1 bg-white">{children}</View>;
};
