import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { NotFoundPage } from './NotFoundPage';
import { CustomerBuffetHome } from '@/pages/customer';
import {
  Dashboard,
  Orders,
  GestaoImagensBuffet,
  GerenciamentoCardapio,
  OrganizacaoBuffet,
  CadastroPratoForm,
  Configuracoes,
} from '@/pages/admin';
import { DishDetails } from '@/pages/customer/DishDetails';
import { PlateBuilder } from '@/pages/customer/PlateBuilder';
import { PlateReviewWithExtras } from '@/pages/customer/PlateReviewWithExtras';
import { OrderConfirmation } from '@/pages/customer/OrderConfirmation';
import { CustomerCartPage } from '@/pages/customer/CustomerCartPage';
import { OrderTrackingPage } from '@/pages/customer/OrderTrackingPage';
import { RecentOrdersPage } from '@/pages/customer/RecentOrdersPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.CUSTOMER_HOME} replace />} />

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerBuffetHome />} />
          <Route path="dish/:id" element={<DishDetails />} />
          <Route path="plate-builder" element={<PlateBuilder />} />
          <Route path="plate-review" element={<PlateReviewWithExtras />} />
          <Route path="cart" element={<CustomerCartPage />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="orders" element={<RecentOrdersPage />} />
          <Route path="orders/:orderId" element={<OrderTrackingPage />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<GerenciamentoCardapio />} />
          <Route path="extras" element={<GerenciamentoCardapio initialTab="extras" />} />
          <Route path="settings" element={<Configuracoes />} />

          {/* Legacy Portuguese URLs remain available for existing links/bookmarks. */}
          <Route path="cardapio" element={<GerenciamentoCardapio />} />
          <Route path="cardapio/form" element={<CadastroPratoForm />} />
          <Route path="cardapio/form/:dishId" element={<CadastroPratoForm />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="imagens" element={<GestaoImagensBuffet />} />
          <Route path="buffet" element={<OrganizacaoBuffet />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
