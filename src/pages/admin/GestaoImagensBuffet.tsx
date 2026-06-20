import { useRef, useState } from 'react';
import {
  AlertCircle, Clock, UploadCloud, CheckCircle2, X, RefreshCw, ImagePlus, Images,
} from 'lucide-react';
import { Button, Badge } from '@workspace/ui';
import '@workspace/ui/styles.css';
import { DISH_IMAGE_ACCEPT, isAllowedDishImage } from '@/utils/imageUpload';
import '../../styles/tokens.css';

/* ─── Nav ─────────────────────────────────────────────────────────── */
/* ─── Mock data ────────────────────────────────────────────────────── */
type ImageDish = {
  id: number;
  name: string;
  category: string;
  lastUpdate: string;
  image: string;
  stale: boolean;
};

const DISHES: ImageDish[] = [
  { id: 1, name: 'Frango Grelhado',       category: 'Quentes',  lastUpdate: '28/05/2026', image: '/__mockup/images/frango.png',       stale: false },
  { id: 2, name: 'Arroz com Feijão',      category: 'Quentes',  lastUpdate: '12/03/2026', image: '/__mockup/images/arroz-feijao.png', stale: true  },
  { id: 3, name: 'Salada Caesar',         category: 'Saladas',  lastUpdate: '25/05/2026', image: '/__mockup/images/salada.png',       stale: false },
  { id: 4, name: 'Feijoada',              category: 'Pratos',   lastUpdate: '05/01/2026', image: '/__mockup/images/feijoada.png',     stale: true  },
  { id: 5, name: 'Filé de Peixe',         category: 'Quentes',  lastUpdate: '27/05/2026', image: '/__mockup/images/peixe.png',       stale: false },
  { id: 6, name: 'Pudim de Leite',        category: 'Sobremesas', lastUpdate: '10/02/2026', image: '/__mockup/images/pudim.png',     stale: true  },
  { id: 7, name: 'Macarrão à Bolonhesa',  category: 'Quentes',  lastUpdate: '15/04/2026', image: '/__mockup/images/arroz-feijao.png', stale: false },
  { id: 8, name: 'Mousse de Maracujá',    category: 'Sobremesas', lastUpdate: '01/03/2026', image: '/__mockup/images/pudim.png',     stale: true  },
];

/* ─── Shared styles ────────────────────────────────────────────────── */
const font = 'Inter, system-ui, sans-serif';

/* ─── Sub-components ───────────────────────────────────────────────── */
function ImageCell({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{ width: '100%', aspectRatio: '4/3', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB' }}>
        <Images size={28} />
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt} onError={() => setErr(true)}
      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
    />
  );
}

type UploadPhase = 'idle' | 'dragging' | 'preview' | 'confirmed';

