import { useState } from 'react';

type PrimaryButtonProps = {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function PrimaryButton({
  text,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className,
}: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minHeight: 38,
        border: 'none',
        borderRadius: 8,
        background: isDisabled ? '#D1D5DB' : '#C9623A',
        color: '#fff',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 700,
        opacity: isHovered && !isDisabled ? 0.9 : 1,
        padding: '0 16px',
        transition: 'opacity 0.15s ease, background 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </button>
  );
}
