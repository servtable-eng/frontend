import { useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronLeft, UtensilsCrossed } from 'lucide-react';

export const customerFont = 'Inter, system-ui, sans-serif';

export const brl = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

export function ImgSafe({ src, alt, style, size = 22 }: { src: string; alt: string; style?: CSSProperties; size?: number }) {
  const [err, setErr] = useState(false);
  return err
    ? <div style={{ ...style, background: '#F0EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1C4BB' }}><UtensilsCrossed size={size} /></div>
    : <img src={src} alt={alt} onError={() => setErr(true)} style={{ ...style, objectFit: 'cover', display: 'block' }} />;
}

export function MobilePageHeader({
  title,
  subtitle,
  badge,
  onBack,
}: {
  title: string;
  subtitle: string;
  badge: ReactNode;
  onBack?: () => void;
}) {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #EAE4DF', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <button type="button" onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <ChevronLeft size={20} color="#374151" />
      </button>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{subtitle}</p>
      </div>
      {badge}
    </header>
  );
}

export function LoadingState({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 14, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <UtensilsCrossed size={28} color="#C9623A" />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1F2937' }}>{title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9CA3AF' }}>{message}</p>
      </div>
      {actionLabel && (
        <button type="button" onClick={onAction} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#C9623A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: customerFont }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function InlineErrorState({ message }: { message: string }) {
  return <p style={{ margin: 0, fontSize: 13, color: '#DC2626' }}>{message}</p>;
}
