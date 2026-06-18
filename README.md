# Portal Igrejinha

Base inicial de planejamento e fundação técnica para um portal de cadastro e descoberta de serviços, prestadores e comércios com visualização em mapa.

## Arquivos principais

- `docs/portal-blueprint.md`: visão geral do produto, arquitetura, módulos e estratégia com Next.js
- `docs/design-system.md`: tokens, componentes base e regras de interface
- `docs/project-standards.md`: padrões de projeto, código, testes e segurança
- `agents/registry.yaml`: configuração inicial dos agentes técnicos e fluxo de handoff

## Stack já conectada

- `Next.js` com `App Router`
- `TypeScript`
- `Tailwind CSS`
- `Prisma` com `PostgreSQL`
- `next-auth` com credenciais locais

## Banco e autenticação

- schema Prisma em `prisma/schema.prisma`
- seed inicial em `prisma/seed.mjs`
- autenticação em `src/auth.ts`
- rota de API do auth em `src/app/api/auth/[...nextauth]/route.ts`
- guardas de acesso em `src/lib/access.ts`

## Scripts úteis

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:seed`

## Próxima etapa

Com essa base aprovada, o próximo passo é evoluir o cadastro real com `Server Actions`, persistir novos prestadores, criar moderação operacional completa e conectar um mapa real com biblioteca geográfica.
