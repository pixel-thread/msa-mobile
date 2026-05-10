import React, { ReactNode } from 'react';
import { BaseErrorBoundary } from './base-error-boundary';
import { CompactError } from './compact-error.component';

interface ErrorBoundaryProps {
  children: ReactNode;
  errorMessage?: string;
}

export const ErrorBoundary = ({ children, errorMessage }: ErrorBoundaryProps) => {
  return (
    <BaseErrorBoundary
      fallback={({ resetError }) => (
        <CompactError message={errorMessage} onRetry={resetError} />
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
};
