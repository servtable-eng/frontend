import { Outlet } from 'react-router-dom';
import { RestaurantProvider } from '../contexts/RestaurantContext';
import { ToastProvider } from '@/components/ToastProvider';
import { CustomerPlateProvider } from '@/contexts/CustomerPlateContext';
import { CustomerCartProvider } from '@/contexts/CustomerCartContext';

export function CustomerLayout() {
  return (
    <RestaurantProvider>
      <CustomerCartProvider>
        <CustomerPlateProvider>
          <div className="serv-theme serv-bg-background min-h-screen text-slate-900">
            <Outlet />
          </div>
          <ToastProvider />
        </CustomerPlateProvider>
      </CustomerCartProvider>
    </RestaurantProvider>
  );
}
