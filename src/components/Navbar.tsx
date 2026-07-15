import { NavLink } from 'react-router-dom';
import { BookOpen, ClipboardList, Home, Settings, UtensilsCrossed, LayoutList } from 'lucide-react';
import { ROUTES } from '@/routes/routeConstants';

const NAV_ITEMS = [
  { icon: Home, label: 'Início', to: ROUTES.ADMIN_DASHBOARD },
  { icon: ClipboardList, label: 'Pedidos', to: ROUTES.ADMIN_ORDERS },
  { icon: BookOpen, label: 'Cardápio', to: ROUTES.ADMIN_MENU },
  { icon: LayoutList, label: 'Organização do Buffet', to: ROUTES.ADMIN_BUFFET },
  { icon: Settings, label: 'Configurações', to: ROUTES.ADMIN_SETTINGS },
];

export function Navbar() {
  return (
    <aside style={{ width: 240, background: '#fff', borderRight: '1px solid #EAE4DF', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UtensilsCrossed size={18} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#C9623A', letterSpacing: '-0.01em' }}>ServTable</span>
      </div>

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === ROUTES.ADMIN_ROOT}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              background: isActive ? '#C9623A' : 'transparent',
              color: isActive ? '#fff' : '#6B7280',
            })}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Navbar;
