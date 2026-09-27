"use client";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  LayoutDashboard,
  Megaphone,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserCog,
} from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { categories, formatMoney, products, stores } from "@/lib/data";
import { getStoreProduct, markSyncFailure, simulatePriceUpdate, updateOrderStatus } from "@/lib/store";
import { useDemoState } from "@/lib/useDemoState";
import type { OrderStatus, StoreId } from "@/lib/types";

type Tab = "painel" | "pedidos" | "catalogo" | "campanhas" | "integracao";

const profiles = [
  { id: "admin", label: "Administrador do grupo", icon: ShieldCheck },
  { id: "manager", label: "Gerente de loja", icon: UserCog },
  { id: "catalog", label: "Operador de catálogo", icon: Boxes },
  { id: "picker", label: "Separador", icon: ShoppingBag },
];

const statuses: { id: OrderStatus; label: string }[] = [
  { id: "recebido", label: "Recebido" },
  { id: "separacao", label: "Em separação" },
  { id: "pronto", label: "Pronto" },
  { id: "entrega", label: "Saiu para entrega" },
  { id: "concluido", label: "Concluído" },
];

export default function CrmPage() {
  const { state, setState, ready } = useDemoState();
  const [profile, setProfile] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("painel");
  const [storeFilter, setStoreFilter] = useState<StoreId | "todas">("todas");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "todos">("todos");
  const [selectedProductId, setSelectedProductId] = useState("arroz-branco-5kg");
  const [integrationStore, setIntegrationStore] = useState<StoreId>("fenix-jaciara");

  const filteredOrders = state.orders.filter((order) => (storeFilter === "todas" || order.storeId === storeFilter) && (statusFilter === "todos" || order.status === statusFilter));
  const kpis = useMemo(() => {
    const total = state.orders.reduce((sum, order) => sum + order.total, 0);
    return {
      orders: state.orders.length,
      revenue: total,
      pending: state.orders.filter((order) => order.status !== "concluido").length,
      storesWithOrders: new Set(state.orders.map((order) => order.storeId)).size,
    };
  }, [state.orders]);

  if (!ready) return <main className="crm-shell grid place-items-center p-6"><p className="rounded-full bg-white px-5 py-3 text-sm font-bold shadow">Carregando CRM demonstrativo...</p></main>;

  if (!profile) {
    return (
      <main className="crm-shell min-h-screen p-4">
        <section className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-5xl place-items-center">
          <div className="w-full rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-black uppercase tracking-wider text-red-700">CRM interno demonstrativo</p>
            <h1 className="mt-3 text-3xl font-black">Escolha um perfil para apresentar a operação.</h1>
            <p className="mt-3 max-w-2xl text-zinc-600">Este acesso é apenas visual para protótipo. Ele não representa segurança de produção, não autentica funcionários e não acessa dados reais.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {profiles.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setProfile(item.id)} className="btn-gradient rounded-2xl p-4 text-left transition">
                    <Icon className="text-red-700" />
                    <p className="mt-4 font-black">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="crm-shell">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 lg:flex-row">
        <aside className="h-fit rounded-[1.5rem] bg-zinc-950 p-4 text-white lg:sticky lg:top-4 lg:w-72">
          <div className="flex items-center gap-3">
            <img src="/logos/fenix.jpeg" alt="Logotipo Fênix Supermercado" className="h-12 w-12 rounded-xl bg-white object-contain" />
            <div>
              <p className="text-sm font-black">Grupo Fênix</p>
              <p className="text-xs text-zinc-300">CRM demonstrativo</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-5 text-zinc-200">Perfil ativo: {profiles.find((item) => item.id === profile)?.label}. Sem autenticação real nesta versão.</p>
          <nav className="mt-4 grid gap-2">
            <NavButton tab="painel" current={tab} setTab={setTab} icon={<LayoutDashboard size={18} />} label="Painel" />
            <NavButton tab="pedidos" current={tab} setTab={setTab} icon={<ShoppingBag size={18} />} label="Pedidos" />
            <NavButton tab="catalogo" current={tab} setTab={setTab} icon={<Boxes size={18} />} label="Catálogo" />
            <NavButton tab="campanhas" current={tab} setTab={setTab} icon={<Megaphone size={18} />} label="Campanhas" />
            <NavButton tab="integracao" current={tab} setTab={setTab} icon={<RefreshCw size={18} />} label="Integração" />
          </nav>
          <a href="/" className="mt-4 block rounded-xl bg-white px-4 py-3 text-center font-black text-zinc-950">Abrir app do cliente</a>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold text-zinc-500">Operação por unidade</p>
                <h1 className="text-2xl font-black">Plataforma Grupo Fênix</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                {stores.map((store) => <Badge key={store.id} color={store.palette.primary}>{store.shortName}</Badge>)}
              </div>
            </div>
          </header>

          {state.syncFailureStoreId && (
            <div className="mb-4 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertTriangle className="shrink-0" />
              <p className="text-sm font-bold">Falha demonstrativa de sincronização ativa. Itens desatualizados precisam ser corrigidos antes de concluir uma compra.</p>
            </div>
          )}

          {tab === "painel" && (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-4">
                <Kpi icon={<ShoppingBag />} label="Pedidos" value={String(kpis.orders)} />
                <Kpi icon={<BarChart3 />} label="Total demonstrativo" value={formatMoney(kpis.revenue)} />
                <Kpi icon={<RefreshCw />} label="Em andamento" value={String(kpis.pending)} />
                <Kpi icon={<Store />} label="Unidades com pedidos" value={String(kpis.storesWithOrders)} />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {stores.map((store) => {
                  const orders = state.orders.filter((order) => order.storeId === store.id);
                  return (
                    <article key={store.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                      <div className="flex items-center gap-3">
                        <img src={store.logo} alt={`Logotipo ${store.shortName}`} className="h-14 w-14 rounded-xl object-contain ring-1 ring-black/10" />
                        <div><h2 className="font-black" style={{ color: store.palette.primary }}>{store.shortName}</h2><p className="text-sm text-zinc-500">{orders.length} pedidos demonstrativos</p></div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {statuses.slice(0, 4).map((status) => <Line key={status.id} label={status.label} value={String(orders.filter((order) => order.status === status.id).length)} />)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "pedidos" && (
            <div className="grid gap-4">
              <Filters storeFilter={storeFilter} setStoreFilter={setStoreFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
              {filteredOrders.length ? filteredOrders.map((order) => {
                const store = stores.find((item) => item.id === order.storeId)!;
                const blocked = order.items.some((item) => getStoreProduct(item.productId, order.storeId, state).outdated);
                return (
                  <article key={order.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <p className="text-sm font-bold" style={{ color: store.palette.primary }}>{store.shortName}</p>
                        <h2 className="text-xl font-black">{order.id} - {order.customerName}</h2>
                        <p className="text-sm text-zinc-500">{order.fulfillment === "entrega" ? "Entrega" : "Retirada"} - {order.timeSlot}</p>
                      </div>
                      <select value={order.status} onChange={(event) => setState((current) => updateOrderStatus(current, order.id, event.target.value as OrderStatus))} disabled={blocked && order.status !== "recebido"} className="rounded-xl border px-3 py-2 font-bold disabled:bg-red-50 disabled:text-red-700">
                        {statuses.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
                      </select>
                    </div>
                    {blocked && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">Este pedido contém item desatualizado. Corrija na integração simulada antes de avançar.</p>}
                    <div className="mt-4 grid gap-2">
                      {order.items.map((item) => {
                        const info = getStoreProduct(item.productId, order.storeId, state);
                        return (
                          <div key={item.productId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-zinc-50 p-3 text-sm">
                            <span className="font-bold">{item.title} x {item.quantity}</span>
                            <span>{formatMoney(item.unitPrice)}</span>
                            <button onClick={() => setState((current) => ({ ...current, orders: current.orders.map((saved) => saved.id === order.id ? { ...saved, items: saved.items.map((savedItem) => savedItem.productId === item.productId ? { ...savedItem, unavailable: true, substitution: "Produto similar sugerido pela loja" } : savedItem) } : saved) }))} className="btn-gradient rounded-lg px-3 py-1 font-bold">Marcar indisponível</button>
                            {item.unavailable && <span className="w-full rounded-lg bg-amber-50 px-3 py-2 font-bold text-amber-800">Substituição proposta: {item.substitution}</span>}
                            {info.outdated && <span className="w-full rounded-lg bg-red-50 px-3 py-2 font-bold text-red-700">Preço desatualizado</span>}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              }) : <Empty title="Sem pedidos neste filtro" />}
            </div>
          )}

          {tab === "catalogo" && (
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <h2 className="text-xl font-black">Cadastro editorial de produtos</h2>
                <p className="mt-1 text-sm text-zinc-600">Edição visual demonstrativa. As mudanças editoriais abaixo ficam no protótipo local.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input className="rounded-xl border px-3 py-2" defaultValue="Produto demonstrativo" aria-label="Título do produto" />
                  <select className="rounded-xl border px-3 py-2">{categories.map((item) => <option key={item.id}>{item.label}</option>)}</select>
                  <input className="rounded-xl border px-3 py-2" defaultValue="/products/arroz-branco-5kg.svg" aria-label="Imagem do produto" />
                  <label className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 font-bold"><input type="checkbox" defaultChecked /> Destaque</label>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {products.slice(0, 12).map((product) => (
                  <article key={product.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                    <img src={product.image} alt={product.alt} className="h-32 w-full rounded-xl bg-zinc-50 object-contain" />
                    <p className="mt-3 font-black">{product.title}</p>
                    <p className="text-sm text-zinc-500">{product.brand} - {categories.find((item) => item.id === product.category)?.label}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "campanhas" && (
            <div className="grid gap-4 md:grid-cols-3">
              {state.banners.map((banner) => {
                const store = stores.find((item) => item.id === banner.storeId)!;
                return (
                  <article key={banner.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <p className="text-sm font-bold" style={{ color: store.palette.primary }}>{store.shortName}</p>
                    <input className="mt-3 w-full rounded-xl border px-3 py-2 font-black" defaultValue={banner.title} />
                    <textarea className="mt-2 min-h-24 w-full rounded-xl border px-3 py-2 text-sm" defaultValue={banner.subtitle} />
                    <label className="mt-3 flex items-center gap-2 text-sm font-bold"><input type="checkbox" defaultChecked={banner.active} /> Campanha ativa</label>
                  </article>
                );
              })}
            </div>
          )}

          {tab === "integracao" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <h2 className="text-xl font-black">Integração simulada de preços</h2>
                <p className="mt-1 text-sm text-zinc-600">Use os botões para demonstrar sincronização por unidade. O novo preço aparece na vitrine correspondente.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <select value={integrationStore} onChange={(event) => setIntegrationStore(event.target.value as StoreId)} className="rounded-xl border px-3 py-3">
                    {stores.map((store) => <option key={store.id} value={store.id}>{store.shortName}</option>)}
                  </select>
                  <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)} className="rounded-xl border px-3 py-3">
                    {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
                  </select>
                  <button onClick={() => {
                    const current = getStoreProduct(selectedProductId, integrationStore, state);
                    setState((saved) => simulatePriceUpdate(saved, integrationStore, selectedProductId, Number((current.price + 1.37).toFixed(2))));
                  }} className="btn-gradient rounded-xl px-4 py-3 font-black">Simular atualização de preço</button>
                </div>
                <button onClick={() => setState((saved) => markSyncFailure(saved, integrationStore, selectedProductId))} className="btn-gradient mt-3 rounded-xl px-4 py-3 font-black">Simular falha de sincronização</button>
              </div>
              <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <h3 className="font-black">Histórico demonstrativo</h3>
                <div className="mt-3 max-h-[520px] space-y-2 overflow-auto">
                  {state.events.map((event) => {
                    const store = stores.find((item) => item.id === event.storeId)!;
                    return (
                      <div key={event.id} className="rounded-xl bg-zinc-50 p-3 text-sm">
                        <p className={clsx("font-black", event.type === "error" ? "text-red-700" : event.type === "warning" ? "text-amber-700" : "text-emerald-700")}>{store.shortName}</p>
                        <p className="mt-1">{event.description}</p>
                        <p className="mt-1 text-xs text-zinc-500">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NavButton({ tab, current, setTab, icon, label }: { tab: Tab; current: Tab; setTab: (tab: Tab) => void; icon: React.ReactNode; label: string }) {
  return <button onClick={() => setTab(tab)} className={clsx("flex items-center gap-3 rounded-xl px-3 py-3 text-left font-bold", current === tab ? "btn-gradient" : "text-zinc-300 hover:bg-white/10")}>{icon}{label}</button>;
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5"><div className="text-red-700">{icon}</div><p className="mt-4 text-sm font-bold text-zinc-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: color }}>{children}</span>;
}

function Filters({ storeFilter, setStoreFilter, statusFilter, setStatusFilter }: { storeFilter: StoreId | "todas"; setStoreFilter: (value: StoreId | "todas") => void; statusFilter: OrderStatus | "todos"; setStatusFilter: (value: OrderStatus | "todos") => void }) {
  return (
    <div className="grid gap-3 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-2">
      <select value={storeFilter} onChange={(event) => setStoreFilter(event.target.value as StoreId | "todas")} className="rounded-xl border px-3 py-2">
        <option value="todas">Todas as lojas</option>
        {stores.map((store) => <option key={store.id} value={store.id}>{store.shortName}</option>)}
      </select>
      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "todos")} className="rounded-xl border px-3 py-2">
        <option value="todos">Todos os status</option>
        {statuses.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
      </select>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 text-sm"><span>{label}</span><span className="font-black">{value}</span></div>;
}

function Empty({ title }: { title: string }) {
  return <div className="grid place-items-center rounded-[1.5rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5"><CheckCircle2 className="text-zinc-400" size={40} /><h2 className="mt-4 text-xl font-black">{title}</h2></div>;
}
