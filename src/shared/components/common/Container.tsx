import { cn } from '@src/shared/lib/cn';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps extends React.ComponentProps<typeof SafeAreaView> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, edges, className, ...props }) => {
  return (
    <SafeAreaView
      className={cn('flex-1 dark:bg-background', className)}
      edges={edges || ['top', 'left', 'right', 'bottom']}
      {...props}>
      {children}
    </SafeAreaView>
  );
};
