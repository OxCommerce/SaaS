import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

interface AlertBoxProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const ALERT_STYLES: Record<AlertVariant, { wrapper: string; icon: React.ReactNode }> = {
  success: {
    wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />,
  },
  warning: {
    wrapper: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />,
  },
  danger: {
    wrapper: 'bg-red-50 border-red-200 text-red-800',
    icon: <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />,
  },
  info: {
    wrapper: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />,
  },
};

export function AlertBox({ variant, title, children, onDismiss, className = '' }: AlertBoxProps) {
  const styles = ALERT_STYLES[variant];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles.wrapper} ${className}`}>
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