function UploadPanel({
  dish,
  onClose,
}: {
  dish: ImageDish;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [imgErr, setImgErr]   = useState(false);

  const handleFile = (file: File | null) => {
    if (!file || !isAllowedDishImage(file)) return;
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target?.result as string);
      setPhase('preview');
    };
    reader.readAsDataURL(file);
  };

  const confirmUpload = () => setPhase('confirmed');
  const resetUpload   = () => { setPhase('idle'); setPreview(null); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: font }}>

      {/* Panel header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #EAE4DF', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {dish.stale ? 'Imagem desatualizada' : 'Atualizar imagem'}
          </p>
          <h2 style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em' }}>{dish.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <Clock size={12} color="#9CA3AF" />
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Última atualização: {dish.lastUpdate}</span>
            {dish.stale && <Badge variant="warning" size="sm" dot>Desatualizada</Badge>}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 4, borderRadius: 6 }}>
          <X size={18} />
        </button>
      </div>

      {/* Panel body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Current image preview strip */}
        <div>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Imagem atual
          </p>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #EAE4DF', position: 'relative' }}>
            {imgErr ? (
              <div style={{ aspectRatio: '16/6', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB' }}>
                <Images size={32} />
              </div>
            ) : (
              <img src={dish.image} alt={dish.name} onError={() => setImgErr(true)}
                style={{ width: '100%', aspectRatio: '16/6', objectFit: 'cover', display: 'block' }} />
            )}
            {dish.stale && (
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,158,11,0.9)', borderRadius: 6, padding: '4px 9px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertCircle size={12} color="#fff" />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Foto desatualizada</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload area */}
        {phase === 'confirmed' ? (
          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={36} color="#15803D" />
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#15803D' }}>Imagem atualizada!</p>
            <p style={{ margin: 0, fontSize: 13, color: '#166534', textAlign: 'center' }}>
              A nova foto de <strong>{dish.name}</strong> foi salva com sucesso.
            </p>
            {preview && (
              <img src={preview} alt="Nova imagem" style={{ width: '100%', aspectRatio: '16/6', objectFit: 'cover', borderRadius: 8, border: '1px solid #86EFAC' }} />
            )}
            <button
              onClick={resetUpload}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}
            >
              <RefreshCw size={14} /> Substituir novamente
            </button>
          </div>
        ) : phase === 'preview' && preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Nova imagem
            </p>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid #C9623A' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', aspectRatio: '16/6', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={resetUpload}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={14} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>
              A imagem será associada ao prato assim que você confirmar.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" size="sm" onClick={resetUpload}>Cancelar</Button>
              <Button variant="primary"   size="sm" onClick={confirmUpload}>Confirmar substituição</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Substituir imagem
              </p>
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setPhase('dragging'); }}
                onDragLeave={() => setPhase('idle')}
                onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${phase === 'dragging' ? '#C9623A' : '#D1C9C2'}`,
                  borderRadius: 12,
                  background: phase === 'dragging' ? '#FDF5F2' : '#FAFAF9',
                  padding: '36px 24px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: phase === 'dragging' ? '#FDF5F2' : '#F3F0ED',
                  border: `2px solid ${phase === 'dragging' ? '#C9623A' : '#EAE4DF'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <UploadCloud size={24} color={phase === 'dragging' ? '#C9623A' : '#9CA3AF'} />
                </div>

                {phase === 'dragging' ? (
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#C9623A' }}>Solte para enviar</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#b3562f' }}>A imagem será carregada</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1F2937' }}>Arraste a imagem aqui</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>ou clique para selecionar um arquivo</p>
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9CA3AF' }}>PNG, JPG, WEBP ou GIF · máx. 5 MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept={DISH_IMAGE_ACCEPT} style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0] ?? null)} />
            </div>

            {/* Tip */}
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#0369A1', lineHeight: 1.55 }}>
                <strong>Recomendado:</strong> proporção 4:3, resolução mínima 800×600px. Imagens muito pequenas ficam borradas no app do cliente.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main screen ──────────────────────────────────────────────────── */
export function GestaoImagensBuffet() {
  const [selected, setSelected] = useState<ImageDish | null>(null);
  const [filter, setFilter]     = useState<'all' | 'stale'>('all');

  const filtered = filter === 'stale' ? DISHES.filter(d => d.stale) : DISHES;
  const staleCount = DISHES.filter(d => d.stale).length;

  return (
    <main style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden', fontFamily: font }}>

        {/* Left: dish grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px' }}>
          <div style={{ maxWidth: selected ? 9999 : 960, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
                  Gestão de Imagens
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
                  {DISHES.length} pratos · {staleCount} com imagem desatualizada
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {staleCount > 0 && (
                  <Badge variant="warning" size="sm" dot>{staleCount} desatualizadas</Badge>
                )}
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', border: '1px solid #EAE4DF', borderRadius: 10, padding: 4, width: 'fit-content' }}>
              {(['all', 'stale'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: font,
                    background: filter === f ? '#C9623A' : 'transparent',
                    color:      filter === f ? '#fff'    : '#6B7280',
                    transition: 'all 0.15s',
                  }}
                >
                  {f === 'all' ? `Todos (${DISHES.length})` : `Desatualizados (${staleCount})`}
                </button>
              ))}
            </div>

            {/* Dish grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: selected ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: 16,
              transition: 'grid-template-columns 0.2s',
            }}>
              {filtered.map(dish => {
                const isSelected = selected?.id === dish.id;
                return (
                  <div
                    key={dish.id}
                    style={{
                      background: '#fff',
                      border: `1px solid ${isSelected ? '#C9623A' : '#EAE4DF'}`,
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: isSelected ? '0 0 0 2px rgba(201,98,58,0.15)' : undefined,
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <ImageCell src={dish.image} alt={dish.name} />
                      {dish.stale && (
                        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(245,158,11,0.92)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={11} color="#fff" />
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Desatualizada</span>
                        </div>
                      )}
                    </div>

                    {/* Info + actions */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1F2937', lineHeight: 1.3 }}>{dish.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                          <Clock size={11} color="#9CA3AF" />
                          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Atualizado em {dish.lastUpdate}</span>
                        </div>
                      </div>

                      {/* Two action buttons */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setSelected(isSelected ? null : dish)}
                          style={{
                            flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600,
                            fontFamily: font, cursor: 'pointer', borderRadius: 8,
                            border: `1px solid ${isSelected ? '#C9623A' : '#EAE4DF'}`,
                            background: isSelected ? '#FDF5F2' : '#fff',
                            color: isSelected ? '#C9623A' : '#374151',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}
                        >
                          <RefreshCw size={12} />
                          Atualizar
                        </button>
                        <button
                          onClick={() => setSelected(isSelected ? null : dish)}
                          style={{
                            flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600,
                            fontFamily: font, cursor: 'pointer', borderRadius: 8,
                            border: '1px solid #EAE4DF',
                            background: '#fff',
                            color: '#374151',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            transition: 'all 0.15s',
                          }}
                        >
                          <ImagePlus size={12} />
                          Substituir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: upload panel */}
        {selected && (
          <div style={{
            width: 360, flexShrink: 0,
            background: '#fff', borderLeft: '1px solid #EAE4DF',
            display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto',
          }}>
            <UploadPanel
              key={selected.id}
              dish={selected}
              onClose={() => setSelected(null)}
            />
          </div>
        )}

        {/* Empty state when no dish selected */}
        {!selected && (
          <div style={{ display: 'none' }} />
        )}
    </main>
  );
}
