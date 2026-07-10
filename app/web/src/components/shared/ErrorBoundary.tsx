import { Component, type ReactNode } from "react";
import { Icon, GoldButton } from "@/components/ui/connexo-primitives";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4">
          <div className="text-center max-w-lg">
            <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-lg border border-rose-200">
              <Icon name="error_outline" className="text-5xl text-rose-400" />
            </div>
            <h1 className="text-2xl font-black text-primary mb-2">Algo deu errado</h1>
            <p className="text-sm text-primary/50 font-medium mb-2">
              Um erro inesperado ocorreu. Tente recarregar a página.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-rose-500 bg-rose-50 rounded-lg p-3 mb-6 max-h-20 overflow-auto">
                {this.state.error.message}
              </p>
            )}
            <GoldButton
              icon="refresh"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Recarregar Página
            </GoldButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
