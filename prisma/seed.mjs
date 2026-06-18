import bcrypt from "bcryptjs";
import { PrismaClient, OrganizationStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Portal123!", 10);

  const seededUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@portaligrejinha.local" },
      update: { name: "Administrador Portal", passwordHash, role: UserRole.ADMIN },
      create: {
        name: "Administrador Portal",
        email: "admin@portaligrejinha.local",
        passwordHash,
        role: UserRole.ADMIN
      }
    }),
    prisma.user.upsert({
      where: { email: "curadoria@portaligrejinha.local" },
      update: { name: "Equipe de Curadoria", passwordHash, role: UserRole.REVIEWER },
      create: {
        name: "Equipe de Curadoria",
        email: "curadoria@portaligrejinha.local",
        passwordHash,
        role: UserRole.REVIEWER
      }
    }),
    prisma.user.upsert({
      where: { email: "prestador@portaligrejinha.local" },
      update: { name: "Prestador Demo", passwordHash, role: UserRole.PROVIDER },
      create: {
        name: "Prestador Demo",
        email: "prestador@portaligrejinha.local",
        passwordHash,
        role: UserRole.PROVIDER
      }
    })
  ]);

  const reviewer = seededUsers[1];
  const provider = seededUsers[2];

  const categoryData = [
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
    },
    {
      slug: "turismo-e-hospedagem",
      name: "Turismo e hospedagem",
      description: "Hotéis, resorts, lazer e experiências de hospedagem no município."
    }
  ];

  const categoryRecords = {};

  for (const category of categoryData) {
    categoryRecords[category.slug] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description
      },
      create: category
    });
  }

  const legacyDemoSlugs = [
    "casa-e-reparo-igrejinha",
    "clinica-vida-leve",
    "mercado-da-vila",
    "boutique-serra-bela"
  ];

  await prisma.organization.deleteMany({
    where: {
      slug: {
        in: legacyDemoSlugs
      }
    }
  });

  const organizations = [
    {
      slug: "quiero-cafe-igrejinha",
      name: "Quiero Café",
      summary: "Cafeteria, restaurante e bar no Centro de Igrejinha, com operação própria da rede Quiero Café.",
      description: "Unidade da rede Quiero Café em Igrejinha, com serviço de cafeteria, refeições e atendimento em horário estendido.",
      neighborhood: "Centro",
      city: "Igrejinha",
      address: "Rua Oswaldo Cruz, 309",
      latitude: -29.5728491,
      longitude: -50.7888233,
      mapX: 63,
      mapY: 37,
      phone: "(51) 99964-4455",
      whatsapp: "(51) 99964-4455",
      email: null,
      website: "https://quierocafe.com.br/unidade/igrejinha-rs/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Cafeteria",
          description: "Bebidas quentes, cafés especiais e sobremesas."
        },
        {
          title: "Restaurante",
          description: "Refeições e almoço em unidade física."
        },
        {
          title: "Bar e happy hour",
          description: "Drinks e promoções em horários específicos da unidade."
        }
      ]
    },
    {
      slug: "ecoland-igrejinha",
      name: "Ecoland",
      summary: "Hotel fazenda e complexo de lazer em Igrejinha, com hospedagem, day use, restaurante e eventos.",
      description: "Complexo turístico com hospedagem, restaurante à la carte, day use, lazer ao ar livre e estrutura para eventos.",
      neighborhood: "Sanga Funda",
      city: "Igrejinha",
      address: "Rua Alfredo Brusius, 2121",
      latitude: -29.596878,
      longitude: -50.8361117,
      mapX: 10,
      mapY: 85,
      phone: "(51) 3545-5500",
      whatsapp: "(51) 98594-3488",
      email: null,
      website: "https://www.ecoland.com.br/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "turismo-e-hospedagem",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Hospedagem",
          description: "Acomodações em hotel fazenda com estrutura de lazer."
        },
        {
          title: "Day use",
          description: "Acesso diário à estrutura do complexo sem hospedagem."
        },
        {
          title: "Restaurante",
          description: "Restaurante aberto ao público com serviço à la carte."
        }
      ]
    },
    {
      slug: "bistro-da-pati-igrejinha",
      name: "Bistrô da Pati",
      summary: "Restaurante em Igrejinha com consumo no local, assentos ao ar livre e retirada externa.",
      description: "Bistrô com operação local em Igrejinha, atendimento presencial e opções para retirada.",
      neighborhood: "Centro",
      city: "Igrejinha",
      address: "Rua 7 de Setembro, 399",
      latitude: -29.5700267,
      longitude: -50.7939839,
      mapX: 22,
      mapY: 14,
      phone: "(51) 98111-6759",
      whatsapp: "(51) 98111-6759",
      email: "bistrodapati@gmail.com",
      website: "https://www.facebook.com/BistroDaPati2/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Restaurante",
          description: "Atendimento com consumo no local."
        },
        {
          title: "Assentos ao ar livre",
          description: "Área externa para refeições."
        },
        {
          title: "Retirada externa",
          description: "Retirada de pedidos fora do salão."
        }
      ]
    },
    {
      slug: "restaurante-tio-pa-igrejinha",
      name: "Restaurante Tio Pá",
      summary: "Restaurante em Igrejinha com atendimento no bairro Viaduto e operação divulgada nas redes locais.",
      description: "Restaurante local em Igrejinha, conhecido pelo almoço e atendimento de segunda a sábado.",
      neighborhood: "Viaduto",
      city: "Igrejinha",
      address: "Rua Bertalina Kirsch, 57",
      latitude: -29.5685,
      longitude: -50.8045,
      mapX: 10,
      mapY: 20,
      phone: "(51) 3549-1114",
      whatsapp: "(51) 3549-1114",
      email: null,
      website: "https://www.facebook.com/people/Restaurante-Tio-Pa/100034065377754/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Restaurante",
          description: "Atendimento de refeições no local."
        },
        {
          title: "Almoço",
          description: "Funcionamento de segunda a sábado no horário de almoço."
        }
      ]
    },
    {
      slug: "restaurante-duvido-igual-igrejinha",
      name: "Restaurante Duvido Igual",
      summary: "Restaurante e buffet no Centro de Igrejinha com contato fixo e WhatsApp divulgados publicamente.",
      description: "Estabelecimento gastronômico da marca Duvido Igual em Igrejinha, com operação no Centro.",
      neighborhood: "Centro",
      city: "Igrejinha",
      address: "Rua General Ernesto Dornelles, 346",
      latitude: -29.5722,
      longitude: -50.7902,
      mapX: 52,
      mapY: 32,
      phone: "(51) 3786-7381",
      whatsapp: "(51) 99851-9595",
      email: null,
      website: "https://www.instagram.com/restauranteduvidoigual/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Restaurante",
          description: "Atendimento gastronômico no Centro de Igrejinha."
        },
        {
          title: "Buffet",
          description: "Operação classificada como buffet em diretório comercial local."
        }
      ]
    },
    {
      slug: "imperio-da-pizza-igrejinha",
      name: "Império da Pizza",
      summary: "Pizzaria em Igrejinha com rodízio e atendimento presencial, delivery e retirada.",
      description: "Pizzaria local com operação em forno a lenha e presença ativa nas redes sociais.",
      neighborhood: "Centro",
      city: "Igrejinha",
      address: "Rua General Ernesto Dornelles, 958",
      latitude: -29.5719,
      longitude: -50.7898,
      mapX: 55,
      mapY: 29,
      phone: "(51) 99552-6980",
      whatsapp: "(51) 99552-6980",
      email: "iimperiodapizza@gmail.com",
      website: "https://www.facebook.com/ImperioDaPizza1/",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Pizzaria",
          description: "Serviço de pizzas no local."
        },
        {
          title: "Delivery",
          description: "Entrega e retirada divulgadas na página oficial."
        },
        {
          title: "Rodízio e à la carte",
          description: "Operação com rodízio e menu à la carte."
        }
      ]
    },
    {
      slug: "pizzaria-duvido-igual-igrejinha",
      name: "Pizzaria Duvido Igual",
      summary: "Pizzaria em Igrejinha com rodízio, atendimento noturno e foco em pizza quadrada.",
      description: "Unidade da marca Duvido Igual voltada para pizzaria, com horário noturno e rodízio.",
      neighborhood: "Figueira",
      city: "Igrejinha",
      address: "Rua Anita Garibaldi, 775",
      latitude: -29.5636379,
      longitude: -50.7958083,
      mapX: 10,
      mapY: 10,
      phone: "(51) 3786-7376",
      whatsapp: "(51) 3545-3942",
      email: "pizzariaduvidoigual@gmail.com",
      website: "https://igrejinha.portaldacidade.com/guia-comercial/igrejinha/pizzaria-duvido-igual",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Rodízio de pizza",
          description: "Rodízio com mais de 50 sabores divulgado na página comercial."
        },
        {
          title: "Pizzaria noturna",
          description: "Funcionamento de quarta a domingo no período da noite."
        },
        {
          title: "Reservas e pedidos",
          description: "Contato por telefone e WhatsApp."
        }
      ]
    },
    {
      slug: "boston-coffee-house-igrejinha",
      name: "Boston Coffee House",
      summary: "Cafeteria em Igrejinha com operação na Avenida Ildo Meneghetti e boa reputação pública em guias locais.",
      description: "Cafeteria localizada em Igrejinha, reconhecida em diretórios locais e avaliações públicas.",
      neighborhood: "XV de Novembro",
      city: "Igrejinha",
      address: "Avenida Ildo Meneghetti, 730",
      latitude: -29.5768,
      longitude: -50.7844,
      mapX: 80,
      mapY: 68,
      phone: null,
      whatsapp: null,
      email: null,
      website: "https://igrejinha.portaldacidade.com/guia-comercial/igrejinha/boston-coffeehouse",
      responseTimeMinutes: 0,
      verified: true,
      rating: 0,
      reviewCount: 0,
      status: OrganizationStatus.PUBLISHED,
      categorySlug: "alimentacao",
      ownerId: provider.id,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      services: [
        {
          title: "Cafeteria",
          description: "Serviço de cafés e acompanhamentos."
        },
        {
          title: "Lanches e doces",
          description: "Opções de cafeteria e snacks conforme guias públicos."
        }
      ]
    }
  ];

  for (const item of organizations) {
    const organization = await prisma.organization.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        summary: item.summary,
        description: item.description,
        neighborhood: item.neighborhood,
        city: item.city,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        mapX: item.mapX,
        mapY: item.mapY,
        phone: item.phone,
        whatsapp: item.whatsapp,
        email: item.email,
        website: item.website,
        responseTimeMinutes: item.responseTimeMinutes,
        verified: item.verified,
        rating: item.rating,
        reviewCount: item.reviewCount,
        status: item.status,
        moderationNotes: item.moderationNotes ?? null,
        ownerId: item.ownerId,
        reviewedById: item.reviewedById ?? null,
        reviewedAt: item.reviewedAt ?? null,
        categoryId: categoryRecords[item.categorySlug].id
      },
      create: {
        name: item.name,
        slug: item.slug,
        summary: item.summary,
        description: item.description,
        neighborhood: item.neighborhood,
        city: item.city,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        mapX: item.mapX,
        mapY: item.mapY,
        phone: item.phone,
        whatsapp: item.whatsapp,
        email: item.email,
        website: item.website,
        responseTimeMinutes: item.responseTimeMinutes,
        verified: item.verified,
        rating: item.rating,
        reviewCount: item.reviewCount,
        status: item.status,
        moderationNotes: item.moderationNotes ?? null,
        ownerId: item.ownerId,
        reviewedById: item.reviewedById ?? null,
        reviewedAt: item.reviewedAt ?? null,
        categoryId: categoryRecords[item.categorySlug].id
      }
    });

    await prisma.serviceOffering.deleteMany({
      where: { organizationId: organization.id }
    });

    await prisma.serviceOffering.createMany({
      data: item.services.map((service) => ({
        ...service,
        organizationId: organization.id
      }))
    });
  }

  console.log("Seed concluído.");
  console.log("Usuários de acesso local:");
  console.log("admin@portaligrejinha.local / Portal123!");
  console.log("curadoria@portaligrejinha.local / Portal123!");
  console.log("prestador@portaligrejinha.local / Portal123!");

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
