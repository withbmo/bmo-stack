import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

import { Button } from '../Button';

interface Props {
  children: ReactNode;
  /**
   * Optional callback to reset the error boundary state without a full page reload.
   * If provided, the reset button will call this instead of reloading the window.
   */
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState({ hasError: false, error: undefined });
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center border border-red-500/30 bg-red-500/5 m-4">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">SYSTEM FAILURE</h2>
          <p className="font-mono text-xs text-text-secondary mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred in this module.'}
          </p>
          <Button variant="danger" onClick={this.handleReset} className="px-6">
            <RefreshCw size={14} className="mr-2" /> REBOOT SYSTEM
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
