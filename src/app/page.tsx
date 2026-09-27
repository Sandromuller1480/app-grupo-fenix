"use client";

import {
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  Store as StoreIcon,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { categories, formatMoney, products, stores } from "@/lib/data";
import {
  addCartItem,
  createDemoOrder,
  getStoreProduct,
  updateCartQuantity,
} from "@/lib/store";
import { useDemoState } from "@/lib/useDemoState";
import type { DemoOrder, Fulfillment, Product, StoreId } from "@/lib/types";

type View = "select" | "home" | "catalog" | "product" | "cart" | "checkout" | "orders";

const statusLabel = {
  recebido: "Recebido",
  separacao: "Em separacao",
  pronto: "Pronto para retirada",
  entrega: "Saiu para entrega",
  concluido: "Concluido",
};

const selectionSlides = [
  "/slides/imagem-06.jpg",
  "/slides/imagem-07.jpg",
  "/slides/imagem-01.jpg",
  "/slides/imagem-02.jpg",
  "/slides/imagem-03.jpg",
  "/slides/imagem-04.jpg",
  "/slides/imagem-05.jpg",
];

export default function CustomerApp() {
  const { state, setState, ready } = useDemoState();
  const [view, setView] = useState<View>("select");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("todos");
  const [offersOnly, setOffersOnly] = useState(false);
  const [pendingStore, setPendingStore] = useState<StoreId | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const selectedStore = stores.find((store) => store.id === state.selectedStoreId) ?? stores[0];
  const cartStore = stores.find((store) => store.id === state.cartStoreId) ?? selectedStore;

  const catalog = useMemo(() => {
    return products
      .map((product) => ({ product, info: getStoreProduct(product.id, selectedStore.id, state) }))
      .filter(({ product, info }) => {
        const matchesQuery = `${product.title} ${product.brand}`.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "todos" || product.category === category;
        const matchesOffer = !offersOnly || info.offer;
        return matchesQuery && matchesCategory && matchesOffer;
      });
  }, [category, offersOnly, query, selectedStore.id, state]);

  const totals = useMemo(() => calculateTotals(state.cart, cartStore.id, state), [cartStore.id, state]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % selectionSlides.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  function selectStore(storeId: StoreId) {
    if (state.cart.length && state.cartStoreId && state.cartStoreId !== storeId) {
      setPendingStore(storeId);
      return;
    }
    setState({ ...state, selectedStoreId: storeId });
    setView("home");
  }

  function applyStoreChange() {
    if (!pendingStore) return;
    const nextCart = state.cart.filter((item) => getStoreProduct(item.productId, pendingStore, state).available);
    setState({ ...state, selectedStoreId: pendingStore, cartStoreId: nextCart.length ? pendingStore : undefined, cart: nextCart });
    setPendingStore(null);
    setView("home");
  }

  function addProduct(productId: string, quantity = 1) {
    const info = getStoreProduct(productId, selectedStore.id, state);
    if (!info.available) return;
    setState((current) => addCartItem(current, selectedStore.id, productId, quantity));
  }

  if (!ready) {
    return <main className="app-shell grid min-h-screen place-items-center p-6"><p className="rounded-full bg-white px-5 py-3 text-sm font-semibold shadow">Carregando demonstracao...</p></main>;
  }

  return (
    <main className={clsx("app-shell", view === "select" && "max-sm:fixed max-sm:inset-0 max-sm:flex max-sm:h-[100svh] max-sm:flex-col max-sm:overflow-hidden")}>
      <header className="sticky top-0 z-30 shrink-0 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button className="flex items-center gap-3 text-left" onClick={() => setView("select")}>
            <img src="/logos/fenix.jpeg" alt="Logotipo Fenix Supermercado" className="h-11 w-11 rounded-xl object-contain ring-1 ring-black/10" />
            <div>
              <p className="text-sm font-black text-zinc-900">Grupo Fenix</p>
              <p className="text-xs text-zinc-600">Compras demonstrativas</p>
            </div>
          </button>
          <nav className="flex items-center gap-2">
            <IconButton label="Inicio" active={view === "home"} onClick={() => setView(state.selectedStoreId ? "home" : "select")} icon={<Home size={18} />} />
            <IconButton label="Pedidos" active={view === "orders"} onClick={() => setView("orders")} icon={<PackageCheck size={18} />} />
            <button onClick={() => setView("cart")} className="btn-gradient relative rounded-full px-4 py-2 text-sm font-bold">
              <span className="hidden sm:inline">Carrinho</span>
              <ShoppingCart className="inline sm:ml-2" size={18} />
              {state.cart.length > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs">{state.cart.length}</span>}
            </button>
          </nav>
        </div>
      </header>

      {view === "select" && (
        <section className="mx-auto grid max-w-4xl gap-3 px-4 py-4 max-sm:min-h-0 max-sm:w-full max-sm:flex-1 max-sm:grid-rows-[minmax(0,1fr)_auto] max-sm:overflow-hidden max-sm:pb-20 max-sm:pt-3 sm:gap-4 sm:py-6">
          <div className="relative min-h-0 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-red-700 via-red-600 to-orange-500 shadow-xl max-sm:h-full sm:aspect-[16/7] sm:min-h-64 sm:rounded-[2rem]">
            {selectionSlides.map((slide, index) => (
              <img
                key={slide}
                src={slide}
                alt="Imagem promocional do Grupo Fenix"
                className={clsx(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  index === activeSlide ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>

          <div className="rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-zinc-900 ring-1 ring-black/10 max-sm:py-2.5">
              <StoreIcon size={20} className="shrink-0 text-red-600" />
              <select
                defaultValue=""
                aria-label="Escolher loja"
                className="w-full bg-transparent py-1 text-base font-bold outline-none"
                onChange={(event) => {
                  const storeId = event.target.value as StoreId;
                  if (storeId) selectStore(storeId);
                }}
              >
                <option value="" disabled hidden>Escolha uma loja</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>{store.shortName}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {view !== "select" && (
        <section className="mx-auto max-w-6xl px-4 py-5">
          <StoreHeader store={selectedStore} onChange={() => setView("select")} />

          {view === "home" && (
            <div className="grid gap-5">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
                <Search size={19} />
                <input value={query} onChange={(event) => { setQuery(event.target.value); setView("catalog"); }} placeholder="Buscar arroz, carne, detergente..." className="w-full bg-transparent outline-none" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {state.banners.filter((banner) => banner.storeId === selectedStore.id && banner.active).map((banner) => (
                  <div key={banner.id} className="rounded-[1.5rem] p-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${selectedStore.palette.primary}, ${selectedStore.palette.secondary === "#ffffff" ? "#2b2b2b" : selectedStore.palette.secondary})` }}>
                    <p className="text-sm font-bold opacity-90">Promocao demonstrativa</p>
                    <h2 className="mt-2 text-2xl font-black">{banner.title}</h2>
                    <p className="mt-2 text-sm opacity-90">{banner.subtitle}</p>
                  </div>
                ))}
              </div>
              <CategoryRail category={category} setCategory={(id) => { setCategory(id); setView("catalog"); }} />
              <ProductGrid items={catalog.filter(({ product }) => product.featured).slice(0, 8)} state={state} storeId={selectedStore.id} onOpen={(id) => { setSelectedProductId(id); setView("product"); }} onAdd={addProduct} />
            </div>
          )}

          {view === "catalog" && (
            <div className="grid gap-4">
              <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_auto_auto]">
                <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
                  <Search size={18} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" className="w-full bg-transparent outline-none" />
                </div>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2">
                  <option value="todos">Todas as categorias</option>
                  {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
                <label className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 font-semibold">
                  <input type="checkbox" checked={offersOnly} onChange={(event) => setOffersOnly(event.target.checked)} /> Ofertas
                </label>
              </div>
              {catalog.length ? <ProductGrid items={catalog} state={state} storeId={selectedStore.id} onOpen={(id) => { setSelectedProductId(id); setView("product"); }} onAdd={addProduct} /> : <EmptyState title="Nenhum produto encontrado" text="Tente outra busca ou categoria." />}
            </div>
          )}

          {view === "product" && (
            <ProductDetail product={products.find((item) => item.id === selectedProductId) ?? products[0]} storeId={selectedStore.id} state={state} onBack={() => setView("catalog")} onAdd={addProduct} />
          )}

          {view === "cart" && (
            <CartView state={state} setState={setState} storeId={cartStore.id} totals={totals} onCheckout={() => setView("checkout")} onCatalog={() => setView("catalog")} />
          )}

          {view === "checkout" && (
            <CheckoutView state={state} setState={setState} storeId={cartStore.id} totals={totals} onDone={() => setView("orders")} />
          )}

          {view === "orders" && <OrdersView orders={state.orders} />}
        </section>
      )}

      {pendingStore && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="max-w-2xl rounded-[1.5rem] bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-black">Revisar carrinho ao trocar de loja</h2>
            <p className="mt-2 text-sm text-zinc-600">Os precos e disponibilidades abaixo pertencem a nova unidade. Itens indisponiveis serao removidos se voce confirmar.</p>
            <div className="mt-4 max-h-80 overflow-auto">
              {state.cart.map((item) => {
                const product = products.find((p) => p.id === item.productId)!;
                const current = getStoreProduct(product.id, state.cartStoreId ?? selectedStore.id, state);
                const next = getStoreProduct(product.id, pendingStore, state);
                return (
                  <div key={item.productId} className="flex items-center justify-between gap-3 border-b py-3 text-sm">
                    <span className="font-bold">{product.title}</span>
                    <span>{formatMoney(current.price)} {"->"} {next.available ? formatMoney(next.price) : "Indisponivel"}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setPendingStore(null)} className="rounded-xl border px-4 py-2 font-bold">Cancelar</button>
              <button onClick={applyStoreChange} className="btn-gradient rounded-xl px-4 py-2 font-bold">Aplicar troca</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StoreHeader({ store, onChange }: { store: (typeof stores)[number]; onChange: () => void }) {
  return (
    <div className="mb-5 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src={store.logo} alt={`Logotipo ${store.shortName}`} className="h-16 w-16 rounded-2xl object-contain ring-1 ring-black/10" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Carrinho atendido por</p>
            <h1 className="text-2xl font-black" style={{ color: store.palette.primary }}>{store.name}</h1>
            <p className="text-sm text-zinc-600">{store.city} - compra demonstrativa</p>
          </div>
        </div>
        <button onClick={onChange} className="btn-gradient flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-bold"><ArrowLeftRight size={18} /> Trocar loja</button>
      </div>
    </div>
  );
}

function IconButton({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return <button title={label} onClick={onClick} className={clsx("rounded-full p-2", active ? "bg-red-50 text-red-700" : "text-zinc-700 hover:bg-zinc-100")}>{icon}</button>;
}

function CategoryRail({ category, setCategory }: { category: string; setCategory: (id: string) => void }) {
  return (
    <div className="flex gap-2 overflow-auto pb-1">
      <button onClick={() => setCategory("todos")} className={clsx("shrink-0 rounded-full px-4 py-2 text-sm font-bold", category === "todos" ? "btn-gradient" : "bg-white")}>Todos</button>
      {categories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={clsx("shrink-0 rounded-full px-4 py-2 text-sm font-bold", category === item.id ? "btn-gradient" : "bg-white")}>{item.label}</button>)}
    </div>
  );
}

function ProductGrid({ items, state, storeId, onOpen, onAdd }: { items: { product: Product; info: ReturnType<typeof getStoreProduct> }[]; state: Parameters<typeof getStoreProduct>[2]; storeId: StoreId; onOpen: (id: string) => void; onAdd: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map(({ product }) => {
        const info = getStoreProduct(product.id, storeId, state);
        return (
          <article key={product.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
            <button onClick={() => onOpen(product.id)} className="block w-full text-left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-50">
                <img src={product.image} alt={product.alt} className="h-full w-full object-contain" />
                {product.illustrative && <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold">Ilustrativa</span>}
              </div>
              <p className="mt-3 min-h-10 text-sm font-black">{product.title}</p>
              <p className="text-xs text-zinc-500">{product.brand} - {product.package}</p>
              <div className="mt-2">
                {info.oldPrice && <span className="mr-2 text-xs text-zinc-400 line-through">{formatMoney(info.oldPrice)}</span>}
                <span className="text-lg font-black text-zinc-950">{formatMoney(info.price)}</span>
                <span className="text-xs text-zinc-500"> / {product.unit}</span>
              </div>
            </button>
            <button disabled={!info.available} onClick={() => onAdd(product.id)} className="btn-gradient mt-3 w-full rounded-xl px-3 py-2 text-sm font-bold">{info.available ? "Adicionar" : "Indisponivel"}</button>
          </article>
        );
      })}
    </div>
  );
}

function ProductDetail({ product, storeId, state, onBack, onAdd }: { product: Product; storeId: StoreId; state: Parameters<typeof getStoreProduct>[2]; onBack: () => void; onAdd: (id: string, q?: number) => void }) {
  const info = getStoreProduct(product.id, storeId, state);
  const [quantity, setQuantity] = useState(product.unit === "kg" ? 0.5 : 1);
  return (
    <div className="grid gap-5 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-2">
      <div className="aspect-square rounded-2xl bg-zinc-50 p-4"><img src={product.image} alt={product.alt} className="h-full w-full object-contain" /></div>
      <div className="flex flex-col justify-center">
        <button onClick={onBack} className="mb-4 w-fit text-sm font-bold text-zinc-600">Voltar ao catalogo</button>
        <p className="text-sm font-bold text-zinc-500">{product.brand} - {product.package}</p>
        <h2 className="mt-2 text-3xl font-black">{product.title}</h2>
        <p className="mt-3 text-zinc-600">{product.description}</p>
        <p className="mt-5 text-3xl font-black">{formatMoney(info.price)} <span className="text-sm font-bold text-zinc-500">/ {product.unit}</span></p>
        {product.illustrative && <p className="mt-2 text-xs font-semibold text-amber-700">Imagem ilustrativa para apresentacao.</p>}
        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => setQuantity(Math.max(product.unit === "kg" ? 0.5 : 1, quantity - (product.unit === "kg" ? 0.5 : 1)))} className="rounded-full border p-2"><Minus size={18} /></button>
          <span className="min-w-16 text-center text-lg font-black">{quantity} {product.unit}</span>
          <button onClick={() => setQuantity(quantity + (product.unit === "kg" ? 0.5 : 1))} className="rounded-full border p-2"><Plus size={18} /></button>
        </div>
        <button disabled={!info.available} onClick={() => onAdd(product.id, quantity)} className="btn-gradient mt-6 rounded-2xl px-5 py-4 font-black">Adicionar ao carrinho</button>
      </div>
    </div>
  );
}

function CartView({ state, setState, storeId, totals, onCheckout, onCatalog }: { state: Parameters<typeof getStoreProduct>[2]; setState: ReturnType<typeof useDemoState>["setState"]; storeId: StoreId; totals: ReturnType<typeof calculateTotals>; onCheckout: () => void; onCatalog: () => void }) {
  if (!state.cart.length) return <EmptyState title="Carrinho vazio" text="Adicione produtos da unidade escolhida para revisar a compra." action="Ver catalogo" onAction={onCatalog} />;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h2 className="text-2xl font-black">Carrinho demonstrativo</h2>
        {state.cart.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const info = getStoreProduct(product.id, storeId, state);
          return (
            <div key={item.productId} className="flex gap-3 border-b py-4">
              <img src={product.image} alt={product.alt} className="h-20 w-20 rounded-xl bg-zinc-50 object-contain" />
              <div className="flex-1">
                <p className="font-black">{product.title}</p>
                <p className="text-sm text-zinc-500">{formatMoney(info.price)} / {product.unit}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setState((current) => updateCartQuantity(current, product.id, item.quantity - (product.unit === "kg" ? 0.5 : 1)))} className="rounded-full border p-1"><Minus size={15} /></button>
                  <span className="min-w-14 text-center font-bold">{item.quantity} {product.unit}</span>
                  <button onClick={() => setState((current) => updateCartQuantity(current, product.id, item.quantity + (product.unit === "kg" ? 0.5 : 1)))} className="rounded-full border p-1"><Plus size={15} /></button>
                </div>
              </div>
              <p className="font-black">{formatMoney(info.price * item.quantity)}</p>
            </div>
          );
        })}
      </div>
      <Summary totals={totals} action="Ir para checkout" onAction={onCheckout} />
    </div>
  );
}

function CheckoutView({ state, setState, storeId, totals, onDone }: { state: Parameters<typeof getStoreProduct>[2]; setState: ReturnType<typeof useDemoState>["setState"]; storeId: StoreId; totals: ReturnType<typeof calculateTotals>; onDone: () => void }) {
  const [fulfillment, setFulfillment] = useState<Fulfillment>("entrega");
  const [address, setAddress] = useState("Rua das Palmeiras, 123");
  const [replacementPreference, setReplacementPreference] = useState("Avisar antes de substituir");
  const [paymentLabel, setPaymentLabel] = useState("Cartao na entrega - demonstracao");
  const blocked = state.cart.some((item) => getStoreProduct(item.productId, storeId, state).outdated);

  function finish() {
    if (blocked) return;
    const order: DemoOrder = {
      id: `GF-${Math.floor(1000 + Math.random() * 9000)}`,
      storeId,
      status: "recebido",
      createdAt: new Date().toISOString(),
      fulfillment,
      customerName: "Cliente demonstracao",
      address: fulfillment === "entrega" ? address : undefined,
      timeSlot: fulfillment === "entrega" ? "Hoje, 16h as 18h" : "Retirada hoje, 15h",
      replacementPreference,
      paymentLabel,
      items: state.cart.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        const info = getStoreProduct(product.id, storeId, state);
        return { productId: product.id, quantity: item.quantity, title: product.title, unitPrice: info.price };
      }),
      ...totals,
    };
    setState((current) => createDemoOrder(current, order));
    onDone();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h2 className="text-2xl font-black">Checkout demonstrativo</h2>
        <p className="mt-1 text-sm text-zinc-600">Nenhuma cobranca real sera realizada.</p>
        {blocked && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">Ha item com preco desatualizado. O CRM precisa simular uma atualizacao antes de concluir.</p>}
        <div className="mt-5 grid gap-4">
          <Segment value={fulfillment} setValue={setFulfillment} options={[["entrega", "Entrega"], ["retirada", "Retirada"]]} />
          {fulfillment === "entrega" && <Field label="Endereco de entrega" value={address} onChange={setAddress} />}
          <label className="grid gap-2 text-sm font-bold">Horario
            <select className="rounded-xl border px-3 py-3 font-normal">
              <option>{fulfillment === "entrega" ? "Hoje, 16h as 18h" : "Retirada hoje, 15h"}</option>
              <option>Amanha, 9h as 11h</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">Substituicao de itens
            <select value={replacementPreference} onChange={(event) => setReplacementPreference(event.target.value)} className="rounded-xl border px-3 py-3 font-normal">
              <option>Avisar antes de substituir</option>
              <option>Permitir produto similar</option>
              <option>Remover item indisponivel</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">Pagamento visual
            <select value={paymentLabel} onChange={(event) => setPaymentLabel(event.target.value)} className="rounded-xl border px-3 py-3 font-normal">
              <option>Cartao na entrega - demonstracao</option>
              <option>Pix na retirada - demonstracao</option>
              <option>Dinheiro - demonstracao</option>
            </select>
          </label>
        </div>
      </div>
      <Summary totals={totals} action="Criar pedido de demonstracao" onAction={finish} disabled={blocked} />
    </div>
  );
}

function OrdersView({ orders }: { orders: DemoOrder[] }) {
  if (!orders.length) return <EmptyState title="Nenhum pedido demonstrativo" text="Finalize um checkout para acompanhar o status aqui e no CRM." />;
  return (
    <div className="grid gap-4">
      {orders.map((order) => {
        const store = stores.find((item) => item.id === order.storeId)!;
        return (
          <article key={order.id} className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-sm text-zinc-500">Pedido de demonstracao criado</p><h2 className="text-xl font-black">{order.id} - {store.shortName}</h2></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">{statusLabel[order.status]}</span>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-5">
              {(["recebido", "separacao", order.fulfillment === "entrega" ? "entrega" : "pronto", "concluido"] as const).map((status) => (
                <div key={status} className={clsx("rounded-xl p-3 text-sm font-bold", order.status === status ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600")}>
                  {statusLabel[status]}
                </div>
              ))}
            </div>
            <p className="mt-4 font-black">{formatMoney(order.total)}</p>
          </article>
        );
      })}
    </div>
  );
}

function Summary({ totals, action, onAction, disabled }: { totals: ReturnType<typeof calculateTotals>; action: string; onAction: () => void; disabled?: boolean }) {
  return (
    <aside className="h-fit rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <h3 className="text-lg font-black">Resumo</h3>
      <Line label="Subtotal" value={formatMoney(totals.subtotal)} />
      <Line label="Descontos demonstrativos" value={`-${formatMoney(totals.discount)}`} />
      <Line label="Taxa de entrega demonstrativa" value={formatMoney(totals.deliveryFee)} />
      <div className="mt-3 border-t pt-3"><Line label="Total estimado" value={formatMoney(totals.total)} strong /></div>
      <button disabled={disabled} onClick={onAction} className="btn-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black"><CreditCard size={18} /> {action}</button>
    </aside>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={clsx("mt-2 flex justify-between gap-3 text-sm", strong && "text-lg font-black")}><span>{label}</span><span>{value}</span></div>;
}

function Segment<T extends string>({ value, setValue, options }: { value: T; setValue: (value: T) => void; options: [T, string][] }) {
  return <div className="grid grid-cols-2 rounded-2xl bg-zinc-100 p-1">{options.map(([id, label]) => <button key={id} onClick={() => setValue(id)} className={clsx("rounded-xl px-4 py-3 font-black", value === id && "bg-white shadow")}>{label}</button>)}</div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-sm font-bold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border px-3 py-3 font-normal" /></label>;
}

function EmptyState({ title, text, action, onAction }: { title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <div className="grid place-items-center rounded-[1.5rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
      <StoreIcon size={42} className="text-zinc-400" />
      <h2 className="mt-4 text-2xl font-black">{title}</h2>
      <p className="mt-2 max-w-md text-zinc-600">{text}</p>
      {action && <button onClick={onAction} className="btn-gradient mt-5 rounded-xl px-4 py-2 font-bold">{action}</button>}
    </div>
  );
}

function calculateTotals(cart: { productId: string; quantity: number }[], storeId: StoreId, state: Parameters<typeof getStoreProduct>[2]) {
  const subtotal = cart.reduce((sum, item) => sum + getStoreProduct(item.productId, storeId, state).price * item.quantity, 0);
  const discount = subtotal > 120 ? 7.5 : subtotal > 60 ? 3.5 : 0;
  const deliveryFee = cart.length ? 8.9 : 0;
  return { subtotal, discount, deliveryFee, total: Math.max(0, subtotal - discount + deliveryFee) };
}
