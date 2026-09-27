"use client";

import { defaultBanners, storeProducts } from "./data";
import type { DemoOrder, DemoState, IntegrationEvent, OrderStatus, StoreId, StoreProduct } from "./types";

const STORAGE_KEY = "grupo-fenix-demo-state-v1";

export const defaultState: DemoState = {
  selectedStoreId: undefined,
  cartStoreId: undefined,
  cart: [],
  orders: [],
  overrides: {},
  banners: defaultBanners,
  events: [
    {
      id: "evt-inicial",
      storeId: "fenix-jaciara",
      createdAt: new Date().toISOString(),
      description: "Cafe torrado e moido marcado como preco desatualizado para demonstracao.",
      type: "warning",
    },
  ],
};

export function loadState(): DemoState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveState(state: DemoState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("fenix-state-change", { detail: state }));
}

export function getStoreProduct(productId: string, storeId: StoreId, state: DemoState): StoreProduct {
  const base = storeProducts.find((item) => item.productId === productId && item.storeId === storeId);
  if (!base) throw new Error(`Produto ${productId} nao cadastrado na loja ${storeId}.`);
  return { ...base, ...(state.overrides[`${storeId}:${productId}`] ?? {}) };
}

export function addCartItem(state: DemoState, storeId: StoreId, productId: string, quantity = 1): DemoState {
  const cart = state.cartStoreId && state.cartStoreId !== storeId ? [] : [...state.cart];
  const current = cart.find((item) => item.productId === productId);
  const nextCart = current
    ? cart.map((item) => (item.productId === productId ? { ...item, quantity: Number((item.quantity + quantity).toFixed(2)) } : item))
    : [...cart, { productId, quantity }];
  return { ...state, selectedStoreId: storeId, cartStoreId: storeId, cart: nextCart };
}

export function updateCartQuantity(state: DemoState, productId: string, quantity: number): DemoState {
  return {
    ...state,
    cart: state.cart
      .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(0, Number(quantity.toFixed(2))) } : item))
      .filter((item) => item.quantity > 0),
  };
}

export function createDemoOrder(state: DemoState, order: DemoOrder): DemoState {
  const event: IntegrationEvent = {
    id: `evt-${Date.now()}`,
    storeId: order.storeId,
    createdAt: new Date().toISOString(),
    description: `Pedido demonstrativo ${order.id} criado para ${order.fulfillment}.`,
    type: "success",
  };
  return { ...state, orders: [order, ...state.orders], cart: [], cartStoreId: undefined, events: [event, ...state.events] };
}

export function updateOrderStatus(state: DemoState, orderId: string, status: OrderStatus): DemoState {
  const order = state.orders.find((item) => item.id === orderId);
  const event: IntegrationEvent | undefined = order
    ? {
        id: `evt-${Date.now()}`,
        storeId: order.storeId,
        createdAt: new Date().toISOString(),
        description: `Pedido ${orderId} avancou para ${status}.`,
        type: "success",
      }
    : undefined;
  return {
    ...state,
    orders: state.orders.map((item) => (item.id === orderId ? { ...item, status } : item)),
    events: event ? [event, ...state.events] : state.events,
  };
}

export function simulatePriceUpdate(state: DemoState, storeId: StoreId, productId: string, price: number): DemoState {
  const key = `${storeId}:${productId}`;
  const event: IntegrationEvent = {
    id: `evt-${Date.now()}`,
    storeId,
    createdAt: new Date().toISOString(),
    description: `Preco demonstrativo atualizado para ${price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.`,
    type: "success",
  };
  return {
    ...state,
    overrides: { ...state.overrides, [key]: { ...(state.overrides[key] ?? {}), price, outdated: false } },
    events: [event, ...state.events],
    syncFailureStoreId: state.syncFailureStoreId === storeId ? undefined : state.syncFailureStoreId,
  };
}

export function markSyncFailure(state: DemoState, storeId: StoreId, productId: string): DemoState {
  const key = `${storeId}:${productId}`;
  const event: IntegrationEvent = {
    id: `evt-${Date.now()}`,
    storeId,
    createdAt: new Date().toISOString(),
    description: "Falha demonstrativa de sincronizacao: item ficou pendente de conferencia.",
    type: "error",
  };
  return {
    ...state,
    syncFailureStoreId: storeId,
    overrides: { ...state.overrides, [key]: { ...(state.overrides[key] ?? {}), outdated: true } },
    events: [event, ...state.events],
  };
}
