# Padrões de projeto e engenharia

## Direção geral

O projeto seguirá uma arquitetura de monólito modular, com separação por domínio e fronteiras claras entre interface, casos de uso e infraestrutura. A meta é crescer com organização sem criar complexidade excessiva cedo demais.

## Padrões adotados

### Estrutura por domínio

Cada domínio deve agrupar:

- componentes específicos
- ações do servidor
- esquemas de validação
- casos de uso
- repositórios
- tipos locais

### Server first

- leitura de dados em componentes do servidor sempre que possível
- componentes cliente apenas quando houver interação rica, mapa, máscara ou estado local complexo
- evitar buscar no cliente o que já pode vir pronto do servidor

### Casos de uso

As regras de negócio devem ficar em funções explícitas, por exemplo:

- `createProvider`
- `publishListing`
- `searchCatalog`
- `reviewSubmission`

Evitar lógica de negócio diretamente em componentes React ou em handlers de rota extensos.

### Repositórios

Os acessos a dados precisam ser concentrados em repositórios. Isso reduz acoplamento com ORM e facilita testes.

Exemplo:

```ts
export interface ProviderRepository {
  findById(id: string): Promise<Provider | null>
  search(filters: CatalogFilters): Promise<CatalogSearchResult>
  create(input: CreateProviderInput): Promise<Provider>
}
```

### Schemas e validação

- usar `zod` para contratos de entrada
- validar no servidor mesmo quando o cliente já validou
- reaproveitar schemas entre formulário e ação do servidor quando fizer sentido

### Cache e invalidação

- usar cache por rota e por domínio
- invalidar com `revalidateTag`
- nomear tags de forma previsível, como `catalog`, `provider:{id}`, `category:{slug}`

## Convenções de rotas

```txt
/(public)
  /
  /explorar
  /categoria/[slug]
  /cidade/[slug]
  /servicos/[slug]
  /prestadores/[slug]

/(provider)
  /painel
  /painel/cadastros
  /painel/servicos

/(admin)
  /admin
  /admin/revisoes
  /admin/categorias
  /admin/localidades
```

## Convenções de código

- nomes de arquivos em `kebab-case`
- componentes React em `PascalCase`
- funções utilitárias com nomes verbais claros
- arquivos de teste próximos do domínio testado
- proibir `any` sem justificativa real

## Padrões de UI

- componente de página monta a composição
- componente de seção organiza blocos maiores
- componente `ui` resolve comportamento básico e reutilizável
- regras de apresentação ficam fora do domínio de dados

## Padrões de formulário

- `react-hook-form` para formulários complexos
- `zodResolver` para coerência entre cliente e servidor
- submissão com feedback otimista apenas onde houver segurança
- mensagens de erro objetivas e em português

## Padrões para mapa

- isolar dependências do mapa em `src/components/map`
- toda transformação geográfica deve sair de uma camada de serviço
- não acoplar API externa de mapas ao restante do domínio
- resultados do mapa e da lista devem sair do mesmo contrato de busca

## Observabilidade

- logs estruturados por domínio
- correlação de requisição com `requestId`
- métricas mínimas para busca, cadastro e moderação
- captura de erro de front e server

## Qualidade

### Testes

- `Vitest` para lógica e utilitários
- `Testing Library` para componentes críticos
- `Playwright` para fluxos principais

### Fluxos que precisam de cobertura cedo

- cadastro de prestador
- publicação após moderação
- busca por categoria e localidade
- sincronização lista e mapa
- controle de acesso ao admin

## Segurança

- RBAC obrigatório
- sanitização de texto livre
- proteção contra upload inválido
- rate limit em cadastro e contato
- auditoria para ações administrativas

## Definition of done

Uma entrega só pode ser considerada pronta quando:

- regra de negócio está em caso de uso ou serviço
- inputs estão validados
- estados de loading e erro foram tratados
- acessibilidade básica foi revisada
- logs e erros críticos foram mapeados
- documentação do módulo foi atualizada se necessário
