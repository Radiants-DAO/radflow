'use client';

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
  default: 'bg-surface-secondary text-content-inverted border border-edge-primary',
  success: 'bg-surface-secondary text-content-inverted border border-edge-success',
  warning: 'bg-surface-secondary text-content-inverted border border-edge-warning',
  error: 'bg-surface-secondary text-content-inverted border border-edge-error',
  info: 'bg-surface-secondary text-content-inverted border border-edge-focus',
};

const variantShadowStyles: Record<ToastVariant, string> = {
  default: 'shadow-[4px_4px_0_0_var(--color-edge-primary)]',
  success: 'shadow-[4px_4px_0_0_var(--color-edge-success)]',
  warning: 'shadow-[4px_4px_0_0_var(--color-edge-warning)]',
  error: 'shadow-[4px_4px_0_0_var(--color-edge-error)]',
  info: 'shadow-[4px_4px_0_0_var(--color-edge-focus)]',
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
        rounded-sm
        animate-slideIn
        font-mondwest text-sm
        border-l-[8px]
        ${variantStyles[variant]}
        ${variantShadowStyles[variant]}
      `.trim()}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {displayIconName && (
          <span className="flex-shrink-0">
            <Icon name={displayIconName} size={ICON_SIZES.md} className="text-content-inverted" />
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-joystix text-xs uppercase text-content-inverted font-bold">{toast.title}</p>
          {toast.description && <p className="font-mondwest text-sm text-content-inverted/80 mt-1">{toast.description}</p>}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="text-content-inverted/50 hover:text-content-inverted flex-shrink-0 -mt-1" aria-label="Close">
          <Icon name="close" size={ICON_SIZES.md} />
        </button>
      </div>
    </div>
  );
}

export default ToastProvider;
export type { ToastVariant, ToastData, ToastProviderProps };
