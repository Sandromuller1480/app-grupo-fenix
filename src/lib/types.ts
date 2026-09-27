export type StoreId = "fenix-juscimeira" | "fenix-jaciara" | "mantiqueira-jaciara";

export type OrderStatus =
  | "recebido"
  | "separacao"
  | "pronto"
  | "entrega"
  | "concluido";

export type Fulfillment = "entrega" | "retirada";

export type CategoryId =
  | "mercearia"
  | "hortifruti"
  | "acougue"
  | "padaria"
  | "laticinios"
  | "bebidas"
  | "congelados"
  | "limpeza"
  | "higiene"
  | "utilidades"
  | "pets";

export type Store = {
  id: StoreId;
  name: string;
  shortName: string;
  city: string;
  address: string;
  distance: string;
  serviceArea: string;
  brand: "fenix" | "mantiqueira";
  logo: string;
  palette: {
    primary: string;
    secondary: string;
    soft: string;
    text: string;
  };
};

export type Product = {
  id: string;
  title: string;
  brand: string;
  package: string;
  unit: "un" | "kg" | "pct" | "cx" | "lt";
  category: CategoryId;
  description: string;
  image: string;
  alt: string;
  illustrative?: boolean;
  featured?: boolean;
};

export type StoreProduct = {
  productId: string;
  storeId: StoreId;
  price: number;
  oldPrice?: number;
  available: boolean;
  offer?: boolean;
  outdated?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = CartItem & {
  title: string;
  unitPrice: number;
  unavailable?: boolean;
  substitution?: string;
};

export type DemoOrder = {
  id: string;
  storeId: StoreId;
  status: OrderStatus;
  createdAt: string;
  fulfillment: Fulfillment;
  customerName: string;
  address?: string;
  timeSlot: string;
  replacementPreference: string;
  paymentLabel: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

export type Banner = {
  id: string;
  storeId: StoreId;
  title: string;
  subtitle: string;
  active: boolean;
};

export type IntegrationEvent = {
  id: string;
  storeId: StoreId;
  createdAt: string;
  description: string;
  type: "success" | "warning" | "error";
};

export type DemoState = {
  selectedStoreId?: StoreId;
  cartStoreId?: StoreId;
  cart: CartItem[];
  orders: DemoOrder[];
  overrides: Record<string, Partial<StoreProduct>>;
  banners: Banner[];
  events: IntegrationEvent[];
  syncFailureStoreId?: StoreId;
};
