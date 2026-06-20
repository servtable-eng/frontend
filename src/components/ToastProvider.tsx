import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, TriangleAlert, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastListener = (toasts: Toast[]) => void;

const AUTO_CLOSE_MS = 3000;
const listeners = new Set<ToastListener>();
let toasts: Toast[] = [];
let idCounter = 0;

const variantConfig = {
  success: {
    icon: CheckCircle2,
    border: '#BBF7D0',
    background: '#F0FDF4',
    color: '#166534',
  },
  error: {
    icon: AlertCircle,
    border: '#FECACA',
    background: '#FEF2F2',
    color: '#991B1B',
  },
  warning: {
    icon: TriangleAlert,
    border: '#FDE68A',
    background: '#FFFBEB',
    color: '#92400E',
  },
} satisfies Record<ToastVariant, {
  icon: typeof CheckCircle2;
  border: string;
  background: string;
  color: string;
}>;

function notify() {
  listeners.forEach(listener => listener(toasts));
}

function removeToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id);
  notify();
}

function showToast(variant: ToastVariant, message: string) {
  const id = String(++idCounter);
  toasts = [...toasts, { id, message, variant }];
  notify();
  window.setTimeout(() => removeToast(id), AUTO_CLOSE_MS);
}

export function showSuccess(message: string) {
  showToast('success', message);
}

export function showError(message: string) {
  showToast('error', message);
}

export function showWarning(message: string) {
  showToast('warning', message);
}

export function ToastProvider() {
  const [visibleToasts, setVisibleToasts] = useState(toasts);

  useEffect(() => {
    listeners.add(setVisibleToasts);
    return () => {
      listeners.delete(setVisibleToasts);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: 'min(360px, calc(100vw - 32px))',
        pointerEvents: 'none',
      }}
    >
      {visibleToasts.map(toast => {
        const config = variantConfig[toast.variant];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            role="status"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '12px 14px',
              background: config.background,
              border: `1px solid ${config.border}`,
              borderRadius: 8,
              color: config.color,
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
              pointerEvents: 'auto',
            }}
          >
            <Icon size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.4, fontWeight: 500 }}>
              {toast.message}
            </p>
            <button
              type="button"
              aria-label="Fechar notificação"
              onClick={() => removeToast(toast.id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: config.color,
                cursor: 'pointer',
                padding: 2,
                lineHeight: 0,
                opacity: 0.72,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
