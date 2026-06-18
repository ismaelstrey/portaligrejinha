# Portal de cadastro e prestação de serviços

## Visão do produto

O portal será uma plataforma para descoberta, cadastro, curadoria e visualização de serviços locais. O foco inicial é reunir prestadores de serviço, comércios, profissionais autônomos e pontos úteis da cidade em uma experiência única, com busca, filtros, páginas públicas e um modo de mapa para navegação geográfica.

O produto deve nascer com base em `Next.js` moderno e arquitetura preparada para crescimento. A primeira versão precisa suportar:

- cadastro de empresas, profissionais e serviços
- catálogo público com busca
- visualização em lista e em mapa
- áreas administrativas para revisão e moderação
- páginas públicas otimizadas para SEO
- base preparada para expansão com avaliações, favoritos, anúncios e planos pagos

## Objetivos da primeira fase

- consolidar uma base única de informações úteis da cidade
- permitir que o usuário encontre um serviço por categoria, bairro, cidade ou proximidade
- permitir que administradores moderem e publiquem cadastros
- entregar visualização em mapa com marcadores, filtros e detalhes rápidos
- estruturar uma fundação técnica escalável antes do início do desenvolvimento funcional

## Tipos de usuário

| Perfil | Necessidade principal | Área do sistema |
|---|---|---|
| Visitante | encontrar serviços e comércios rapidamente | catálogo público |
| Prestador | cadastrar e manter seus dados atualizados | painel do prestador |
| Curadoria | revisar dados, validar qualidade e evitar duplicidade | backoffice |
| Administrador | controlar categorias, regiões, destaques e governança | painel admin |

## Escopo funcional inicial

### Catálogo público

- página inicial com busca global
- listagem por categoria
- listagem por localidade
- página de detalhes do serviço ou comércio
- filtros por categoria, subcategoria, bairro, cidade, horário e faixa de atendimento
- modo lista e modo mapa

### Cadastro e gestão

- formulário de cadastro de estabelecimento ou prestador
- cadastro de serviços oferecidos
- cadastro de endereço e geolocalização
- upload de imagens, logo e contatos
- status de publicação: `rascunho`, `em revisão`, `publicado`, `rejeitado`

### Curadoria e moderação

- fila de revisão
- detecção de duplicidade por nome, telefone e coordenadas
- histórico de alterações
- revisor responsável
- trilha de auditoria para publicações e rejeições

### Mapa

- exibição de marcadores por categoria
- agrupamento por proximidade
- painel lateral com resultados
- destaque visual ao selecionar item da lista
- filtros sincronizados entre lista e mapa
- foco em performance para grande volume de pontos

## Estratégia técnica com Next.js

O projeto será construído em `Next.js` com `App Router`, privilegiando renderização no servidor, segmentação de rotas e separação clara entre experiência pública, área autenticada e backoffice.

### Stack principal

| Camada | Decisão |
|---|---|
| Framework | `Next.js` com `App Router` |
| Linguagem | `TypeScript` |
| UI | `React` com `Server Components` e `Client Components` pontuais |
| Estilo | `Tailwind CSS` + tokens próprios do design system |
| Componentes base | biblioteca interna com padrão `ui` |
| Dados | `PostgreSQL` |
| ORM | `Prisma` |
| Autenticação | `NextAuth` ou `Auth.js` com papéis e sessões seguras |
| Uploads | `S3` compatível ou storage equivalente |
| Busca | PostgreSQL no início, com possibilidade de evoluir para `Meilisearch` ou `OpenSearch` |
| Mapas | `Mapbox` ou `Leaflet` com tiles e clustering |
| Observabilidade | logs estruturados, métricas e tracing |

### Recursos do Next.js que serão priorizados

- `App Router` para separar domínio público, autenticado e administrativo
- `Server Components` para páginas de listagem, SEO e leitura de dados
- `Server Actions` para formulários internos e operações seguras
- `Route Handlers` para integrações, webhooks e APIs externas
- `Metadata API` para SEO local por categoria e localidade
- `Middleware` para proteção de áreas privadas e regras de acesso
- `Image` para otimização de mídia
- `dynamic import` para componentes pesados do mapa
- cache control com `revalidateTag` e invalidação dirigida por domínio

## Arquitetura recomendada

### Abordagem

O projeto deve começar como um monólito modular. Isso reduz complexidade inicial, acelera a entrega e mantém espaço para evolução futura sem dependência prematura de microsserviços.

### Domínios de negócio

