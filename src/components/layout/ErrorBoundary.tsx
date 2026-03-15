'use client';

import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(247, 118, 142, 0.15)' }}
            >
              <AlertTriangle size={28} style={{ color: 'var(--red)' }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              出了点问题
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {this.state.error?.message || '发生了意外错误，请重试。'}
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ backgroundColor: 'var(--green)', color: 'var(--bg)' }}
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
