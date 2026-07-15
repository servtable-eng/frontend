import { Skeleton } from './Skeleton';

const LoadingRegion = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div role="status" aria-busy="true" aria-label="Carregando conteúdo" className={className}>{children}<span className="sr-only">Carregando...</span></div>
);

export function ImageSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton rounded={false} className={`h-full min-h-32 w-full ${className}`} />;
}

export function RestaurantHeaderSkeleton() {
  return <LoadingRegion className="flex items-center gap-3 border-b serv-border bg-white p-4"><Skeleton circle width={44} height={44} /><div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-5 w-44 max-w-full" /><Skeleton className="h-3 w-28" /></div><Skeleton className="h-7 w-20 rounded-lg" /></LoadingRegion>;
}

export function CategoryFilterSkeleton({ count = 5 }: { count?: number }) {
  return <LoadingRegion className="flex gap-2 overflow-hidden py-2">{Array.from({ length: count }, (_, i) => <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />)}</LoadingRegion>;
}

export function DishCardSkeleton() {
  return <LoadingRegion className="flex h-full min-h-[430px] flex-col overflow-hidden rounded-[20px] border serv-border bg-white"><Skeleton rounded={false} className="h-[clamp(190px,34dvh,260px)] w-full shrink-0" /><div className="flex flex-1 flex-col gap-3 p-4"><Skeleton className="h-6 w-3/4" /><div className="space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-11/12" /><Skeleton className="h-3 w-2/3" /></div><div className="mt-auto space-y-3 border-t serv-border pt-3"><div className="flex items-center justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-16 rounded-full" /></div><Skeleton className="h-2 w-full rounded-full" /><div className="grid grid-cols-2 gap-2"><Skeleton className="h-11 rounded-xl" /><Skeleton className="h-11 rounded-xl" /></div></div></div></LoadingRegion>;
}

