import { Component, ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Result } from 'antd-mobile'
import type { ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <Result
              status="error"
              title="页面出错了"
              description={this.state.error?.message || '发生了未知错误'}
            />
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
              >
                重新加载
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// 错误回退组件
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="error-fallback">
      <Result
        status="error"
        title="页面出错了"
        description={error.message || '发生了未知错误'}
      />
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button color="primary" onClick={resetErrorBoundary}>
          重试
        </Button>
      </div>
    </div>
  )
}

// 导出组件
export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
    </ErrorBoundary>
  )
}

