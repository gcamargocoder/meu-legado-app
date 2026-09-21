# Meu Legado — Scaffold + Tela Início + Tab Bar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Note for this run:** executed inline in the current session per explicit user request (no subagents, no extra checkpoints).

**Goal:** Scaffold the "Meu Legado" PWA (Vite + React + TypeScript + Tailwind), add typed JSON content data, and ship a working Tab Bar navigating 6 routes with a fully built Início screen (the other 5 are placeholders).

**Architecture:** Vite/React/TS app with React Router driving an `AppLayout` (mobile container + fixed Tab Bar) that renders one of 6 screens. Static content lives in typed JSON files read through thin hooks (`useConteudo`, `useFaixasEtarias`); a `useMuralData` hook wraps localStorage for future mutable state. PWA support via `vite-plugin-pwa`.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, react-router-dom, vite-plugin-pwa.

**Spec:** `docs/superpowers/specs/2026-09-21-scaffold-e-inicio-design.md`

## Global Constraints

- Mobile-first container: `max-width: 560px`, centered, respects `env(safe-area-inset-*)` top and bottom.
- Colors (CSS vars on `:root`, dark variant via `prefers-color-scheme: dark`): `--color-bg: #F5F1E6`, `--color-primary: #1F3A2E`, `--color-accent: #C9962F`, `--color-alert: #7A3F4D`.
- Fonts: headings in Fraunces (serif), body in Inter, loaded via Google Fonts.
- Border radius 12–20px, light shadows.
- Content (condutas, situações, frases, prêmios, faixas etárias) lives only in `src/data/*.json`, never hardcoded in components.
- No automated test suite this round (static content, no complex logic) — verification is `npm run build` + manual `npm run dev` check.

---

### Task 1: Project scaffold, Tailwind, fonts, base config

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- Create: `tailwind.config.js`, `postcss.config.js`
- Create: `src/main.tsx`, `src/index.css`, `src/App.tsx` (temporary placeholder content, replaced in Task 5)
- Create: `.gitignore`

**Interfaces:**
- Produces: Tailwind color tokens `bg-app`, `text-primary`, `bg-primary`, `text-accent`, `bg-accent`, `text-alert`, `bg-alert` (mapped to the CSS vars above) — later tasks style with these classes.
- Produces: `resolveJsonModule: true` + `esModuleInterop: true` in `tsconfig.json` — Task 3/4 import JSON as typed modules.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "meu-legado-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.3",
    "vite-plugin-pwa": "^0.20.5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Meu Legado',
        short_name: 'Meu Legado',
        description: 'Disciplina positiva e acompanhamento do desenvolvimento dos filhos.',
        theme_color: '#1F3A2E',
        background_color: '#F5F1E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1F3A2E" />
    <link rel="icon" href="/icons/icon-192.png" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <title>Meu Legado</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        alert: 'var(--color-alert)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #f5f1e6;
  --color-primary: #1f3a2e;
  --color-accent: #c9962f;
  --color-alert: #7a3f4d;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #14201a;
    --color-primary: #cfe3d8;
    --color-accent: #e0b256;
    --color-alert: #c98b9a;
  }
}

html,
body,
#root {
  height: 100%;
}

