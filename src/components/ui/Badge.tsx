import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Info, Loader2, Circle } from 'lucide-react';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'loading';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const STATUS_MAP: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
  // success variants
  success:    { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Concluído' },
  pago:       { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Pago' },
  concluída:  { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Concluída' },
  entregue:   { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Entregue' },
  autorizado: { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Autorizado' },
  autorizada: { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Autorizada' },
  homologado: { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Homologado' },
  aprovado:   { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Aprovado' },
  conciliado: { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Conciliado' },
  faturada:   { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Faturada' },
  emitido:    { cls: 'badge-success',  icon: <CheckCircle2 className="h-3 w-3" />, label: 'Emitido' },
  // warning variants
  warning:    { cls: 'badge-warning',  icon: <AlertTriangle className="h-3 w-3" />, label: 'Atenção' },
  pendente:   { cls: 'badge-warning',  icon: <Clock className="h-3 w-3" />, label: 'Pendente' },
  vencido:    { cls: 'badge-warning',  icon: <AlertTriangle className="h-3 w-3" />, label: 'Vencido' },
  // danger variants
  danger:     { cls: 'badge-danger',   icon: <XCircle className="h-3 w-3" />, label: 'Erro' },
  cancelado:  { cls: 'badge-danger',   icon: <XCircle className="h-3 w-3" />, label: 'Cancelado' },
  rejeitada:  { cls: 'badge-danger',   icon: <XCircle className="h-3 w-3" />, label: 'Rejeitada' },
  denegada:   { cls: 'badge-danger',   icon: <XCircle className="h-3 w-3" />, label: 'Denegada' },
  divergente: { cls: 'badge-danger',   icon: <XCircle className="h-3 w-3" />, label: 'Divergente' },
  // info variants
  info:       { cls: 'badge-info',     icon: <Info className="h-3 w-3" />, label: 'Info' },
  negociacao: { cls: 'badge-info',     icon: <Clock className="h-3 w-3" />, label: 'Em Negociação' },
  'em análise': { cls: 'badge-info',   icon: <Clock className="h-3 w-3" />, label: 'Em Análise' },
  documentacao: { cls: 'badge-info',  icon: <Clock className="h-3 w-3" />, label: 'Documentação' },
  // neutral
  neutral:    { cls: 'badge-neutral',  icon: <Circle className="h-2.5 w-2.5" />, label: 'Neutro' },
  prospeccao: { cls: 'badge-neutral',  icon: <Circle className="h-2.5 w-2.5" />, label: 'Prospecção' },
  // loading
  loading:    { cls: 'badge-neutral',  icon: <Loader2 className="h-3 w-3 animate-spin" />, label: 'Carregando' },
};

export function StatusBadge({ status, label, size = 'md', dot = false }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const config = STATUS_MAP[key] ?? {
    cls: 'badge-neutral',
    icon: <Circle className="h-2.5 w-2.5" />,
    label: status
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : '';

  return (
    <span className={`badge ${config.cls} ${sizeClass}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : config.icon}
      {label ?? config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'md', className = '' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : '';
  return (
    <span className={`badge badge-${variant} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}
