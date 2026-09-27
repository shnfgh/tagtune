// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

interface FargharErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface FargharErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FargharErrorBoundary extends React.Component<FargharErrorBoundaryProps, FargharErrorBoundaryState> {
  constructor(props: FargharErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): FargharErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('FargharErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      const { fallbackTitle = 'Something went wrong' } = this.props;
      return (
        <div className="farghar-card text-center" style={{ padding: '2rem' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--farghar-text)' }}>{fallbackTitle}</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--farghar-text-muted)' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={this.handleReset} className="farghar-btn-primary text-sm">
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