export function DishDetailsSkeleton() {
  return <LoadingRegion className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col overflow-hidden bg-[#F8F6F4]"><Skeleton rounded={false} className="h-[clamp(220px,44dvh,340px)] w-full shrink-0" /><div className="flex-1 space-y-5 bg-white p-5"><div className="flex justify-between gap-4"><div className="flex-1 space-y-2"><Skeleton className="h-7 w-3/4" /><Skeleton className="h-5 w-24 rounded-full" /></div><Skeleton className="h-7 w-20" /></div><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div><div className="space-y-3 border-t serv-border pt-4"><Skeleton className="h-4 w-28" /><div className="flex gap-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}</div></div><div className="space-y-3 border-t serv-border pt-4"><div className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-5 w-14" /></div><Skeleton className="h-2 w-full rounded-full" /></div></div><div className="grid grid-cols-[1fr_2fr] gap-3 border-t serv-border bg-white p-4"><Skeleton className="h-12 rounded-xl" /><Skeleton className="h-12 rounded-xl" /></div></LoadingRegion>;
}

export function CustomerHomeSkeleton() {
  return <LoadingRegion className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col overflow-hidden bg-[#F8F6F4]"><div className="border-b serv-border bg-white px-4 pb-3 pt-3.5"><div className="mb-3 flex items-center gap-2"><Skeleton className="h-9 w-9 shrink-0 rounded-[10px]" /><Skeleton className="h-5 w-48 max-w-[45vw]" /><div className="ml-auto flex gap-2"><Skeleton className="h-11 w-11 rounded-[10px]" /><Skeleton className="h-11 w-11 rounded-[10px]" /></div></div><SearchBarSkeleton /></div><div className="border-b serv-border bg-white px-4 py-2"><CategoryFilterSkeleton /></div><div className="px-4 py-3"><Skeleton className="h-3 w-48" /></div><div className="flex flex-1 gap-3 overflow-hidden px-4 pb-4">{Array.from({ length: 3 }, (_, i) => <div key={i} className="w-[min(340px,86vw)] shrink-0"><DishCardSkeleton /></div>)}</div><div className="flex items-center gap-3 border-t serv-border bg-white px-4 py-3"><div className="flex-1 space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-36" /></div><Skeleton className="h-12 w-36 rounded-xl" /></div></LoadingRegion>;
}

export function PlateBuilderSkeleton() {
  return <LoadingRegion className="grid gap-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <DishCardSkeleton key={i} />)}</div><div className="sticky bottom-0 rounded-xl border serv-border bg-white p-4"><Skeleton className="mb-3 h-4 w-36" /><Skeleton className="h-12 w-full rounded-xl" /></div></LoadingRegion>;
}

export function CartSkeleton() {
  return <LoadingRegion className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col bg-[#F8F6F4]"><RestaurantHeaderSkeleton /><div className="flex-1 space-y-3 p-3 pb-28 sm:p-4 sm:pb-28"><section className="space-y-3 rounded-xl border serv-border bg-white p-4"><Skeleton className="h-3 w-36" />{Array.from({ length: 2 }, (_, i) => <div key={i} className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-11 w-full rounded-[10px]" /></div>)}</section>{Array.from({ length: 3 }, (_, i) => <div key={i} className="flex gap-3 rounded-xl border serv-border bg-white p-3"><Skeleton className="h-20 w-20 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-3 w-1/2" /><div className="flex justify-between pt-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24 rounded-lg" /></div></div></div>)}<section className="space-y-3 rounded-xl border serv-border bg-white p-4"><Skeleton className="h-3 w-20" />{Array.from({ length: 3 }, (_, i) => <div key={i} className="flex justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-16" /></div>)}</section></div><div className="border-t serv-border bg-white p-4"><div className="mb-3 flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-7 w-24" /></div><Skeleton className="h-12 w-full rounded-xl" /></div></LoadingRegion>;
}

export function OrderCardSkeleton() {
  return <LoadingRegion className="rounded-[14px] border serv-border bg-white p-3.5"><div className="flex gap-2.5"><Skeleton className="h-[38px] w-[38px] shrink-0 rounded-[10px]" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-20" /></div><div className="space-y-2"><Skeleton className="h-6 w-24 rounded-lg" /><Skeleton className="ml-auto h-3 w-14" /></div></div><div className="mt-3 grid grid-cols-4 gap-1.5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-1.5 rounded-full" />)}</div><div className="mt-3 flex justify-between border-t serv-border pt-2.5"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-20" /></div><div className="mt-3 grid grid-cols-[1fr_44px] gap-2"><Skeleton className="h-11 rounded-xl" /><Skeleton className="h-11 rounded-xl" /></div></div></div></LoadingRegion>;
}

export function OrderTrackingSkeleton() {
  return <LoadingRegion className="grid gap-3 p-3 sm:p-4"><div className="rounded-[14px] border serv-border bg-white p-4"><Skeleton className="mb-3 h-3 w-16" /><div className="mb-5 flex justify-between gap-3"><div className="space-y-2"><Skeleton className="h-6 w-44 max-w-[45vw]" /><Skeleton className="h-4 w-32" /></div><Skeleton className="h-7 w-20" /></div><div className="grid grid-cols-4 gap-2">{Array.from({ length: 4 }, (_, i) => <div key={i} className="space-y-2"><Skeleton className="h-1.5 w-full rounded-full" /><div className="flex items-center gap-1"><Skeleton circle className="h-3 w-3" /><Skeleton className="h-3 w-4/5" /></div></div>)}</div></div><div className="rounded-[14px] border serv-border bg-white p-4"><Skeleton className="mb-3 h-3 w-24" />{Array.from({ length: 3 }, (_, i) => <div key={i} className="flex gap-3 border-b serv-border py-3 first:pt-0 last:border-0 last:pb-0"><Skeleton className="h-14 w-14 shrink-0 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div><Skeleton className="h-4 w-16" /></div>)}</div><div className="space-y-3 rounded-[14px] border serv-border bg-white p-4"><Skeleton className="h-3 w-20" />{Array.from({ length: 3 }, (_, i) => <div key={i} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-20" /></div>)}<div className="border-t serv-border pt-3"><div className="flex justify-between"><Skeleton className="h-5 w-16" /><Skeleton className="h-6 w-24" /></div></div></div></LoadingRegion>;
}

export function DashboardMetricSkeleton() {
  return <LoadingRegion className="rounded-xl border serv-border bg-white p-5"><div className="mb-3 flex items-center gap-2"><Skeleton circle width={18} height={18} /><Skeleton className="h-4 w-28" /></div><Skeleton className="h-9 w-16" /></LoadingRegion>;
}

export function RestaurantTableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return <LoadingRegion className="overflow-hidden rounded-xl border serv-border bg-white"><div className="grid gap-4 border-b serv-border bg-gray-50/50 px-5 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{Array.from({ length: columns }, (_, i) => <Skeleton key={i} className="h-3 w-16" />)}</div>{Array.from({ length: rows }, (_, row) => <div key={row} className="grid gap-4 border-b serv-border px-5 py-4 last:border-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{Array.from({ length: columns }, (_, col) => <Skeleton key={col} className="h-4 w-3/4" />)}</div>)}</LoadingRegion>;
}

export const TableSkeleton = RestaurantTableSkeleton;
export const MetricSkeleton = DashboardMetricSkeleton;

export function ModalSkeleton() {
  return <LoadingRegion className="w-full max-w-lg space-y-5 rounded-2xl border serv-border bg-white p-6 shadow-xl"><Skeleton className="h-6 w-1/2" /><div className="space-y-3"><Skeleton className="h-11 w-full" /><Skeleton className="h-24 w-full" /></div><div className="flex justify-end gap-3"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-28" /></div></LoadingRegion>;
}

export function ExtraItemSkeleton() {
  return <LoadingRegion className="w-40 shrink-0 overflow-hidden rounded-xl border serv-border bg-white"><Skeleton rounded={false} className="h-24 w-full" /><div className="space-y-2 p-3"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-16" /><Skeleton className="h-8 w-full rounded-lg" /></div></LoadingRegion>;
}

