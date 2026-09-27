// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React from 'react';

interface FargharErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface FargharErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

const FargharErrorIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export class FargharErrorBoundary extends React.Component<FargharErrorBoundaryProps, FargharErrorBoundaryState> {
  constructor(props: FargharErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): FargharErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('FargharErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="farghar-card text-center py-8 farghar-fade-in"
          style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <div className="flex justify-center mb-3 text-red-400">
            <FargharErrorIcon />
          </div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--farghar-text)' }}>
            {this.props.fallbackTitle || 'Something went wrong'}
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--farghar-text-muted)' }}>
            {this.state.errorMessage}
          </p>
          <button onClick={this.handleReset} className="farghar-btn-secondary text-sm farghar-native-touch">
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
