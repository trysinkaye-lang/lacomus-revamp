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

const BLUE = 'https://lacomusph.com/cdn/shop/files/pourhommenew.jpg?v=1779268404&width=2400';
const PINK = 'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-05.jpg?v=1777665172&width=2400';
const EMERALD = 'https://lacomusph.com/cdn/shop/files/ROI09598.jpg?v=1787149413&width=2400';
const DUO = 'https://lacomusph.com/cdn/shop/files/HRS07020_9d1536e5-bce7-4340-a1d3-2b30deb0eee2.jpg?v=1783715342&width=2400';

export const products: Product[] = [
  {
    id: 'blue',
    index: '01',
    name: 'Lacomus Blue Sapphire',
    subtitle: 'Pour Homme · Eau de Parfum',
    mood: 'Fresh · Clean · Sporty · Masculine',
    description: 'For the man who carries quiet confidence — fresh, refined, and effortlessly masculine.',
    image: BLUE,
    price: 1299,
    url: 'https://lacomusph.com/products/lacomus-pour-homme',
    notes: [
      'Bergamot · Lemon · Coffee · Bitter Orange',
      'Lavender · Marine Accord · Tonka Bean',
      'Cedarwood · Amber · Vanilla · Musk',
    ],
  },
  {
    id: 'pink',
    index: '02',
    name: 'Lacomus Pink Sapphire',
    subtitle: 'Pour Femme · Eau de Parfum',
    mood: 'Feminine · Elegant · Soft · Captivating',
    description: 'For the woman who carries grace with quiet confidence — soft, refined, and unforgettable.',
    image: PINK,
    price: 1299,
    url: 'https://lacomusph.com/products/lacomus-pour-femme',
    notes: [
      'Official scent notes to be updated by LACOMUS',
      'Official scent notes to be updated by LACOMUS',
      'Official scent notes to be updated by LACOMUS',
    ],
  },
  {
    id: 'emerald',
    index: '03',
    name: 'Lacomus Emerald',
    subtitle: 'Pour Homme · Eau de Parfum',
    mood: 'Bold · Refined · Distinctive',
    description: 'A bold new expression of quiet power, built around spice, cacao, mint, oud, amber and woods.',
    image: EMERALD,
    price: 1169.1,
    compareAt: 1299,
    url: 'https://lacomusph.com/products/lacomus-emerald-pour-homme',
    notes: [
      'Pink Pepper · Cardamom · Pineapple · Bergamot',
      'Cacao · Mint',
      'Oud · Guaiac Wood · Vanilla · Amber · Cedarwood',
    ],
  },
];

export const duo: Product = {
  id: 'duo',
  index: '04',
  name: 'Blue Sapphire and Pink Sapphire Bundle',
  subtitle: 'Pour Homme + Pour Femme',
  mood: 'Two signature scents · One set',
  description: 'A fragrance pair for couples, gifting, shared memories, or anyone who wants both LACOMUS signatures.',
  image: DUO,
  price: 2468.1,
  compareAt: 2598,
  url: 'https://lacomusph.com/products/pour-homme-and-pour-femme',
  notes: ['Blue Sapphire', 'Pink Sapphire', 'A paired signature for two distinct presences'],
};

export const allProducts = [...products, duo];

export const peso = (value: number) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
}).format(value);