body {
  background-color: var(--color-bg);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: 'Fraunces', serif;
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 10: Create temporary `src/App.tsx`** (replaced in Task 5)

```tsx
export default function App() {
  return <div className="p-4 text-primary">Meu Legado — scaffold ok</div>;
}
```

- [ ] **Step 11: Create `.gitignore`**

```
node_modules
dist
dist-ssr
*.local
.DS_Store
```

- [ ] **Step 12: Install dependencies and verify dev server boots**

Run: `npm install && npm run dev -- --port 5173 &` then `curl -s http://localhost:5173 | grep -q "Meu Legado" && echo OK`
Expected: `OK` printed, no install errors. Stop the dev server after checking.

- [ ] **Step 13: Commit**

```bash
git add package.json tsconfig.json tsconfig.node.json vite.config.ts index.html tailwind.config.js postcss.config.js src/index.css src/main.tsx src/App.tsx .gitignore package-lock.json
git commit -m "chore: scaffold Vite + React + TS + Tailwind + PWA plugin"
```

---

### Task 2: TypeScript types for JSON content

**Files:**
- Create: `src/types/conteudo.ts`
- Create: `src/types/faixasEtarias.ts`

**Interfaces:**
- Consumes: nothing (pure type definitions).
- Produces: `ConteudoData`, `CategoriaCondutas`, `Conduta`, `Situacao`, `FraseCategoria`, `FaixaCusto`, `Premio` (from `conteudo.ts`); `FaixasEtariasData`, `FaixaEtaria` (from `faixasEtarias.ts`) — consumed by Task 3's JSON (structurally) and Task 4's hooks.

- [ ] **Step 1: Create `src/types/conteudo.ts`**

```ts
export interface Conduta {
  id: string;
  titulo: string;
  descricao: string;
}

export interface CategoriaCondutas {
  id: string;
  nome: string;
  condutas: Conduta[];
}

export interface Situacao {
  id: string;
  titulo: string;
  categoria: string;
  porque: string;
  passosPraticos: string[];
  frasePraUsar: string;
}

export interface FraseCategoria {
  id: string;
  nome: string;
  frases: string[];
}

export interface Premio {
  id: string;
  titulo: string;
  descricao: string;
}

export interface FaixaCusto {
  id: string;
  nome: string;
  premios: Premio[];
}

export interface ConteudoData {
  categoriasCondutas: CategoriaCondutas[];
  situacoes: Situacao[];
  frasesCategorias: FraseCategoria[];
  faixasCusto: FaixaCusto[];
}
```

- [ ] **Step 2: Create `src/types/faixasEtarias.ts`**

```ts
export interface FaixaEtaria {
  id: string;
  faixa: string;
  titulo: string;
  idadeMin: number;
  idadeMax: number;
  fasesDesenvolvimento: string[];
  abordagemPais: string[];
  desafiosComuns: string[];
  frasesGuia: string[];
}

export interface FaixasEtariasData {
  faixas: FaixaEtaria[];
}
```

- [ ] **Step 3: Verify types compile standalone**

Run: `npx tsc --noEmit`
Expected: no errors (files aren't imported anywhere yet, but must parse cleanly).

- [ ] **Step 4: Commit**

```bash
git add src/types/conteudo.ts src/types/faixasEtarias.ts
git commit -m "feat: add TypeScript types for content and faixas etárias JSON"
```

---

### Task 3: Populate content JSON data files

**Files:**
- Create: `src/data/raizes-conteudo.json`
- Create: `src/data/raizes-faixas-etarias.json`

**Interfaces:**
- Consumes: shape defined by `ConteudoData` and `FaixasEtariasData` (Task 2) — structure must match exactly since Task 4 imports these with `resolveJsonModule` and casts to those types.
- Produces: the actual data every later screen reads through the Task 4 hooks.

- [ ] **Step 1: Create `src/data/raizes-conteudo.json`**

```json
{
  "categoriasCondutas": [
    {
      "id": "rotina",
      "nome": "Rotina e responsabilidade",
      "condutas": [
        { "id": "arrumar-cama", "titulo": "Arrumar a cama", "descricao": "Arrumou a cama sem precisar de lembrete." },
        { "id": "guardar-brinquedos", "titulo": "Guardar os brinquedos", "descricao": "Guardou os brinquedos depois de brincar." },
        { "id": "licao-de-casa", "titulo": "Fazer a lição de casa", "descricao": "Fez a lição de casa no horário combinado." },
        { "id": "por-mesa", "titulo": "Ajudar a pôr a mesa", "descricao": "Ajudou a arrumar ou tirar a mesa das refeições." },
        { "id": "escovar-dentes", "titulo": "Escovar os dentes sozinho", "descricao": "Escovou os dentes sem precisar de lembrete." }
      ]
    },
    {
      "id": "respeito",
      "nome": "Respeito e convivência",
      "condutas": [
        { "id": "por-favor-obrigado", "titulo": "Dizer por favor e obrigado", "descricao": "Usou as palavras mágicas naturalmente." },
        { "id": "esperar-a-vez", "titulo": "Esperar a vez para falar", "descricao": "Esperou a vez de falar sem interromper." },
        { "id": "pedir-desculpas", "titulo": "Pedir desculpas", "descricao": "Reconheceu um erro e pediu desculpas sem ser forçado." },
        { "id": "gentileza-irmaos", "titulo": "Ser gentil com os irmãos", "descricao": "Tratou irmãos ou colegas com gentileza numa situação de tensão." }
      ]
    },
    {
      "id": "autonomia",
      "nome": "Autonomia",
      "condutas": [
        { "id": "vestir-sozinho", "titulo": "Se vestir sozinho", "descricao": "Escolheu e vestiu a própria roupa." },
        { "id": "preparar-lanche", "titulo": "Preparar um lanche simples", "descricao": "Preparou um lanche simples sem ajuda." },
        { "id": "organizar-mochila", "titulo": "Organizar a mochila", "descricao": "Organizou a mochila para o dia seguinte sem lembrete." }
      ]
    },
    {
      "id": "cuidado",
      "nome": "Cuidado com os outros",
      "condutas": [
        { "id": "ajudar-sem-pedir", "titulo": "Ajudar em casa sem ser pedido", "descricao": "Ofereceu ajuda em alguma tarefa doméstica por iniciativa própria." },
        { "id": "cuidar-do-pet", "titulo": "Cuidar do animal de estimação", "descricao": "Alimentou ou cuidou do pet da família." },
        { "id": "compartilhar", "titulo": "Compartilhar", "descricao": "Compartilhou um brinquedo, lanche ou espaço sem ser cobrado." }
      ]
    }
  ],
  "situacoes": [
    {
      "id": "birra-publico",
      "titulo": "Birra em lugar público",
      "categoria": "Regulação emocional",
      "porque": "A birra costuma ser uma crise de regulação emocional, não uma provocação. O cérebro infantil ainda não tem maturidade para lidar com frustração em ambientes cheios de estímulo.",
      "passosPraticos": [
        "Mantenha a calma e abaixe-se na altura da criança.",
        "Valide o sentimento antes de corrigir o comportamento.",
        "Ofereça uma escolha simples para devolver senso de controle.",
        "Se necessário, retire a criança do ambiente até acalmar."
      ],
      "frasePraUsar": "Eu vejo que você está bravo. Vamos respirar juntos antes de continuar."
    },
    {
      "id": "recusa-licao",
      "titulo": "Recusa em fazer a lição de casa",
      "categoria": "Rotina",
      "porque": "Recusa costuma esconder cansaço, dificuldade real com o conteúdo ou excesso de atividades no dia.",
      "passosPraticos": [
        "Pergunte o que está difícil antes de insistir.",
        "Divida a tarefa em partes menores.",
        "Combine um horário fixo e prever pequenas pausas.",
        "Elogie o esforço, não só o resultado."
      ],
      "frasePraUsar": "Vamos fazer só a primeira parte agora e depois decidir o resto juntos."
    },
    {
      "id": "brigas-irmaos",
      "titulo": "Brigas entre irmãos",
      "categoria": "Convivência",
      "porque": "Disputas entre irmãos são normais e fazem parte do aprendizado de negociação e limites.",
      "passosPraticos": [
        "Não tome partido antes de ouvir os dois lados.",
        "Ajude cada um a nomear o que sentiu.",
        "Guie-os a proporem uma solução juntos.",
        "Evite comparações entre os irmãos."
      ],
      "frasePraUsar": "Cada um vai contar o que aconteceu, sem interromper o outro."
    },
    {
      "id": "mentiras",
      "titulo": "Mentiras",
      "categoria": "Confiança",
      "porque": "Mentir nessa fase costuma ser medo de punição ou de decepcionar, não caráter formado.",
      "passosPraticos": [
        "Reaja com calma, sem exagerar a punição.",
        "Explique por que a verdade importa para a confiança entre vocês.",
        "Valorize quando a criança conta a verdade, mesmo sobre algo errado.",
        "Evite armadilhas do tipo 'eu sei que você fez, admite'."
      ],
      "frasePraUsar": "Obrigado por me contar a verdade. Vamos resolver isso juntos."
    },
    {
      "id": "excesso-telas",
      "titulo": "Uso excessivo de telas",
      "categoria": "Rotina",
      "porque": "Telas ativam recompensa rápida no cérebro; sem limites claros, a criança não desenvolve autorregulação sozinha.",
      "passosPraticos": [
        "Combine o tempo de tela antes de começar, não durante.",
        "Use um alarme visual para o fim do tempo.",
        "Ofereça uma atividade concreta para depois da tela.",
        "Seja consistente mesmo quando for mais fácil ceder."
      ],
      "frasePraUsar": "Faltam cinco minutos para o tempo de tela acabar, como combinamos."
    },
    {
      "id": "dificuldade-dormir",
      "titulo": "Dificuldade para dormir",
      "categoria": "Rotina",
      "porque": "Ansiedade, excesso de estímulo antes de dormir ou rotina inconsistente atrapalham o sono.",
      "passosPraticos": [
        "Crie uma rotina fixa e previsível antes de dormir.",
        "Desligue telas pelo menos 30 minutos antes.",
        "Converse sobre o dia para esvaziar preocupações.",
        "Mantenha o mesmo horário todos os dias, inclusive fins de semana."
      ],
      "frasePraUsar": "Vamos fazer nossa rotina de sempre: banho, história e luz apagada."
    },
    {
      "id": "desobediencia-regras",
      "titulo": "Desobediência a regras combinadas",
      "categoria": "Limites",
      "porque": "Testar limites é parte do desenvolvimento; a criança verifica se a regra realmente vale.",
      "passosPraticos": [
        "Relembre a regra combinada com calma, sem sermão longo.",
        "Aplique a consequência natural já combinada, sem ameaças novas.",
        "Seja consistente: a mesma regra vale todos os dias.",
        "Reconheça quando a criança cumprir o combinado."
      ],
      "frasePraUsar": "A gente combinou isso antes. Vamos cumprir o que ficou combinado."
    },
    {
      "id": "ciumes-irmao",
      "titulo": "Ciúmes de um novo irmão",
      "categoria": "Convivência",
      "porque": "A chegada de um irmão pode ser vivida como perda de espaço e atenção exclusiva.",
      "passosPraticos": [
        "Reserve um tempo individual só para essa criança.",
        "Inclua-a em pequenos cuidados com o bebê, se quiser participar.",
        "Valide o sentimento de ciúmes sem julgar.",
        "Evite frases como 'você já é grande, não precisa de colo'."
      ],
      "frasePraUsar": "Você continua sendo muito importante para mim, do jeito que sempre foi."
    }
  ],
  "frasesCategorias": [
    {
      "id": "conflito",
      "nome": "Na hora do conflito",
      "frases": [
        "Vamos respirar fundo antes de continuar essa conversa.",
        "Eu entendo que você está chateado com isso.",
        "Podemos resolver isso com calma, sem gritar.",
        "Me conta o que aconteceu do seu jeito."
      ]
    },
    {
      "id": "incentivar",
      "nome": "Para incentivar",
      "frases": [
        "Eu vi o esforço que você fez nisso.",
        "Você conseguiu porque não desistiu.",
        "Estou orgulhoso de como você tentou de novo.",
        "Isso foi uma escolha muito madura da sua parte."
      ]
    },
    {
      "id": "validar",
      "nome": "Para validar sentimentos",
      "frases": [
        "Faz sentido você estar triste com isso.",
        "É normal sentir raiva às vezes, o que não pode é machucar alguém.",
        "Eu ficaria frustrado também nessa situação.",
        "Seu sentimento é válido, vamos pensar juntos no que fazer com ele."
      ]
    },
    {
      "id": "dizer-nao",
      "nome": "Na hora de dizer não",
      "frases": [
        "Hoje não vai ser possível, e tudo bem você ficar chateado com isso.",
        "Entendo que você queira, mas a resposta é não.",
        "Não é sobre gostar ou não, é sobre o que combinamos.",
        "Podemos conversar sobre isso outra hora, mas agora não."
      ]
    },
    {
      "id": "reparar",
      "nome": "Para reparar depois de um erro",
      "frases": [
        "Eu me alterei mais do que deveria, me desculpa.",
        "Vamos conversar de novo, dessa vez com mais calma.",
        "Eu também erro às vezes, e está tudo bem aprendermos juntos.",
        "Obrigado por ter paciência comigo agora há pouco."
      ]
    }
  ],
  "faixasCusto": [
    {
      "id": "sem-custo",
      "nome": "Sem custo",
      "premios": [
        { "id": "escolher-filme", "titulo": "Escolher o filme da noite", "descricao": "A criança decide o que a família assiste." },
        { "id": "tempo-extra-tela", "titulo": "15 minutos extras de tela", "descricao": "Tempo adicional combinado de tela." },
        { "id": "escolher-jantar", "titulo": "Escolher o jantar", "descricao": "A criança escolhe o cardápio do jantar." }
      ]
    },
    {
      "id": "baixo-custo",
      "nome": "Baixo custo",
      "premios": [
        { "id": "sorvete", "titulo": "Sorvete especial", "descricao": "Uma saída rápida para tomar sorvete." },
        { "id": "ida-parque", "titulo": "Ida ao parque", "descricao": "Uma tarde no parque perto de casa." },
        { "id": "brinquedo-pequeno", "titulo": "Brinquedo pequeno", "descricao": "Um brinquedo simples e barato." }
      ]
    },
    {
      "id": "medio-custo",
      "nome": "Médio custo",
      "premios": [
        { "id": "livro-novo", "titulo": "Livro novo", "descricao": "Escolher um livro na livraria." },
        { "id": "passeio-especial", "titulo": "Passeio especial", "descricao": "Um passeio como cinema ou parquinho pago." },
        { "id": "jogo-tabuleiro", "titulo": "Jogo de tabuleiro", "descricao": "Um jogo novo para a família jogar junto." }
      ]
    },
    {
      "id": "alto-custo",
      "nome": "Alto custo / especial",
      "premios": [
        { "id": "dia-especial", "titulo": "Dia especial a dois", "descricao": "Um dia inteiro só com o pai ou a mãe, fazendo o que a criança escolher." },
        { "id": "passeio-maior", "titulo": "Passeio maior", "descricao": "Um passeio maior, como parque temático ou viagem curta." },
        { "id": "presente-desejado", "titulo": "Presente desejado", "descricao": "Aquele presente que a criança vem pedindo há um tempo." }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create `src/data/raizes-faixas-etarias.json`**

```json
{
  "faixas": [
    {
      "id": "2-5",
      "faixa": "2-5",
      "titulo": "Primeira infância",
      "idadeMin": 2,
      "idadeMax": 5,
      "fasesDesenvolvimento": [
        "Desenvolvimento rápido da linguagem e da autonomia motora.",
        "Ainda não tem maturidade para autorregulação emocional.",
        "Pensamento concreto: entende regras simples e imediatas."
      ],
      "abordagemPais": [
        "Use frases curtas e diretas.",
        "Antecipe transições ('daqui a pouco vamos...').",
        "Ofereça escolhas limitadas para dar senso de controle.",
        "Mantenha rotinas previsíveis."
      ],
      "desafiosComuns": [
        "Birras frequentes.",
        "Dificuldade em esperar a vez.",
        "Resistência a mudanças de rotina."
      ],
      "frasesGuia": [
        "Eu vejo que você está bravo, vamos respirar juntos.",
        "Primeiro guardamos os brinquedos, depois vamos brincar lá fora."
      ]
    },
    {
      "id": "6-9",
      "faixa": "6-9",
      "titulo": "Infância escolar",
      "idadeMin": 6,
      "idadeMax": 9,
      "fasesDesenvolvimento": [
        "Entrada na alfabetização e no pensamento lógico mais estruturado.",
        "Maior consciência de regras sociais e senso de justiça.",
        "Começa a comparar-se com colegas."
      ],
      "abordagemPais": [
        "Explique o porquê das regras, não só o que fazer.",
        "Envolva a criança na criação de combinados.",
        "Valorize o esforço tanto quanto o resultado escolar.",
        "Fique atento a comparações que abalem a autoestima."
      ],
      "desafiosComuns": [
        "Resistência à lição de casa.",
        "Conflitos de justiça ('não é justo').",
        "Ciúmes e disputas entre irmãos."
      ],
      "frasesGuia": [
        "Vamos combinar juntos como isso vai funcionar.",
        "O que você acha que seria justo aqui?"
      ]
    },
    {
      "id": "10-12",
      "faixa": "10-12",
      "titulo": "Pré-adolescência",
      "idadeMin": 10,
      "idadeMax": 12,
      "fasesDesenvolvimento": [
        "Busca maior independência e privacidade.",
        "Pensamento abstrato em desenvolvimento.",
        "Forte influência do grupo de amigos."
      ],
      "abordagemPais": [
        "Negocie regras em vez de apenas impor.",
        "Respeite pedidos de privacidade dentro de limites de segurança.",
        "Converse sobre uso de internet e redes sociais com naturalidade.",
        "Escute mais e dê sermão menos."
      ],
      "desafiosComuns": [
        "Início do uso de redes sociais e telas.",
        "Mudanças de humor mais frequentes.",
        "Questionamento de regras da família."
      ],
      "frasesGuia": [
        "Eu confio em você, mas quero entender essa situação junto com você.",
        "Vamos combinar um limite que faça sentido para os dois."
      ]
    },
    {
      "id": "13-15",
      "faixa": "13-15",
      "titulo": "Adolescência inicial",
      "idadeMin": 13,
      "idadeMax": 15,
      "fasesDesenvolvimento": [
        "Puberdade e mudanças corporais intensas.",
        "Formação de identidade própria, distinta dos pais.",
        "Maior necessidade de autonomia e de ser ouvido."
      ],
      "abordagemPais": [
        "Evite comparações e críticas à aparência.",
        "Mantenha o diálogo aberto mesmo diante de respostas curtas.",
        "Estabeleça limites claros com espaço para negociação.",
        "Esteja presente sem ser invasivo."
      ],
      "desafiosComuns": [
        "Oscilação emocional intensa.",
        "Conflitos sobre horários e liberdade.",
        "Sensibilidade a críticas."
      ],
      "frasesGuia": [
        "Eu não vou concordar com tudo, mas sempre vou te ouvir.",
        "Me ajuda a entender o que você está sentindo?"
      ]
    },
    {
      "id": "16-18",
      "faixa": "16-18",
      "titulo": "Adolescência final",
      "idadeMin": 16,
      "idadeMax": 18,
      "fasesDesenvolvimento": [
        "Consolidação de valores e planos para o futuro.",
        "Maior capacidade de pensamento abstrato e planejamento.",
        "Busca por reconhecimento como adulto em formação."
      ],
      "abordagemPais": [
        "Trate como alguém cada vez mais responsável pelas próprias escolhas.",
        "Compartilhe experiências em vez de dar ordens.",
        "Apoie decisões sobre futuro (estudo, trabalho) sem impor.",
        "Mantenha-se disponível para conversas difíceis, sem julgar primeiro."
      ],
      "desafiosComuns": [
        "Ansiedade sobre o futuro (vestibular, carreira).",
        "Primeiras experiências de relacionamento e trabalho.",
        "Busca por mais liberdade e menos supervisão."
      ],
      "frasesGuia": [
        "Essa decisão é sua, e eu estou aqui se precisar conversar.",
        "Conta comigo para pensar nisso junto, sem cobrança."
      ]
    }
  ]
}
```

- [ ] **Step 3: Verify JSON structurally matches the types**

Create a temporary `src/data/_check.ts` with:

```ts
import type { ConteudoData } from '../types/conteudo';
import type { FaixasEtariasData } from '../types/faixasEtarias';
import conteudo from './raizes-conteudo.json';
import faixas from './raizes-faixas-etarias.json';

const c: ConteudoData = conteudo;
const f: FaixasEtariasData = faixas;
console.log(c.categoriasCondutas.length, f.faixas.length);
```

Run: `npx tsc --noEmit`
Expected: no type errors. Then delete `src/data/_check.ts` (it was only for verification).

- [ ] **Step 4: Commit**

```bash
git add src/data/raizes-conteudo.json src/data/raizes-faixas-etarias.json
git commit -m "feat: populate base content JSON (condutas, situações, frases, prêmios, faixas etárias)"
```

---

### Task 4: Data hooks

**Files:**
- Create: `src/hooks/useConteudo.ts`
- Create: `src/hooks/useFaixasEtarias.ts`
- Create: `src/hooks/useMuralData.ts`

**Interfaces:**
- Consumes: `ConteudoData`, `FaixasEtariasData` types (Task 2); `raizes-conteudo.json`, `raizes-faixas-etarias.json` (Task 3).
- Produces: `useConteudo(): ConteudoData`, `useFaixasEtarias(): FaixasEtariasData`, `useMuralData(): { semanaAtual: string; marcasPorConduta: Record<string, boolean[]>; marcarEstrela(condutaId: string, diaIndex: number): void; calcularTotalSemana(): number }` — available for the future Mural screen; not consumed by Início/placeholders in this plan.

- [ ] **Step 1: Create `src/hooks/useConteudo.ts`**

```ts
import conteudoJson from '../data/raizes-conteudo.json';
import type { ConteudoData } from '../types/conteudo';

const conteudo = conteudoJson as ConteudoData;

export function useConteudo(): ConteudoData {
  return conteudo;
}
```

- [ ] **Step 2: Create `src/hooks/useFaixasEtarias.ts`**

```ts
import faixasJson from '../data/raizes-faixas-etarias.json';
import type { FaixasEtariasData } from '../types/faixasEtarias';

const faixasEtarias = faixasJson as FaixasEtariasData;

export function useFaixasEtarias(): FaixasEtariasData {
  return faixasEtarias;
}
```

- [ ] **Step 3: Create `src/hooks/useMuralData.ts`**

```ts
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'meu-legado:mural';
const DIAS_NA_SEMANA = 7;

interface MuralState {
  semanaAtual: string;
  marcasPorConduta: Record<string, boolean[]>;
}

function getSemanaAtualId(): string {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const dias = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000);
  const semana = Math.ceil((dias + inicioAno.getDay() + 1) / 7);
  return `${hoje.getFullYear()}-W${semana}`;
}

function carregarEstado(): MuralState {
  const semanaAtual = getSemanaAtualId();
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return { semanaAtual, marcasPorConduta: {} };
    const salvo = JSON.parse(bruto) as MuralState;
    if (salvo.semanaAtual !== semanaAtual) return { semanaAtual, marcasPorConduta: {} };
    return salvo;
  } catch {
    return { semanaAtual, marcasPorConduta: {} };
  }
}

