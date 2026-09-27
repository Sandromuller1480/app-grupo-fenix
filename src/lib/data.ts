import type { Banner, CategoryId, Product, Store, StoreId, StoreProduct } from "./types";

export const stores: Store[] = [
  {
    id: "fenix-juscimeira",
    name: "Supermercado Fênix - Juscimeira",
    shortName: "Fênix Juscimeira",
    city: "Juscimeira, MT",
    address: "Endereço a confirmar, Juscimeira - MT",
    distance: "2,4 km",
    serviceArea: "Entrega demonstrativa em bairros centrais",
    brand: "fenix",
    logo: "/logos/fenix.jpeg",
    palette: { primary: "#d9282f", secondary: "#ffffff", soft: "#fff0f1", text: "#3a1012" },
  },
  {
    id: "fenix-jaciara",
    name: "Supermercado Fênix - Jaciara",
    shortName: "Fênix Jaciara",
    city: "Jaciara, MT",
    address: "Endereço demonstrativo, Jaciara - MT",
    distance: "8,8 km",
    serviceArea: "Entrega demonstrativa em Jaciara",
    brand: "fenix",
    logo: "/logos/fenix.jpeg",
    palette: { primary: "#d9282f", secondary: "#ffffff", soft: "#fff0f1", text: "#3a1012" },
  },
  {
    id: "mantiqueira-jaciara",
    name: "Supermercado Mantiqueira - Jaciara",
    shortName: "Mantiqueira Jaciara",
    city: "Jaciara, MT",
    address: "Endereço demonstrativo, Jaciara - MT",
    distance: "9,6 km",
    serviceArea: "Entrega demonstrativa por raio comercial",
    brand: "mantiqueira",
    logo: "/logos/mantiqueira.jpeg",
    palette: { primary: "#16843a", secondary: "#f28a22", soft: "#edf8ef", text: "#12391f" },
  },
];

export const categories: { id: CategoryId; label: string }[] = [
  { id: "mercearia", label: "Mercearia" },
  { id: "hortifruti", label: "Hortifruti" },
  { id: "acougue", label: "Açougue e frango" },
  { id: "padaria", label: "Padaria" },
  { id: "laticinios", label: "Frios e laticínios" },
  { id: "bebidas", label: "Bebidas" },
  { id: "congelados", label: "Congelados" },
  { id: "limpeza", label: "Limpeza" },
  { id: "higiene", label: "Higiene" },
  { id: "utilidades", label: "Utilidades" },
  { id: "pets", label: "Pets" },
];

