import { cn } from '@src/shared/lib/cn';
import { Platform } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

interface ContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  const edge: SafeAreaViewProps['edges'] =
    Platform.OS === 'android' ? ['left', 'right', 'top', 'bottom'] : ['left', 'right'];
  return (
    <SafeAreaView
      edges={edge}
      className={cn('flex-1 bg-slate-50 dark:bg-slate-950', className)}
      {...props}>
      {children}
    </SafeAreaView>
  );
};
