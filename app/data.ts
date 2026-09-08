export type ProductId = 'blue' | 'pink' | 'emerald' | 'duo';

export type Product = {
  id: ProductId;
  index: string;
  name: string;
  subtitle: string;
  mood: string;
  description: string;
  image: string;
  price: number;
  compareAt?: number;
  url: string;
  notes: [string, string, string];
};

const HERO = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_091944_bc61ad67-edb4-4e67-af1b-0535544a8d7f.png';
const PINK = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_092605_eb19eae5-b1a7-48e7-944e-59bd66bd136e.png';
const EMERALD = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_092606_e074ed4d-efdd-42b6-b489-4430a968ccce.png';
const DUO = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_092604_b33aba1a-e466-4961-94e7-d49ddb78842c.png';

export const products: Product[] = [
  {
    id: 'blue', index: '01', name: 'Blue Sapphire', subtitle: 'Pour Homme', mood: 'Fresh / Clean / Sporty',
    description: 'Citrus, marine freshness and warm cedar-amber clarity in a signature designed to stay close and leave a precise trail.',
    image: HERO, price: 1299, url: 'https://lacomusph.com/products/lacomus-pour-homme',
    notes: ['Bergamot · Lemon · Bitter Orange', 'Lavender · Marine Accord · Tonka', 'Cedarwood · Amber · Vanilla · Musk'],
  },
  {
    id: 'pink', index: '02', name: 'Pink Sapphire', subtitle: 'Pour Femme', mood: 'Elegant / Warm / Captivating',
    description: 'Coffee, white florals, cacao and vanilla-tonka warmth shaped into a refined, polished gourmand-floral signature.',
    image: PINK, price: 1299, url: 'https://lacomusph.com/products/lacomus-pour-femme',
    notes: ['Almond · Coffee · Bergamot · Pink Pepper', 'Jasmine Sambac · Tuberose · Orris · Rose', 'Tonka · Cacao · Vanilla · Sandalwood · Amber'],
  },
  {
    id: 'emerald', index: '03', name: 'Emerald', subtitle: 'Pour Homme', mood: 'Spiced / Deep / Distinctive',
    description: 'Vivid spice, cacao and mint settle into oud, woods, amber and vanilla — a darker expression of quiet power.',
    image: EMERALD, price: 1169.1, compareAt: 1299, url: 'https://lacomusph.com/products/lacomus-emerald-pour-homme',
    notes: ['Pink Pepper · Cardamom · Pineapple · Bergamot', 'Cacao · Mint', 'Oud · Guaiac Wood · Vanilla · Amber · Cedarwood'],
  },
];

export const duo: Product = {
  id: 'duo', index: '04', name: 'Signature Duo', subtitle: 'Blue + Pink Sapphire', mood: 'Two signatures / One language',
  description: 'Two distinct signatures in one set — made for gifting, pairing or sharing the same language of quiet confidence.',
  image: DUO, price: 2468.1, compareAt: 2598, url: 'https://lacomusph.com/products/pour-homme-and-pour-femme',
  notes: ['Blue Sapphire + Pink Sapphire', 'Freshness + floral-gourmand warmth', 'A paired signature for two distinct presences'],
};

export const allProducts = [...products, duo];

export const peso = (value: number) => new Intl.NumberFormat('en-PH', {
  style: 'currency', currency: 'PHP', minimumFractionDigits: 2,
}).format(value);
