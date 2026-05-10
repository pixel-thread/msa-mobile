import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@src/shared/utils/logger';

interface BaseErrorBoundaryProps {
  children: ReactNode;
  fallback: (props: { error: Error | null; resetError: () => void }) => ReactNode;
}

interface BaseErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, BaseErrorBoundaryState> {
  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BaseErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error Boundary caught an error', {
      error,
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        error: this.state.error,
        resetError: this.resetError,
      });
    }

    return this.props.children;
  }
}