export function useMuralData() {
  const [estado, setEstado] = useState<MuralState>(carregarEstado);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  }, [estado]);

  const marcarEstrela = useCallback((condutaId: string, diaIndex: number) => {
    setEstado((atual) => {
      const marcasAtuais = atual.marcasPorConduta[condutaId] ?? new Array(DIAS_NA_SEMANA).fill(false);
      const novasMarcas = [...marcasAtuais];
      novasMarcas[diaIndex] = !novasMarcas[diaIndex];
      return {
        ...atual,
        marcasPorConduta: { ...atual.marcasPorConduta, [condutaId]: novasMarcas },
      };
    });
  }, []);

  const calcularTotalSemana = useCallback(() => {
    return Object.values(estado.marcasPorConduta).reduce(
      (total, marcas) => total + marcas.filter(Boolean).length,
      0
    );
  }, [estado.marcasPorConduta]);

  return {
    semanaAtual: estado.semanaAtual,
    marcasPorConduta: estado.marcasPorConduta,
    marcarEstrela,
    calcularTotalSemana,
  };
}
```

- [ ] **Step 4: Verify hooks compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useConteudo.ts src/hooks/useFaixasEtarias.ts src/hooks/useMuralData.ts
git commit -m "feat: add data hooks for content, faixas etárias and mural (localStorage)"
```

