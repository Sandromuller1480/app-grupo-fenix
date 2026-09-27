# Grupo Fenix - Plataforma demonstrativa

Protótipo navegável para apresentar a plataforma digital do Grupo Fenix, com aplicativo de compras para clientes e CRM interno para funcionários.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse:

- App do cliente: `http://localhost:3000`
- CRM demonstrativo: `http://localhost:3000/crm`

## Build de produção

```bash
npm run build
npm run start
```

## Publicação na Vercel

1. Suba este diretório para um repositório GitHub.
2. Na Vercel, importe o repositório.
3. Framework: Next.js.
4. Build command: `npm run build`.
5. Output: padrão do Next.js.
6. Variáveis de ambiente: nenhuma nesta versão.

## Escopo desta versão

- Dados simulados locais.
- Persistência no navegador via `localStorage`.
- Nenhuma cobrança real.
- Nenhum pedido enviado às lojas.
- Nenhuma conexão com Supabase, ERP, gateway de pagamento ou autenticação real.
- CRM com acesso apenas demonstrativo por perfil.

## O que foi implementado

- Seleção de loja com CEP/endereço demonstrativo, localização simulada e escolha manual.
- Vitrine por unidade, com logotipo, identidade visual, banners, categorias e produtos.
- Catálogo com busca, categorias, ofertas, preços e disponibilidade por loja.
- Página de produto com imagem, descrição, preço e carrinho.
- Carrinho com quantidade, subtotal, desconto demonstrativo, entrega demonstrativa e total estimado.
- Checkout demonstrativo com entrega/retirada, endereço, horário, substituição e pagamento visual.
- Acompanhamento de pedido demonstrativo.
- CRM em `/crm` com perfis, painel, filtros de pedidos, avanço de status, indisponibilidade e substituição.
- Cadastro editorial visual de produtos.
- Campanhas por loja.
- Integração simulada com atualização de preço e falha de sincronização.

## Logotipos

Os arquivos originais foram encontrados em `imagens/` e copiados para `public/logos/`.

- `WhatsApp Image 2026-09-26 at 14.31.44.jpeg`: Fenix Supermercado.
- `WhatsApp Image 2026-09-26 at 14.31.53.jpeg`: Mantiqueira Atacado e Varejo.

As proporções foram preservadas; os logotipos não foram redesenhados.

## Imagens de produtos

As imagens dos produtos são ilustrações locais em `public/products/`, geradas para esta apresentação. Cada produto tem uma imagem distinta e coerente com a categoria, marcada como imagem ilustrativa na interface.

## Pendências

- O arquivo `PRD_Grupo_Fenix_Plataforma_Supermercados.md` não estava presente no diretório no momento da implementação. O protótipo seguiu o escopo detalhado do prompt.
- Confirmar grafia oficial, endereço e dados da unidade Fenix em Juscimeira, MT.
- Confirmar endereços oficiais das unidades de Jaciara.
- Substituir ilustrações por fotos autorizadas dos produtos quando houver acervo real.
- Implementar autenticação, Supabase e integração comercial apenas em etapa futura.
