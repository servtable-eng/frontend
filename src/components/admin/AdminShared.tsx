import { useState, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}

export function AvailabilityToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? '#22C55E' : '#D1D5DB',
        transition: 'background 0.2s',
        padding: 0, flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

export function ImageCell({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: '#F3F4F6', border: '1px solid #EAE4DF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#D1D5DB',
      }}>
        <AlertCircle size={20} />
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt}
      onError={() => setFailed(true)}
      style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #EAE4DF', display: 'block' }}
    />
  );
}

export function ErrorState({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{ padding: '12px 20px', color: '#DC2626', background: '#FEF2F2', fontSize: 14 }}>
      {message}
    </div>
  );
}
