import React, { createContext, useContext, useState, useCallback } from "react";
import { Icon } from "@/components/ui/connexo-primitives";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((state) => [...state, { id, message, type }]);

    setTimeout(() => {
      setToasts((state) => state.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-4 bg-primary text-white p-6 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-right-8 duration-500 min-w-[300px]"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' :
              'bg-secondary/20 text-secondary'
            }`}>
              <Icon name={toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
