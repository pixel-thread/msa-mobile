import { cn } from '@src/shared/lib/cn';
import { Platform } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

interface ContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, edges, className, ...props }) => {
  const edge: SafeAreaViewProps['edges'] =
    Platform.OS === 'android' ? ['left', 'right', 'bottom'] : ['left', 'right'];
  return (
    <SafeAreaView
      className={cn('flex-1 bg-background', className)}
      edges={edges || edge}
      {...props}>
      {children}
    </SafeAreaView>
  );
};