export function SearchBarSkeleton() {
  return <LoadingRegion className="flex h-11 w-full items-center gap-3 rounded-xl border serv-border bg-white px-4"><Skeleton circle width={18} height={18} /><Skeleton className="h-4 w-2/5" /></LoadingRegion>;
}

export function AdminMenuSkeleton({ columns = 8, rows = 8 }: { columns?: number; rows?: number }) {
  return <LoadingRegion className="space-y-6"><div className="flex flex-wrap items-center gap-3 rounded-xl border serv-border bg-white p-4"><div className="w-full sm:w-80"><SearchBarSkeleton /></div><Skeleton className="h-11 w-full sm:w-56 rounded-lg" /><div className="ml-auto flex gap-2"><Skeleton className="h-7 w-28 rounded-full" /><Skeleton className="h-7 w-32 rounded-full" /></div></div><RestaurantTableSkeleton rows={rows} columns={columns} /></LoadingRegion>;
}

export function AdminOrderCardSkeleton() {
  return <LoadingRegion className="rounded-lg border border-l-4 serv-border bg-white p-4 space-y-3"><div className="flex justify-between gap-3"><div className="space-y-2"><Skeleton className="h-6 w-28" /><Skeleton className="h-3 w-16" /></div><Skeleton className="h-6 w-24 rounded-full" /></div><div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-40" /></div><div className="grid grid-cols-2 gap-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /></div><div className="flex justify-end border-t serv-border pt-3"><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="ml-auto h-3 w-20" /></div></div><Skeleton className="h-9 w-full rounded-lg" /></LoadingRegion>;
}

export function AdminOrdersBoardSkeleton() {
  return <LoadingRegion className="flex h-full min-h-0 gap-4 overflow-hidden"><div className="min-w-0 flex-1 overflow-hidden"><div className="grid h-full min-w-[1168px] grid-cols-4 gap-4">{Array.from({ length: 4 }, (_, column) => <section key={column} className="overflow-hidden rounded-xl border serv-border bg-gray-50/50"><div className="flex h-14 items-center gap-2 border-b serv-border bg-white px-4"><Skeleton circle className="h-4 w-4" /><Skeleton className="h-5 w-24" /><Skeleton className="ml-auto h-5 w-7 rounded-full" /></div><div className="space-y-3 p-3">{Array.from({ length: 2 }, (_, card) => <AdminOrderCardSkeleton key={card} />)}</div></section>)}</div></div><aside className="hidden w-[360px] shrink-0 space-y-5 rounded-xl border serv-border bg-white p-5 xl:block"><div className="flex justify-between"><div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-44" /></div><Skeleton className="h-6 w-20 rounded-full" /></div><div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }, (_, i) => <div key={i} className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-24" /></div>)}</div>{Array.from({ length: 3 }, (_, i) => <div key={i} className="space-y-2 rounded-lg border serv-border p-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>)}</aside></LoadingRegion>;
}

export function AdminSettingsSkeleton() {
  return <LoadingRegion className="max-w-[720px] overflow-hidden rounded-xl border serv-border bg-white"><div className="space-y-2 border-b serv-border px-5 py-5"><Skeleton className="h-6 w-64 max-w-full" /><Skeleton className="h-4 w-full max-w-lg" /></div><div className="space-y-5 p-5"><div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-11 w-full max-w-80 rounded-lg" /></div><div className="flex gap-4"><Skeleton className="h-4 w-52" /><Skeleton className="h-4 w-40" /></div><Skeleton className="h-11 w-32 rounded-lg" /></div></LoadingRegion>;
}

export function AdminDishFormSkeleton() {
  return <LoadingRegion className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-5">{Array.from({ length: 2 }, (_, section) => <section key={section} className="space-y-4 rounded-xl border serv-border bg-white p-6"><Skeleton className="h-4 w-40" />{Array.from({ length: section ? 3 : 4 }, (_, field) => <div key={field} className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className={`${field === 3 ? 'h-24' : 'h-11'} w-full rounded-lg`} /></div>)}</section>)}</div><aside className="space-y-4 rounded-xl border serv-border bg-white p-5"><Skeleton className="h-4 w-32" /><Skeleton className="aspect-square w-full rounded-xl" /><Skeleton className="h-11 w-full rounded-lg" /></aside></LoadingRegion>;
}

export function DeliveryRouteSkeleton() {
  return <LoadingRegion className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <article key={i} className="space-y-4 rounded-xl border serv-border bg-white p-5"><div className="flex justify-between"><Skeleton className="h-5 w-36" /><Skeleton className="h-6 w-20 rounded-full" /></div><Skeleton className="h-4 w-2/3" /><div className="space-y-2 border-l-2 serv-border pl-4"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-3/5" /></div><Skeleton className="h-10 w-full rounded-lg" /></article>)}</LoadingRegion>;
}

export function InventoryTableSkeleton() {
  return <AdminMenuSkeleton columns={7} rows={10} />;
}
