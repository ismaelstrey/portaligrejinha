import type { Category, Provider } from "@/types/catalog";

export const categories: Category[] = [
  {
    slug: "manutencao",
    name: "Manutenção",
    description: "Elétrica, hidráulica, pintura e reparos residenciais."
  },
  {
    slug: "saude-e-bem-estar",
    name: "Saúde e bem-estar",
    description: "Clínicas, fisioterapia, estética e atendimento especializado."
  },
  {
    slug: "alimentacao",
    name: "Alimentação",
    description: "Restaurantes, mercados, confeitarias e delivery."
  },
  {
    slug: "comercio",
    name: "Comércio",
    description: "Lojas locais, papelarias, material de construção e utilidades."
  }
];

export const providers: Provider[] = [
  {
    id: "p1",
    name: "Casa & Reparo Igrejinha",
    slug: "casa-e-reparo-igrejinha",
    category: "manutencao",
    neighborhood: "Centro",
    city: "Igrejinha",
    summary: "Equipe para elétrica, hidráulica e manutenção geral com atendimento residencial e comercial.",
    services: ["Elétrica", "Hidráulica", "Pintura"],
    verified: true,
    rating: 4.9,
    reviewCount: 126,
    responseTime: "até 20 min",
    latitude: -29.5744,
    longitude: -50.7905,
    x: 32,
    y: 38
  },
  {
    id: "p2",
    name: "Clínica Vida Leve",
    slug: "clinica-vida-leve",
    category: "saude-e-bem-estar",
    neighborhood: "Bom Pastor",
    city: "Igrejinha",
    summary: "Atendimento com fisioterapia, pilates e reabilitação para adultos e idosos.",
    services: ["Fisioterapia", "Pilates", "Reabilitação"],
    verified: true,
    rating: 4.8,
    reviewCount: 88,
    responseTime: "agendamento no dia",
    latitude: -29.5712,
    longitude: -50.7851,
    x: 62,
    y: 26
  },
  {
    id: "p3",
    name: "Mercado da Vila",
    slug: "mercado-da-vila",
    category: "alimentacao",
    neighborhood: "15 de Novembro",
    city: "Igrejinha",
    summary: "Mercado local com mercearia, hortifrúti e entrega rápida nos bairros centrais.",
    services: ["Mercado", "Hortifrúti", "Delivery"],
    verified: false,
    rating: 4.6,
    reviewCount: 54,
    responseTime: "até 45 min",
    latitude: -29.5781,
    longitude: -50.7941,
    x: 47,
    y: 55
  },
  {
    id: "p4",
    name: "Boutique Serra Bela",
    slug: "boutique-serra-bela",
    category: "comercio",
    neighborhood: "Viaduto",
    city: "Igrejinha",
    summary: "Loja de moda feminina, acessórios e curadoria local com atendimento presencial e online.",
    services: ["Moda", "Acessórios", "Retirada na loja"],
    verified: true,
    rating: 4.7,
    reviewCount: 37,
    responseTime: "até 1 hora",
    latitude: -29.5695,
    longitude: -50.7802,
    x: 71,
    y: 61
  }
];

export const reviewQueue = [
  {
    id: "r1",
    name: "Oficina Ponto Certo",
    status: "em revisão",
    category: "Serviços automotivos",
    city: "Igrejinha",
    updatedAt: "há 12 minutos"
  },
  {
    id: "r2",
    name: "Studio Raiz",
    status: "precisa ajuste",
    category: "Saúde e bem-estar",
    city: "Igrejinha",
    updatedAt: "há 35 minutos"
  },
  {
    id: "r3",
    name: "Padaria Sabor da Serra",
    status: "publicado",
    category: "Alimentação",
    city: "Igrejinha",
    updatedAt: "há 2 horas"
  }
];

export const dashboardHighlights = [
  {
    label: "Cadastros ativos",
    value: "1.284",
    detail: "+8,4% no mês"
  },
  {
    label: "Em revisão",
    value: "42",
    detail: "fila de curadoria"
  },
  {
    label: "Cobertura por bairro",
    value: "86%",
    detail: "mapa com pontos úteis"
  }
];
