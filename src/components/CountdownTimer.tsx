import { useEffect, useState, type CSSProperties } from 'react';
import type { OrderStatus } from '@/types/order';

const SECOND_IN_MS = 1000;

const TERMINAL_LABELS: Partial<Record<OrderStatus, string>> = {
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

export function getRemainingMilliseconds(estimatedDeliveryAt?: string | null, now = Date.now()) {
  if (!estimatedDeliveryAt) return null;

  const deliveryTime = new Date(estimatedDeliveryAt).getTime();
  if (Number.isNaN(deliveryTime)) return null;

  return deliveryTime - now;
}

const padTime = (value: number) => String(value).padStart(2, '0');

export function formatRemainingTime(remainingMilliseconds: number) {
  const absoluteMilliseconds = Math.abs(remainingMilliseconds);
  const totalSeconds = Math.floor(absoluteMilliseconds / SECOND_IN_MS);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = hours > 0
    ? `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`
    : `${padTime(minutes)}:${padTime(seconds)}`;

  return remainingMilliseconds < 0 ? `Atrasado ${formattedTime}` : formattedTime;
}

export function CountdownTimer({
  estimatedDeliveryAt,
  status,
  className,
  style,
}: {
  estimatedDeliveryAt?: string | null;
  status?: OrderStatus;
  className?: string;
  style?: CSSProperties;
}) {
  const [now, setNow] = useState(() => Date.now());
  const terminalLabel = status ? TERMINAL_LABELS[status] : undefined;
  const remainingMilliseconds = terminalLabel ? null : getRemainingMilliseconds(estimatedDeliveryAt, now);
  const isOverdue = typeof remainingMilliseconds === 'number' && remainingMilliseconds < 0;

  useEffect(() => {
    if (terminalLabel) return undefined;

    const intervalId = window.setInterval(() => setNow(Date.now()), SECOND_IN_MS);
    return () => window.clearInterval(intervalId);
  }, [terminalLabel]);

  const text = terminalLabel
    ?? (typeof remainingMilliseconds === 'number' ? formatRemainingTime(remainingMilliseconds) : 'Sem previsão');

  return (
    <span
      className={className}
      style={{
        ...style,
        color: terminalLabel ? '#6B7280' : isOverdue ? '#DC2626' : style?.color,
      }}
    >
      {text}
    </span>
  );
}
