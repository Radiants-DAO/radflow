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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  default: 'bg-[rgba(20,20,30,0.95)] text-[#f3eed9] border border-[rgba(243,238,217,0.2)]',
  success: 'bg-[rgba(20,20,30,0.95)] text-[#f3eed9] border border-[rgba(142,242,217,0.3)]',
  warning: 'bg-[rgba(20,20,30,0.95)] text-[#f3eed9] border border-[rgba(252,225,132,0.3)]',
  error: 'bg-[rgba(20,20,30,0.95)] text-[#f3eed9] border border-[rgba(255,100,100,0.3)]',
  info: 'bg-[rgba(20,20,30,0.95)] text-[#f3eed9] border border-[rgba(128,208,255,0.3)]',
};

const variantBorderColors: Record<ToastVariant, string> = {
  default: 'border-l-[rgba(243,238,217,0.5)]',
  success: 'border-l-[#8ef2d9]',
  warning: 'border-l-[#fce184]',
  error: 'border-l-[#ff6464]',
  info: 'border-l-[#80d0ff]',
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
        p-3
        animate-slideIn
        font-outfit text-sm
        border-l-4
        backdrop-blur-sm
        ${variantStyles[variant]}
        ${variantBorderColors[variant]}
      `.trim()}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {displayIconName && (
          <span className="flex-shrink-0">
            <Icon name={displayIconName} size={ICON_SIZES.md} className="text-[#f3eed9]" />
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-kodemono text-xs uppercase text-[#f3eed9] font-bold">{toast.title}</p>
          {toast.description && <p className="font-outfit text-sm text-[rgba(243,238,217,0.8)] mt-1">{toast.description}</p>}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="text-[rgba(243,238,217,0.5)] hover:text-[#f3eed9] flex-shrink-0 -mt-1 transition-colors" aria-label="Close">
          <Icon name="close" size={ICON_SIZES.md} />
        </button>
      </div>
    </div>
  );
}

export default ToastProvider;
export type { ToastVariant, ToastData, ToastProviderProps };