export const products: Product[] = [
  { id: "arroz-branco-5kg", title: "Arroz branco tipo 1", brand: "Campo Bom", package: "Pacote 5 kg", unit: "pct", category: "mercearia", description: "Grãos selecionados para o consumo do dia a dia.", image: "/products-photo/arroz-branco-5kg.jpg", alt: "Ilustração de pacote de arroz branco tipo 1", illustrative: true, featured: true },
  { id: "feijao-carioca-1kg", title: "Feijão carioca", brand: "Sabor da Terra", package: "Pacote 1 kg", unit: "pct", category: "mercearia", description: "Feijão carioca para receitas brasileiras.", image: "/products-photo/feijao-carioca-1kg.jpg", alt: "Ilustração de pacote de feijão carioca", illustrative: true, featured: true },
  { id: "oleo-soja-900ml", title: "Óleo de soja", brand: "Mesa Boa", package: "Garrafa 900 ml", unit: "un", category: "mercearia", description: "Óleo culinário para preparo de alimentos.", image: "/products-photo/oleo-soja-900ml.jpg", alt: "Ilustração de garrafa de óleo de soja", illustrative: true },
  { id: "macarrao-espaguete-500g", title: "Macarrão espaguete", brand: "Dona Massa", package: "Pacote 500 g", unit: "pct", category: "mercearia", description: "Massa seca tipo espaguete.", image: "/products-photo/macarrao-espaguete-500g.jpg", alt: "Ilustração de pacote de macarrão espaguete", illustrative: true },
  { id: "acucar-cristal-2kg", title: "Açúcar cristal", brand: "Doce Vale", package: "Pacote 2 kg", unit: "pct", category: "mercearia", description: "Açúcar cristal para bebidas e receitas.", image: "/products-photo/acucar-cristal-2kg.jpg", alt: "Ilustração de pacote de açúcar cristal", illustrative: true },
  { id: "cafe-torrado-500g", title: "Café torrado e moído", brand: "Serra Alta", package: "Pacote 500 g", unit: "pct", category: "mercearia", description: "Café de torra média com aroma marcante.", image: "/products-photo/cafe-torrado-500g.jpg", alt: "Ilustração de pacote de café torrado e moído", illustrative: true, featured: true },
  { id: "tomate-kg", title: "Tomate salada", brand: "Hortifruti", package: "Venda por kg", unit: "kg", category: "hortifruti", description: "Tomates frescos para saladas e molhos.", image: "/products-photo/tomate-kg.jpg", alt: "Ilustração de tomates vermelhos", illustrative: true, featured: true },
  { id: "banana-kg", title: "Banana prata", brand: "Hortifruti", package: "Venda por kg", unit: "kg", category: "hortifruti", description: "Banana prata selecionada.", image: "/products-photo/banana-kg.jpg", alt: "Ilustração de penca de banana prata", illustrative: true },
  { id: "alface-un", title: "Alface crespa", brand: "Hortifruti", package: "Unidade", unit: "un", category: "hortifruti", description: "Folhas frescas higienizadas na exposição.", image: "/products-photo/alface-un.jpg", alt: "Ilustração de alface crespa", illustrative: true },
  { id: "batata-kg", title: "Batata lavada", brand: "Hortifruti", package: "Venda por kg", unit: "kg", category: "hortifruti", description: "Batata para cozinhar, assar ou fritar.", image: "/products-photo/batata-kg.jpg", alt: "Ilustração de batatas", illustrative: true },
  { id: "carne-bovina-kg", title: "Coxão mole bovino", brand: "Açougue", package: "Venda por kg", unit: "kg", category: "acougue", description: "Corte bovino fresco para bifes e cozidos.", image: "/products-photo/carne-bovina-kg.jpg", alt: "Ilustração de corte bovino", illustrative: true, featured: true },
  { id: "frango-peito-kg", title: "Peito de frango resfriado", brand: "Açougue", package: "Venda por kg", unit: "kg", category: "acougue", description: "Peito de frango limpo, vendido por peso.", image: "/products-photo/frango-peito-kg.jpg", alt: "Ilustração de peito de frango", illustrative: true },
  { id: "linguica-kg", title: "Linguiça toscana", brand: "Açougue", package: "Venda por kg", unit: "kg", category: "acougue", description: "Linguiça fresca para churrasco.", image: "/products-photo/linguica-kg.jpg", alt: "Ilustração de linguiça toscana", illustrative: true },
  { id: "pao-frances-kg", title: "Pão francês", brand: "Padaria", package: "Venda por kg", unit: "kg", category: "padaria", description: "Pão francês assado ao longo do dia.", image: "/products-photo/pao-frances-kg.jpg", alt: "Ilustração de pães franceses", illustrative: true, featured: true },
  { id: "bolo-fuba-un", title: "Bolo de fubá", brand: "Padaria", package: "Unidade", unit: "un", category: "padaria", description: "Bolo simples para café da tarde.", image: "/products-photo/bolo-fuba-un.jpg", alt: "Ilustração de bolo de fubá", illustrative: true },
  { id: "queijo-mussarela-kg", title: "Queijo muçarela fatiado", brand: "Frios", package: "Venda por kg", unit: "kg", category: "laticinios", description: "Fatiado no balcão, peso estimado.", image: "/products-photo/queijo-mussarela-kg.jpg", alt: "Ilustração de queijo muçarela fatiado", illustrative: true },
  { id: "leite-integral-1l", title: "Leite integral", brand: "Lacto Bom", package: "Caixa 1 L", unit: "cx", category: "laticinios", description: "Leite UHT integral.", image: "/products-photo/leite-integral-1l.jpg", alt: "Ilustração de caixa de leite integral", illustrative: true },
  { id: "iogurte-morango-170g", title: "Iogurte de morango", brand: "Vale Leite", package: "Pote 170 g", unit: "un", category: "laticinios", description: "Iogurte cremoso sabor morango.", image: "/products-photo/iogurte-morango-170g.jpg", alt: "Ilustração de pote de iogurte de morango", illustrative: true },
  { id: "refrigerante-cola-2l", title: "Refrigerante cola", brand: "Cola Festa", package: "Garrafa 2 L", unit: "un", category: "bebidas", description: "Bebida gaseificada sabor cola.", image: "/products-photo/refrigerante-cola-2l.jpg", alt: "Ilustração de garrafa de refrigerante cola", illustrative: true },
  { id: "agua-mineral-15l", title: "Água mineral", brand: "Fonte Clara", package: "Garrafa 1,5 L", unit: "un", category: "bebidas", description: "Água mineral sem gás.", image: "/products-photo/agua-mineral-15l.jpg", alt: "Ilustração de garrafa de água mineral", illustrative: true },
  { id: "suco-uva-1l", title: "Suco integral de uva", brand: "Videira", package: "Garrafa 1 L", unit: "un", category: "bebidas", description: "Suco integral de uva sem álcool.", image: "/products-photo/suco-uva-1l.jpg", alt: "Ilustração de garrafa de suco de uva", illustrative: true },
  { id: "lasanha-congelada-600g", title: "Lasanha congelada bolonhesa", brand: "Prato Rápido", package: "Caixa 600 g", unit: "cx", category: "congelados", description: "Lasanha congelada para forno ou micro-ondas.", image: "/products-photo/lasanha-congelada-600g.jpg", alt: "Ilustração de caixa de lasanha congelada", illustrative: true },
  { id: "sorvete-creme-15l", title: "Sorvete de creme", brand: "Gelato Sul", package: "Pote 1,5 L", unit: "un", category: "congelados", description: "Sorvete cremoso sabor creme.", image: "/products-photo/sorvete-creme-15l.jpg", alt: "Ilustração de pote de sorvete de creme", illustrative: true },
  { id: "detergente-neutro-500ml", title: "Detergente neutro", brand: "Brilha Bem", package: "Frasco 500 ml", unit: "un", category: "limpeza", description: "Detergente líquido para louças.", image: "/products-photo/detergente-neutro-500ml.jpg", alt: "Ilustração de frasco de detergente neutro", illustrative: true, featured: true },
  { id: "sabao-po-800g", title: "Sabão em pó", brand: "Roupa Clara", package: "Caixa 800 g", unit: "cx", category: "limpeza", description: "Sabão em pó para lavagem de roupas.", image: "/products-photo/sabao-po-800g.jpg", alt: "Ilustração de caixa de sabão em pó", illustrative: true },
  { id: "desinfetante-2l", title: "Desinfetante lavanda", brand: "Casa Limpa", package: "Garrafa 2 L", unit: "un", category: "limpeza", description: "Desinfetante perfumado para pisos.", image: "/products-photo/desinfetante-2l.jpg", alt: "Ilustração de garrafa de desinfetante", illustrative: true },
  { id: "papel-higienico-12", title: "Papel higiênico folha dupla", brand: "Macio Lar", package: "Pacote 12 rolos", unit: "pct", category: "higiene", description: "Papel higiênico folha dupla.", image: "/products-photo/papel-higienico-12.jpg", alt: "Ilustração de pacote de papel higiênico", illustrative: true },
  { id: "shampoo-350ml", title: "Shampoo hidratação", brand: "Fios Leves", package: "Frasco 350 ml", unit: "un", category: "higiene", description: "Shampoo para uso diário.", image: "/products-photo/shampoo-350ml.jpg", alt: "Ilustração de frasco de shampoo", illustrative: true },
  { id: "escova-dental-un", title: "Escova dental média", brand: "Sorriso Dia", package: "Unidade", unit: "un", category: "higiene", description: "Escova dental com cerdas médias.", image: "/products-photo/escova-dental-un.jpg", alt: "Ilustração de escova dental", illustrative: true },
  { id: "panela-aluminio-un", title: "Panela de alumínio", brand: "Cozinha Fácil", package: "Unidade 18 cm", unit: "un", category: "utilidades", description: "Panela leve para uso doméstico.", image: "/products-photo/panela-aluminio-un.jpg", alt: "Ilustração de panela de alumínio", illustrative: true },
  { id: "lampada-led-un", title: "Lâmpada LED branca", brand: "Luz Forte", package: "9 W", unit: "un", category: "utilidades", description: "Lâmpada LED de luz branca.", image: "/products-photo/lampada-led-un.jpg", alt: "Ilustração de lâmpada LED", illustrative: true },
  { id: "racao-cao-10kg", title: "Ração para cães adultos", brand: "Pet Forte", package: "Saco 10 kg", unit: "pct", category: "pets", description: "Ração seca para cães adultos.", image: "/products-photo/racao-cao-10kg.jpg", alt: "Ilustração de saco de ração para cães", illustrative: true },
  { id: "areia-gatos-4kg", title: "Areia sanitária para gatos", brand: "Miau Lar", package: "Pacote 4 kg", unit: "pct", category: "pets", description: "Areia sanitária granulada.", image: "/products-photo/areia-gatos-4kg.jpg", alt: "Ilustração de pacote de areia sanitária para gatos", illustrative: true },
];

