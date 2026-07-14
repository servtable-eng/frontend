import { useEffect, useRef, useState } from 'react';
import { ImageOff, UploadCloud, X } from 'lucide-react';
import { DISH_IMAGE_ACCEPT, MAX_DISH_IMAGE_SIZE, validateDishImage } from '@/utils/imageUpload';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

type ImageUploadProps = {
  value: File | null;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export function ImageUpload({ value, currentImageUrl, onChange, disabled = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const selectFile = (file?: File) => {
    if (!file || disabled) return;
    const validationError = validateDishImage(file);
    if (validationError) {
      setError(validationError);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setError('');
    onChange(file);
  };

  const removeNewFile = () => {
    onChange(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayedImage = previewUrl ?? currentImageUrl;

  return (
    <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {displayedImage ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #EAE4DF', aspectRatio: '4/3' }}>
          <img src={resolveImageUrl(displayedImage)} alt={value ? 'Pré-visualização da nova imagem' : 'Imagem atual do prato'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {value && (
            <button type="button" onClick={removeNewFile} disabled={disabled} aria-label="Descartar nova imagem" style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={event => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) inputRef.current?.click(); }}
          onDragOver={event => { event.preventDefault(); if (!disabled) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={event => { event.preventDefault(); setDragOver(false); selectFile(event.dataTransfer.files[0]); }}
          style={{ aspectRatio: '4/3', borderRadius: 10, border: `2px dashed ${dragOver ? '#C9623A' : '#D1C9C2'}`, background: dragOver ? '#FDF5F2' : '#FAFAF9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.65 : 1, transition: 'border-color 0.2s, background 0.2s' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F3F0ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageOff size={20} color="#C9623A" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Arraste ou clique</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6B7280' }}>JPG, JPEG, PNG, WEBP ou GIF · máx. 5 MB</p>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={DISH_IMAGE_ACCEPT} disabled={disabled} style={{ display: 'none' }} onChange={event => selectFile(event.target.files?.[0])} />
      <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} style={{ width: '100%', padding: '9px 0', fontSize: 13, fontWeight: 500, color: '#374151', background: '#fff', cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid #D1C9C2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'Inter, system-ui, sans-serif', opacity: disabled ? 0.65 : 1 }}>
        <UploadCloud size={15} />
        {displayedImage ? 'Substituir imagem' : 'Selecionar arquivo'}
      </button>
      {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: '#DC2626' }}>{error}</p>}
      <div style={{ padding: '12px 14px', background: '#FFFBF5', border: '1px solid #FDE68A', borderRadius: 8 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>Formatos aceitos: JPG, JPEG, PNG, WEBP e GIF. Tamanho máximo: {MAX_DISH_IMAGE_SIZE / 1024 / 1024} MB.</p>
      </div>
    </div>
  );
}
