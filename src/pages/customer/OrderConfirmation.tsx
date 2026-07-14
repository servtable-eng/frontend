import { CheckCircle2 } from 'lucide-react';
import '../../styles/tokens.css';

const font = 'Inter, system-ui, sans-serif';

export function OrderConfirmation() {
  return (
    <div className="customer-page" style={{ minHeight: '100dvh', maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#F8F6F4', fontFamily: font, textAlign: 'center', padding: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle2 size={32} color="#15803D" />
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.02em' }}>Pedido enviado</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>Seu pedido foi recebido e será preparado em instantes.</p>
      </div>
    </div>
  );
}

export default OrderConfirmation;