| Domínio | Responsabilidade |
|---|---|
| `catalog` | leitura pública, busca, filtros, ranking |
| `providers` | cadastro e manutenção de prestadores |
| `services` | serviços oferecidos e classificação |
| `locations` | cidade, bairro, coordenadas e regiões |
| `moderation` | revisão, aprovação e rejeição |
| `media` | imagens, logo e galeria |
| `identity` | autenticação, perfis e permissões |
| `map` | consulta geográfica, clusters e viewport |

### Estrutura de pastas sugerida

```txt
src/
  app/
    (public)/
    (provider)/
    (admin)/
    api/
  components/
    ui/
    shared/
    map/
    catalog/
    forms/
  features/
    catalog/
    providers/
    services/
    locations/
    moderation/
    identity/
    map/
  server/
    db/
    auth/
    cache/
    services/
    repositories/
  lib/
    utils/
    validators/
    constants/
  styles/
  types/
```

### Fluxo por camadas

1. `app` define rotas, layout e composição de página.
2. `features` concentra regras do domínio e casos de uso.
3. `server/services` executa operações de negócio no servidor.
4. `repositories` isolam acesso a dados.
5. `components` recebe apenas dados já preparados para renderização.

## Modelo de dados inicial

### Entidades principais

| Entidade | Campos centrais |
|---|---|
| `Organization` | nome, slug, descrição, status, categoria principal |
| `ServiceOffering` | título, descrição, preço opcional, tags, organização |
| `Category` | nome, slug, ícone, hierarquia |
| `Location` | endereço, bairro, cidade, estado, CEP, latitude, longitude |
| `ContactChannel` | telefone, WhatsApp, e-mail, website, redes |
| `MediaAsset` | logo, capa, galeria, alt text |
| `ReviewQueueItem` | status, revisor, motivo, histórico |
| `User` | perfil, papel, organização vinculada |

### Regras importantes

- um prestador pode ter vários serviços
- uma organização pode ter mais de uma unidade no futuro
- localização deve ficar separada para facilitar geocodificação e busca espacial
- taxonomias precisam aceitar expansão sem quebrar URLs
- publicação pública depende de moderação

## Modo de visualização em mapa

O mapa não deve ser tratado como uma página isolada, mas como uma variação de leitura do mesmo catálogo. Lista e mapa precisam compartilhar estado, filtros, ordenação e paginação inteligente.

### Requisitos do mapa

- sincronizar `viewport` com os resultados
- aplicar filtros sem recarregar a página inteira
- exibir clusters em zoom menor
- exibir `drawer` ou `popover` com resumo do item
- permitir abrir a página completa do prestador ou serviço
- suportar fallback para lista caso o mapa não carregue

### Estratégia de implementação

- usar rota pública dedicada, como `/explorar`
- manter filtros na `URL` para compartilhamento e SEO parcial
- carregar biblioteca do mapa por `dynamic import`
- servir resultados simplificados no mapa e detalhes completos na lateral
- usar cache por área visível e combinação de filtros

## SEO e conteúdo local

O portal depende muito de descoberta orgânica. Por isso, o projeto deve preparar páginas indexáveis por:

- categoria
- cidade
- bairro
- combinação categoria + localidade
- página individual do prestador

### Estratégia

- `Metadata API` por rota
- `schema.org` para negócio local e serviço
- `sitemap` segmentado
- URLs estáveis e legíveis
- conteúdo textual mínimo por página de categoria para evitar páginas vazias

## Segurança e governança

- autenticação por sessão segura
- RBAC com papéis `visitor`, `provider`, `reviewer`, `admin`
- validação de payload no servidor
- trilha de auditoria para ações sensíveis
- proteção contra spam em formulários públicos
- rate limit em APIs de cadastro e contato

## Roadmap técnico recomendado

### Etapa 1

- fundação do projeto
- design system
- autenticação
- modelo de dados
- módulos de categoria e localização

### Etapa 2

- cadastro de prestadores e serviços
- backoffice de moderação
- catálogo público em lista

### Etapa 3

- modo mapa
- SEO local
- performance e observabilidade

### Etapa 4

- avaliações
- favoritos
- destaque patrocinado
- analytics por prestador

## Decisões de arquitetura

| Tema | Decisão |
|---|---|
| Escala inicial | monólito modular |
| Renderização | server-first |
| Escrita de dados | `Server Actions` para fluxos internos e formulários |
| APIs | `Route Handlers` para integrações e endpoints externos |
| Estado global | mínimo possível, preferindo estado por rota e componentes locais |
| Busca | SQL otimizado no início |
| Mapa | componente cliente isolado, dados vindos do servidor |
| Padrão de domínio | casos de uso + repositórios |

## Próxima etapa sugerida

Com esta fundação pronta, a próxima fase pode começar pela criação do projeto `Next.js`, instalação do design system base, definição do banco e implementação dos módulos `catalog`, `providers`, `locations` e `moderation`.
