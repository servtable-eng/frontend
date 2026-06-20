import { Link } from 'react-router-dom';
import { ROUTES } from './routeConstants';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-lg border border-slate-200 text-center max-w-xl w-full">
        <p className="text-sm font-semibold text-slate-500">404 — Página não encontrada</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">A rota solicitada não existe.</h1>
        <p className="mt-3 text-sm text-slate-600">Volte para a tela inicial do cliente ou para o painel administrativo.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={ROUTES.CUSTOMER_HOME}
            className="inline-flex justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Voltar ao cliente
          </Link>
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="inline-flex justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Ir para admin
          </Link>
        </div>
      </div>
    </div>
  );
}
