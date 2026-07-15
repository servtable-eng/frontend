import { Outlet } from 'react-router-dom';
import { RestaurantProvider } from '../contexts/RestaurantContext';
import { ToastProvider } from '@/components/ToastProvider';
import { CustomerPlateProvider } from '@/contexts/CustomerPlateContext';
import { CustomerCartProvider } from '@/contexts/CustomerCartContext';
import '@/styles/customer-responsive.css';

export function CustomerLayout() {
  return (
    <RestaurantProvider>
      <CustomerCartProvider>
        <CustomerPlateProvider>
          <div className="customer-app serv-theme serv-bg-background text-slate-900">
            <Outlet />
          </div>
          <ToastProvider />
        </CustomerPlateProvider>
      </CustomerCartProvider>
    </RestaurantProvider>
  );
}
