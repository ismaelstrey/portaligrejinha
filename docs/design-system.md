# Design system do portal

## Princípios

O design system precisa transmitir confiança, utilidade e clareza local. A experiência deve parecer um serviço público digital bem resolvido, sem excesso visual e com foco em descoberta rápida.

### Princípios centrais

- clareza antes de decoração
- legibilidade em mobile primeiro
- filtros e busca sempre visíveis
- consistência entre lista, card, detalhe e mapa
- acessibilidade como requisito de base

## Linguagem visual

### Personalidade

- útil
- confiável
- próximo
- moderno sem parecer genérico

### Direção estética

- base clara com contraste alto
- destaque forte para ações primárias
- cartões com densidade média
- ícones simples
- espaço generoso entre blocos de informação

## Tokens

### Cores

```ts
export const colors = {
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF2F7",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#D9E2EC",
  primary: "#1D4ED8",
  primaryHover: "#1E40AF",
  secondary: "#0F766E",
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
  info: "#2563EB",
  mapHighlight: "#F97316"
}
```

### Tipografia

```ts
export const typography = {
  fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontHeading: "Inter, ui-sans-serif, system-ui, sans-serif",
  fontMono: "JetBrains Mono, ui-monospace, monospace",
  scale: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px"
  }
}
```

### Espaçamento

```ts
export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px"
}
```

### Bordas e sombra

```ts
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  pill: "999px"
}

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
  md: "0 8px 24px rgba(15, 23, 42, 0.08)"
}
```

## Componentes base

### Navegação

- `AppHeader`
- `PrimaryNav`
- `Breadcrumbs`
- `SectionTabs`

### Descoberta

- `SearchBar`
- `FilterSheet`
- `CategoryChips`
- `SortSelect`
- `EmptyState`

### Catálogo

- `ProviderCard`
- `ServiceCard`
- `CategoryGrid`
- `ResultCount`
- `Pagination`

### Mapa

- `MapCanvas`
- `MapMarker`
- `MapCluster`
- `MapResultDrawer`
- `MapLegend`

### Formulários

- `TextField`
- `TextareaField`
- `SelectField`
- `PhoneField`
- `AddressField`
- `ImageUploader`
- `FormSection`

### Administração

- `DataTable`
- `StatusBadge`
- `ReviewTimeline`
- `AuditLogPanel`
- `MetricsCard`

## Estados visuais obrigatórios

Cada componente precisa nascer com estados mapeados:

- `default`
- `hover`
- `focus-visible`
- `disabled`
- `loading`
- `error`
- `empty`, quando aplicável

## Regras para o mapa

- marcadores ativos e passivos precisam ser claramente distinguíveis
- cluster nunca deve esconder categoria por completo
- o item selecionado na lista deve refletir no mapa
- tooltips não devem concentrar informação crítica demais
- o mapa deve preservar usabilidade em telas pequenas

## Grid e layout

### Breakpoints

```ts
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
}
```

### Regras

- mobile primeiro
- largura máxima de conteúdo principal entre `1200px` e `1280px`
- páginas de detalhe com coluna principal e lateral apenas a partir de `lg`
- filtros em `drawer` no mobile e barra lateral no desktop

## Acessibilidade

- contraste AA em textos e elementos interativos
- foco visível em todos os controles
- navegação por teclado nas áreas de busca e filtros
- marcadores do mapa com rótulo acessível
- formulários com mensagens de erro descritivas

## Convenções de implementação

- tokens centralizados em `src/styles/tokens.ts`
- componentes base em `src/components/ui`
- variantes definidas com `cva` ou convenção equivalente
- ícones padronizados em um único pacote
- componentes do domínio não podem redefinir tokens locais

## Sequência de construção

1. tokens globais
2. primitives de layout e tipografia
3. inputs e botões
4. cards e tabelas
5. busca e filtros
6. componentes do mapa
7. componentes de backoffice
