import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon, ICON_SIZES } from './Icon';
import { createSafeContext } from './hooks/createSafeContext';

// ============================================================================
// Types
// ============================================================================

type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const [ToastContext, useToastContext] = createSafeContext<ToastContextValue>('Toast');

export const useToast = useToastContext;

// ============================================================================
// Toast Provider
// ============================================================================

interface ToastProviderProps {
  /** Children */
  children: React.ReactNode;
  /** Default duration in ms */
  defaultDuration?: number;
}

export function ToastProvider({ children, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = toast.duration ?? defaultDuration;

      setToasts((prev) => [...prev, { ...toast, id }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    [defaultDuration]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted && createPortal(<ToastViewport toasts={toasts} removeToast={removeToast} />, document.body)}
    </ToastContext.Provider>
  );
}

// ============================================================================
// Toast Viewport
// ============================================================================

interface ToastViewportProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

function ToastViewport({ toasts, removeToast }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// ============================================================================
// Toast Component
// ============================================================================

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-surface-primary border-edge-primary',
  success: 'bg-surface-primary border-green',
  warning: 'bg-surface-primary border-sun-yellow',
  error: 'bg-surface-primary border-sun-red',
  info: 'bg-surface-primary border-sky-blue',
};

const variantIconMap: Record<ToastVariant, string | null> = {
  default: null,
  success: 'checkmark',
  warning: 'warning-filled',
  error: 'close',
  info: 'info',
};

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const variant = toast.variant || 'default';
  const displayIconName = toast.iconName || variantIconMap[variant];

  return (
    <div
      className={`
        pointer-events-auto
        p-4
        border-2
        rounded-sm
        shadow-card
        animate-slideIn
        ${variantStyles[variant]}
      `.trim()}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {displayIconName && (
          <span className="flex-shrink-0">
            <Icon name={displayIconName} size={ICON_SIZES.md} />
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-joystix text-xs uppercase text-content-primary">{toast.title}</p>
          {toast.description && <p className="font-mondwest text-base text-content-primary/70 mt-1">{toast.description}</p>}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="text-content-primary/50 hover:text-content-primary flex-shrink-0 -mt-1" aria-label="Close">
          <Icon name="close" size={ICON_SIZES.md} />
        </button>
      </div>
    </div>
  );
}

export default ToastProvider;
export type { ToastVariant, ToastData, ToastProviderProps };