const basePrices: Record<string, number> = {
  "arroz-branco-5kg": 24.9, "feijao-carioca-1kg": 7.49, "oleo-soja-900ml": 6.39, "macarrao-espaguete-500g": 4.79, "acucar-cristal-2kg": 8.59, "cafe-torrado-500g": 18.9,
  "tomate-kg": 8.99, "banana-kg": 5.49, "alface-un": 3.99, "batata-kg": 6.79, "carne-bovina-kg": 39.9, "frango-peito-kg": 18.99, "linguica-kg": 21.9,
  "pao-frances-kg": 15.9, "bolo-fuba-un": 13.9, "queijo-mussarela-kg": 49.9, "leite-integral-1l": 5.29, "iogurte-morango-170g": 2.99,
  "refrigerante-cola-2l": 8.99, "agua-mineral-15l": 3.49, "suco-uva-1l": 14.9, "lasanha-congelada-600g": 16.9, "sorvete-creme-15l": 24.9,
  "detergente-neutro-500ml": 2.49, "sabao-po-800g": 10.9, "desinfetante-2l": 7.9, "papel-higienico-12": 18.9, "shampoo-350ml": 12.9,
  "escova-dental-un": 5.9, "panela-aluminio-un": 34.9, "lampada-led-un": 9.9, "racao-cao-10kg": 79.9, "areia-gatos-4kg": 18.9,
};

