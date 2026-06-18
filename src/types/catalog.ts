export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Provider = {
  id: string;
  name: string;
  slug: string;
  category: string;
  neighborhood: string;
  city: string;
  address?: string | null;
  summary: string;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  services: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseTime: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
};