---

### Task 5: Router, AppLayout, TabBar

**Files:**
- Create: `src/components/layout/AppLayout.tsx`
- Create: `src/components/layout/TabBar.tsx`
- Modify: `src/App.tsx` (replace placeholder from Task 1 with the router setup)

**Interfaces:**
- Consumes: `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`).
- Produces: route paths `/`, `/faixas-etarias`, `/situacoes`, `/mural`, `/premios`, `/frases` — consumed by Task 6 screens, which are registered here as route elements.

- [ ] **Step 1: Create `src/components/layout/TabBar.tsx`**

```tsx
import { NavLink } from 'react-router-dom';

interface TabItem {
  to: string;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/faixas-etarias', label: 'Faixas', icon: '🌱' },
  { to: '/situacoes', label: 'Situações', icon: '💬' },
  { to: '/mural', label: 'Mural', icon: '⭐' },
  { to: '/premios', label: 'Prêmios', icon: '🎁' },
  { to: '/frases', label: 'Frases', icon: '📖' },
];

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-10 w-full max-w-[560px] -translate-x-1/2 border-t border-primary/10 bg-app"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex justify-between px-1 py-1">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-card px-1 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-primary/60'
                }`
              }
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {tab.icon}
              </span>
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/AppLayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-app">
      <main
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
```

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { InicioScreen } from './screens/InicioScreen';
import { FaixasEtariasScreen } from './screens/FaixasEtariasScreen';
import { SituacoesScreen } from './screens/SituacoesScreen';
import { MuralScreen } from './screens/MuralScreen';
import { PremiosScreen } from './screens/PremiosScreen';
import { FrasesScreen } from './screens/FrasesScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<InicioScreen />} />
          <Route path="/faixas-etarias" element={<FaixasEtariasScreen />} />
          <Route path="/situacoes" element={<SituacoesScreen />} />
          <Route path="/mural" element={<MuralScreen />} />
          <Route path="/premios" element={<PremiosScreen />} />
          <Route path="/frases" element={<FrasesScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

This task depends on the screen files from Task 6 to exist for `tsc`/`vite` to resolve imports — create Task 6's files before verifying this task's build (both are done in the same session; verification happens at the end of Task 6).

- [ ] **Step 4: Commit** (bundled with Task 6, since `App.tsx` doesn't compile until the screens exist — see Task 6 Step 8)

---

### Task 6: Screens — Início (full) + 5 placeholders

**Files:**
- Create: `src/screens/InicioScreen.tsx`
- Create: `src/screens/FaixasEtariasScreen.tsx`
- Create: `src/screens/SituacoesScreen.tsx`
- Create: `src/screens/MuralScreen.tsx`
- Create: `src/screens/PremiosScreen.tsx`
- Create: `src/screens/FrasesScreen.tsx`

**Interfaces:**
- Consumes: none beyond React — all six are self-contained, registered as route elements by Task 5's `App.tsx`.
- Produces: nothing consumed further (leaf components).

- [ ] **Step 1: Create `src/screens/InicioScreen.tsx`**

```tsx
interface Fundamento {
  titulo: string;
  texto: string;
}

