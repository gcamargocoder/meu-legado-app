# Meu Legado — Scaffold do projeto + tela Início + Tab Bar

Data: 2026-09-21

## Contexto e objetivo

"Meu Legado" é um app web mobile-first (React + Vite + TypeScript + Tailwind)
para ajudar pais a educar filhos com disciplina positiva. Instalável como PWA.
Esta é a primeira entrega: estrutura completa do projeto, tipos TypeScript
para o conteúdo em JSON, e a tela **Início** com a Tab Bar de navegação
funcionando entre as 6 abas do app (Início, Faixas Etárias, Situações, Mural
de Estrelas, Prêmios, Frases & Diálogo).

As outras 5 abas ganham apenas telas placeholder "Em construção" nesta
entrega — a navegação entre elas já é real (rotas do React Router), mas o
conteúdo completo de cada uma é trabalho de entregas futuras.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- `react-router-dom` para navegação entre abas
- `vite-plugin-pwa` para gerar manifest.json e service worker
- Persistência inicial via localStorage (isolada atrás de hooks, para trocar
  por Supabase no futuro sem alterar a UI)

## Identidade visual

- Tipografia: título serifado (Fraunces) via Google Fonts + corpo Inter.
- Paleta (tokens CSS em `:root`, com variante dark via
  `prefers-color-scheme: dark`):
  - `--color-bg`: `#F5F1E6` (bege/creme)
  - `--color-primary`: `#1F3A2E` (verde-pinho)
  - `--color-accent`: `#C9962F` (dourado/âmbar — estrelas, conquistas)
  - `--color-alert`: `#7A3F4D` (vinho — tags, alertas suaves)
- Cantos arredondados 12–20px, sombras leves.
- Container mobile: `max-width: 560px`, centralizado, com
  `padding: env(safe-area-inset-top) ... env(safe-area-inset-bottom)`.

## Estrutura de pastas

```
src/
  data/
    raizes-conteudo.json
    raizes-faixas-etarias.json
  types/
    conteudo.ts
    faixasEtarias.ts
  hooks/
    useConteudo.ts
    useFaixasEtarias.ts
    useMuralData.ts
  components/
    layout/
      AppLayout.tsx
      TabBar.tsx
  screens/
    InicioScreen.tsx
    FaixasEtariasScreen.tsx   (placeholder)
    SituacoesScreen.tsx        (placeholder)
    MuralScreen.tsx            (placeholder)
    PremiosScreen.tsx          (placeholder)
    FrasesScreen.tsx           (placeholder)
  App.tsx
  main.tsx
public/
  manifest.json (gerado via vite-plugin-pwa)
  icons/ (placeholder gerado)
```

## Dados e tipos

`src/data/raizes-conteudo.json` contém:
- `condutas`: lista de condutas do mural de estrelas, agrupadas por categoria.
- `situacoes`: situações do dia a dia, cada uma com `porque`, `passosPraticos`
  (lista) e `frasePraUsar`.
- `frases`: frases prontas agrupadas por categoria/momento do dia.
- `premios`: ideias de prêmios agrupadas por faixa de custo.

`src/data/raizes-faixas-etarias.json` contém as 5 faixas etárias
(2–5, 6–9, 10–12, 13–15, 16–18), cada uma com fases do desenvolvimento,
abordagem dos pais, desafios comuns e frases-guia.

`src/types/conteudo.ts` e `src/types/faixasEtarias.ts` tipam essas
estruturas; os JSONs são importados com `resolveJsonModule` habilitado no
`tsconfig.json`, então o TypeScript infere e valida contra as interfaces.

## Hooks (camada de dados isolada da UI)

- `useConteudo()`: lê `raizes-conteudo.json`, retorna os dados tipados
  (memoizado, sem estado mutável — é conteúdo estático).
- `useFaixasEtarias()`: idem para `raizes-faixas-etarias.json`.
- `useMuralData()`: única fonte com estado mutável nesta entrega — lê/escreve
  no localStorage (chave `meu-legado:mural`). Expõe uma interface pequena
  (ex.: `semanaAtual`, `marcarEstrela(condutaId, dia)`,
  `calcularTotalSemana()`) para que a troca futura por Supabase não exija
  mudanças nos componentes que o consomem. Não é usado pela tela Início
  nesta entrega, mas a interface já fica definida para a aba Mural futura.

## Navegação

- `AppLayout` monta o container mobile (max-width 560px) + `<Outlet />` do
  React Router + `TabBar` fixa no rodapé.
- `TabBar` renderiza os 6 itens (ícone + label), usando `NavLink` para
  destacar a aba ativa com a cor primária/dourado.
- Rotas: `/`, `/faixas-etarias`, `/situacoes`, `/mural`, `/premios`,
  `/frases`, todas filhas de `AppLayout`.
- Telas placeholder mostram título da aba + texto "Em construção" dentro do
  mesmo padrão visual (para a navegação parecer coesa mesmo antes do
  conteúdo completo).

## Tela Início

Conteúdo estático (sem dados dinâmicos) cobrindo os fundamentos do app:
conexão, diálogo, escuta ativa, respeito e paciência no lar — em cards com a
tipografia serifada nos títulos e corpo em Inter, seguindo a paleta.

## PWA

- `vite-plugin-pwa` configurado em modo `injectManifest: false` (modo
  `generateSW`, mais simples), com `manifest.json` preenchido (nome, short
  name, cores de tema/fundo, ícones).
- Ícones placeholder gerados agora (192x192 e 512x512) com fundo verde-pinho
  e uma estrela dourada — substituíveis depois sem mudar configuração.

## Fora de escopo nesta entrega

- Conteúdo completo das telas Faixas Etárias, Situações, Mural, Prêmios,
  Frases.
- Testes automatizados (não há lógica complexa ainda).
- Integração com Supabase.

## Verificação

- `npm run build` sem erros de tipo.
- `npm run dev`: navegar pelas 6 abas confirmando troca de rota, Tab Bar
  destacando a aba ativa, layout mobile centralizado, safe-area respeitada,
  e dark mode automático via `prefers-color-scheme`.
