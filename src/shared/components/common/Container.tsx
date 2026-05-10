import { cn } from '@src/shared/lib/cn';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

interface ContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <SafeAreaView
      edges={['left', 'right']}
      className={cn('flex-1 bg-slate-50 dark:bg-slate-950', className)}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};