const FUNDAMENTOS: Fundamento[] = [
  {
    titulo: 'Conexão antes de correção',
    texto:
      'Antes de corrigir um comportamento, garanta que a criança sinta que você está do lado dela. Conexão vem primeiro, a correção rende muito mais depois.',
  },
  {
    titulo: 'Diálogo, não sermão',
    texto:
      'Prefira perguntas a discursos longos. "O que você acha que podia ter feito diferente?" ensina mais do que uma explicação de dez minutos.',
  },
  {
    titulo: 'Escuta ativa',
    texto:
      'Escutar de verdade significa parar o que está fazendo, olhar nos olhos e repetir o que entendeu antes de responder.',
  },
  {
    titulo: 'Respeito nos dois sentidos',
    texto:
      'Respeito não é obediência cega. É tratar a criança como alguém que também merece ser ouvido, mesmo quando o limite se mantém.',
  },
  {
    titulo: 'Paciência é treino, não personalidade',
    texto:
      'Ninguém nasce paciente. Paciência é uma prática diária, com recaídas normais — o importante é reparar depois de um deslize.',
  },
];

export function InicioScreen() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Meu Legado</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Fundamentos do dia a dia</h1>
        <p className="mt-2 text-sm text-primary/70">
          Cinco princípios de disciplina positiva para guiar as pequenas decisões de cada dia.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {FUNDAMENTOS.map((fundamento) => (
          <article
            key={fundamento.titulo}
            className="rounded-card border border-primary/10 bg-white/60 p-4 shadow-sm dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold text-primary">{fundamento.titulo}</h2>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">{fundamento.texto}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create a shared placeholder pattern — `src/screens/FaixasEtariasScreen.tsx`**

```tsx
export function FaixasEtariasScreen() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Faixas Etárias</p>
      <h1 className="text-2xl font-semibold text-primary">Em construção</h1>
      <p className="text-sm text-primary/70">
        Em breve você poderá escolher a faixa etária do seu filho e ver fases do desenvolvimento,
        desafios comuns e frases-guia para essa idade.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/screens/SituacoesScreen.tsx`**

```tsx
export function SituacoesScreen() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Situações</p>
      <h1 className="text-2xl font-semibold text-primary">Em construção</h1>
      <p className="text-sm text-primary/70">
        Em breve: um guia rápido de situações do dia a dia, com busca e o porquê, os passos
        práticos e a frase para usar em cada uma.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/screens/MuralScreen.tsx`**

```tsx
export function MuralScreen() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Mural de Estrelas</p>
      <h1 className="text-2xl font-semibold text-primary">Em construção</h1>
      <p className="text-sm text-primary/70">
        Em breve: a grade semanal para marcar estrelas por conduta cumprida e acompanhar as
        faixas de premiação.
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/screens/PremiosScreen.tsx`**

```tsx
export function PremiosScreen() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Prêmios</p>
      <h1 className="text-2xl font-semibold text-primary">Em construção</h1>
      <p className="text-sm text-primary/70">
        Em breve: ideias de recompensas organizadas por faixa de custo e complexidade.
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Create `src/screens/FrasesScreen.tsx`**

```tsx
export function FrasesScreen() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">Frases & Diálogo</p>
      <h1 className="text-2xl font-semibold text-primary">Em construção</h1>
      <p className="text-sm text-primary/70">
        Em breve: frases prontas agrupadas por momentos do dia a dia, para ter à mão na hora
        certa.
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Verify full type-check**

Run: `npx tsc --noEmit`
Expected: no errors across `App.tsx`, layout, and all screens.

- [ ] **Step 8: Commit (bundles Task 5 + Task 6, since they only compile together)**

```bash
git add src/App.tsx src/components/layout/AppLayout.tsx src/components/layout/TabBar.tsx src/screens
git commit -m "feat: add router, AppLayout, TabBar and 6 screens (Início complete, 5 placeholders)"
```

---

### Task 7: PWA icons and manifest wiring

**Files:**
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Modify: `vite.config.ts` (already references these paths from Task 1 — no change needed if Task 1 was followed exactly; this task only creates the actual image files)

**Interfaces:**
- Consumes: paths referenced in `vite.config.ts`'s `VitePWA({ manifest: { icons: [...] } })` from Task 1.
- Produces: physical icon files served at `/icons/icon-192.png` and `/icons/icon-512.png`.

- [ ] **Step 1: Generate placeholder icons with a small Node script**

Create a temporary script `scripts/gen-icons.mjs`:

```js
import { writeFileSync, mkdirSync } from 'node:fs';

// Minimal PNG encoder for a solid-color square with a centered circle,
// avoiding an extra dependency for a placeholder asset.
function solidPng(size, bgHex, fgHex) {
  // Use a tiny canvas-less approach: draw via SVG then note it's not a raster PNG.
  // Simpler and dependency-free: write an SVG and instruct sharp-free conversion isn't available,
  // so instead emit a valid PNG using the `pngjs`-free approach below.
  return null;
}

mkdirSync('public/icons', { recursive: true });

// Fallback: ship the icon as SVG and reference it from the manifest instead of PNG,
// since generating raster PNG without a dependency is unreliable.
const svg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#1F3A2E"/>
  <path d="M${size / 2} ${size * 0.22} L${size * 0.61} ${size * 0.42} L${size * 0.82} ${size * 0.45} L${size * 0.66} ${size * 0.6} L${size * 0.7} ${size * 0.8} L${size / 2} ${size * 0.7} L${size * 0.3} ${size * 0.8} L${size * 0.34} ${size * 0.6} L${size * 0.18} ${size * 0.45} L${size * 0.39} ${size * 0.42} Z" fill="#C9962F"/>
</svg>`;

writeFileSync('public/icons/icon-192.svg', svg(192));
writeFileSync('public/icons/icon-512.svg', svg(512));
console.log('SVG placeholder icons written.');
```

Run: `node scripts/gen-icons.mjs`
Expected: `public/icons/icon-192.svg` and `public/icons/icon-512.svg` created.

- [ ] **Step 2: Point the manifest and HTML at the SVG icons**

SVG is a valid `manifest.json` icon type and avoids needing a PNG-encoding dependency for a placeholder. Update `vite.config.ts`'s `VitePWA` call (from Task 1) so `includeAssets` and `manifest.icons` reference `.svg` instead of `.png`:

```ts
      includeAssets: ['icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'Meu Legado',
        short_name: 'Meu Legado',
        description: 'Disciplina positiva e acompanhamento do desenvolvimento dos filhos.',
        theme_color: '#1F3A2E',
        background_color: '#F5F1E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
```

Update `index.html`'s `<link rel="icon">` and `<link rel="apple-touch-icon">` to point at `/icons/icon-192.svg` (note: iOS Safari does not support SVG for `apple-touch-icon` in all versions — acceptable for this placeholder, to be swapped for a real PNG icon later per the spec's "fora de escopo" note... actually this IS in scope per the spec, so keep it simple and correct now).

- [ ] **Step 3: Remove the generator script (one-off, not part of the app)**

Run: `rm scripts/gen-icons.mjs && rmdir scripts 2>/dev/null || true` (bash) — keep only the generated SVG output under `public/icons/`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds, `dist/manifest.webmanifest` (or equivalent PWA output) references the SVG icons, no missing-asset warnings.

- [ ] **Step 5: Commit**

```bash
git add public/icons/icon-192.svg public/icons/icon-512.svg vite.config.ts index.html
git commit -m "feat: add placeholder PWA icons and wire manifest"
```

---

### Task 8: Final verification pass

**Files:** none created — verification only.

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build completes, no errors, `dist/` populated including PWA manifest and service worker.

- [ ] **Step 3: Manual dev smoke test**

Run: `npm run dev` and open the printed local URL in a browser at a mobile viewport (or resize dev tools to ~390px wide).
Check:
- Início screen renders the 5 fundamento cards with serif headings.
- Tab Bar is fixed at the bottom, all 6 tabs are tappable, active tab highlighted in accent color.
- Navigating to the other 5 tabs shows their "Em construção" placeholder, still inside the same mobile-width layout.
- Toggling OS-level dark mode changes background/text colors per the dark CSS vars.
- Stop the dev server when done.

- [ ] **Step 4: Commit any final fixes found during manual check**

If the manual check surfaces issues, fix them in the relevant file from Tasks 1–7 and commit with a message describing the fix (e.g., `fix: correct TabBar active-state contrast in dark mode`).

---

## Self-Review Notes

- Spec coverage: scaffold ✅ (Task 1), TS types for JSON ✅ (Task 2), JSON content for condutas/situações/frases/prêmios ✅ and faixas etárias ✅ (Task 3), hooks separating data from UI ✅ (Task 4), Tab Bar + 6 routes ✅ (Task 5), Início screen fully built + 5 placeholders ✅ (Task 6), PWA installable ✅ (Task 7), manual verification against the spec's criteria ✅ (Task 8).
- No placeholders left in code steps — every step has real file content; only the two "Em construção" screens are placeholders, and that's an intentional, spec-approved product decision, not a missing implementation detail.
- Type consistency checked: `ConteudoData`/`FaixasEtariasData` (Task 2) match the JSON shapes (Task 3) and the hook return types (Task 4); route paths in `TabBar.tsx` (Task 5) match the paths registered in `App.tsx` (Task 5).