const multipliers: Record<StoreId, number> = {
  "fenix-juscimeira": 1,
  "fenix-jaciara": 0.98,
  "mantiqueira-jaciara": 1.03,
};

export const storeProducts: StoreProduct[] = stores.flatMap((store) =>
  products.map((product, index) => {
    const offer = index % 7 === 0 || (store.id === "mantiqueira-jaciara" && index % 9 === 0);
    const price = Number((basePrices[product.id] * multipliers[store.id] - (offer ? 0.7 : 0)).toFixed(2));
    return {
      productId: product.id,
      storeId: store.id,
      price,
      oldPrice: offer ? Number((price * 1.12).toFixed(2)) : undefined,
      available: !(store.id === "fenix-juscimeira" && ["sorvete-creme-15l", "panela-aluminio-un"].includes(product.id)) && !(store.id === "mantiqueira-jaciara" && product.id === "bolo-fuba-un"),
      offer,
      outdated: store.id === "fenix-jaciara" && product.id === "cafe-torrado-500g",
    };
  }),
);

export const defaultBanners: Banner[] = [
  { id: "b1", storeId: "fenix-juscimeira", title: "Semana da economia Fênix", subtitle: "Ofertas demonstrativas em arroz, feijão e carnes.", active: true },
  { id: "b2", storeId: "fenix-jaciara", title: "Entrega programada em Jaciara", subtitle: "Monte seu carrinho e escolha o melhor horário.", active: true },
  { id: "b3", storeId: "mantiqueira-jaciara", title: "Mantiqueira atacado e varejo", subtitle: "Preços ilustrativos para compras do mês.", active: true },
];

export function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
