import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { ToastProvider } from '@/components/ToastProvider';

export function AdminLayout() {
  return (
    <RestaurantProvider>
      <div className="serv-theme serv-bg-background flex h-dvh w-full overflow-hidden text-slate-900">
        <Navbar />
        <main className="h-dvh min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ToastProvider />
    </RestaurantProvider>
  );
}
