import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { ToastProvider } from '@/components/ToastProvider';

export function AdminLayout() {
  return (
    <RestaurantProvider>
      <div className="serv-theme serv-bg-background min-h-screen flex text-slate-900">
        <Navbar />
        <Outlet />
      </div>
      <ToastProvider />
    </RestaurantProvider>
  );
}
