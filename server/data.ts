import { lorem } from './util.ts';

export interface Review {
  id: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  internalModerationNotes: string;
}

export interface Supplier {
  name: string;
  email: string;
  phone: string;
  taxId: string;
  unitCost: number;
  leadTimeDays: number;
  warehouseCode: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  careInstructions: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  image: string;
  gallery: string[];
  category: string;
  tags: string[];
  stock: number;
  warehouse: string;
  weightGrams: number;
  dimensionsCm: { w: number; h: number; d: number };
  supplier: Supplier;
  margin: number;
  createdBy: string;
  internalNotes: string;
  seoTitle: string;
  seoKeywords: string[];
  relatedIds: string[];
  reviews: Review[];
}

function review(
  id: string,
  author: string,
  email: string,
  rating: number,
  title: string,
  body: string,
  xss = false,
): Review {
  return {
    id,
    author,
    email,
    rating,
    title,
    body: xss
      ? `${body} <img src="x" onerror="alert('XSS de demostración: innerHTML sin sanitizar')">`
      : body,
    createdAt: '2026-03-12T10:00:00.000Z',
    internalModerationNotes: xss
      ? 'ALERTA: payload de prueba, no publicar en producción'
      : 'OK — sin incidencias',
  };
}

export const products: Product[] = [
  {
    id: 'auriculares',
    sku: 'CL-AUD-001',
    name: 'Auriculares Nórdica',
    shortDescription: 'Sonido de alta calidad para el día a día.',
    description: lorem('Auriculares Nórdica con almohadillas de cuero vegetal y diadema de nogal'),
    careInstructions: lorem('Cuidado de auriculares', 3),
    price: 189,
    compareAtPrice: 240,
    currency: 'EUR',
    image: '/images/auriculares.webp',
    gallery: ['/images/auriculares.webp', '/images/hero.webp'],
    category: 'audio',
    tags: ['audio', 'nogal', 'cuero', 'oficina', 'regalo'],
    stock: 42,
    warehouse: 'MAD-3-B12',
    weightGrams: 280,
    dimensionsCm: { w: 18, h: 20, d: 8 },
    supplier: {
      name: 'Nordic Sound AB',
      email: 'compras.internas@nordic-sound.fake',
      phone: '+46 8 555 0101',
      taxId: 'SE-FAKE-554433',
      unitCost: 67.4,
      leadTimeDays: 21,
      warehouseCode: 'GOT-INB',
    },
    margin: 0.64,
    createdBy: 'ana.almacen@casa-lumen.fake',
    internalNotes: 'Negociar MOQ 200 uds en Q3. Coste real no mostrar en storefront.',
    seoTitle: 'Auriculares Nórdica de madera | Casa Lumen',
    seoKeywords: ['auriculares', 'madera', 'nogal', 'diseño', 'casa lumen'],
    relatedIds: ['altavoz', 'lampara'],
    reviews: [
      review(
        'r1',
        'María G.',
        'maria.garcia@correo.fake',
        5,
        'Los uso todo el día',
        'Me encantó el acabado y el peso. Muy cómodos para reuniones.',
        true,
      ),
      review(
        'r2',
        'Luis P.',
        'luis.perez@correo.fake',
        4,
        'Buen sonido',
        'Graves discretos, perfectos para podcasts.',
      ),
    ],
  },
  {
    id: 'altavoz',
    sku: 'CL-SPK-002',
    name: 'Altavoz Lumen',
    shortDescription: 'Potencia y diseño en un solo dispositivo.',
    description: lorem('Altavoz Lumen de tela acústica y carcasa de aluminio anodizado'),
    careInstructions: lorem('Cuidado del altavoz', 3),
    price: 249,
    compareAtPrice: 299,
    currency: 'EUR',
    image: '/images/altavoz.webp',
    gallery: ['/images/altavoz.webp'],
    category: 'audio',
    tags: ['audio', 'bluetooth', 'salón'],
    stock: 18,
    warehouse: 'MAD-1-A04',
    weightGrams: 1200,
    dimensionsCm: { w: 14, h: 18, d: 14 },
    supplier: {
      name: 'Audio Casa Ltd',
      email: 'ap@audiocasa.fake',
      phone: '+44 20 7946 0991',
      taxId: 'GB-FAKE-998877',
      unitCost: 102.1,
      leadTimeDays: 28,
      warehouseCode: 'LON-3',
    },
    margin: 0.59,
    createdBy: 'ops@casa-lumen.fake',
    internalNotes: 'Firmware 2.4 pendiente. No filtrar a clientes.',
    seoTitle: 'Altavoz Lumen | Casa Lumen',
    seoKeywords: ['altavoz', 'bluetooth', 'diseño'],
    relatedIds: ['auriculares'],
    reviews: [
      review(
        'r3',
        'Elena R.',
        'elena.r@correo.fake',
        5,
        'Se ve y se oye',
        'Ocupa poco y llena el salón. El color piedra encaja con todo.',
      ),
    ],
  },
  {
    id: 'planta',
    sku: 'CL-PLN-003',
    name: 'Monstera de estudio',
    shortDescription: 'Decoración que respira.',
    description: lorem('Monstera en maceta de cerámica artesanal'),
    careInstructions: lorem('Riego y luz', 4),
    price: 39,
    compareAtPrice: 49,
    currency: 'EUR',
    image: '/images/planta.webp',
    gallery: ['/images/planta.webp'],
    category: 'botanica',
    tags: ['planta', 'interior', 'cerámica'],
    stock: 73,
    warehouse: 'BCN-INV',
    weightGrams: 2400,
    dimensionsCm: { w: 22, h: 55, d: 22 },
    supplier: {
      name: 'Viveros del Vallès',
      email: 'pedidos@viveros-valles.fake',
      phone: '+34 93 000 1122',
      taxId: 'ES-FAKE-B12345678',
      unitCost: 11.5,
      leadTimeDays: 4,
      warehouseCode: 'SBD-1',
    },
    margin: 0.7,
    createdBy: 'verde@casa-lumen.fake',
    internalNotes: 'Control de humedad en ruta. Dato interno.',
    seoTitle: 'Monstera de estudio | Casa Lumen',
    seoKeywords: ['planta', 'monstera', 'maceta'],
    relatedIds: ['jarron', 'manta'],
    reviews: [
      review(
        'r4',
        'Carla S.',
        'carla.s@correo.fake',
        5,
        'Llegó perfecta',
        'Hojas grandes y maceta preciosa. Un acierto.',
      ),
    ],
  },
  {
    id: 'lampara',
    sku: 'CL-LMP-004',
    name: 'Lámpara Arco',
    shortDescription: 'Luz cálida para noches largas.',
    description: lorem('Lámpara de arco con pantalla de lino y estructura de latón'),
    careInstructions: lorem('Bombilla LED incluida', 2),
    price: 320,
    compareAtPrice: 390,
    currency: 'EUR',
    image: '/images/lampara.webp',
    gallery: ['/images/lampara.webp'],
    category: 'iluminacion',
    tags: ['luz', 'latón', 'lino'],
    stock: 9,
    warehouse: 'MAD-2-C01',
    weightGrams: 6400,
    dimensionsCm: { w: 40, h: 180, d: 40 },
    supplier: {
      name: 'Latones del Sur',
      email: 'facturacion@latones.fake',
      phone: '+34 954 000 334',
      taxId: 'ES-FAKE-A99887766',
      unitCost: 148,
      leadTimeDays: 35,
      warehouseCode: 'SVQ-7',
    },
    margin: 0.54,
    createdBy: 'luz@casa-lumen.fake',
    internalNotes: 'Piezas a mano, no hay stock de seguridad.',
    seoTitle: 'Lámpara Arco | Casa Lumen',
    seoKeywords: ['lámpara', 'arco', 'latón'],
    relatedIds: ['silla', 'reloj'],
    reviews: [
      review(
        'r5',
        'Javier M.',
        'javier.m@correo.fake',
        4,
        'Imponente',
        'Ocupa su espacio. La luz es muy agradable para leer.',
      ),
    ],
  },
  {
    id: 'reloj',
    sku: 'CL-CLK-005',
    name: 'Reloj Pared Quiet',
    shortDescription: 'Puntualidad con carácter.',
    description: lorem('Reloj de pared de mecanismo silencioso y esfera de lino'),
    careInstructions: lorem('Pila AA', 2),
    price: 75,
    compareAtPrice: 95,
    currency: 'EUR',
    image: '/images/reloj.webp',
    gallery: ['/images/reloj.webp'],
    category: 'decoracion',
    tags: ['reloj', 'pared', 'silencioso'],
    stock: 31,
    warehouse: 'MAD-3-D09',
    weightGrams: 900,
    dimensionsCm: { w: 40, h: 40, d: 5 },
    supplier: {
      name: 'Quiet Time GmbH',
      email: 'b2b@quiettime.fake',
      phone: '+49 30 000 7788',
      taxId: 'DE-FAKE-123456789',
      unitCost: 22.8,
      leadTimeDays: 14,
      warehouseCode: 'BER-2',
    },
    margin: 0.7,
    createdBy: 'deco@casa-lumen.fake',
    internalNotes: 'Mecanismo importado. Margen alto.',
    seoTitle: 'Reloj Quiet | Casa Lumen',
    seoKeywords: ['reloj', 'pared', 'silencioso'],
    relatedIds: ['lampara'],
    reviews: [
      review(
        'r6',
        'Noa V.',
        'noa.v@correo.fake',
        5,
        'No se oye',
        'Por fin un reloj que no marca el segundo en la noche.',
      ),
    ],
  },
  {
    id: 'jarron',
    sku: 'CL-VAS-006',
    name: 'Jarrón Arena',
    shortDescription: 'Cerámica hecha a mano.',
    description: lorem('Jarrón de gres esmaltado en tono arena'),
    careInstructions: lorem('No apto para lavavajillas', 2),
    price: 58,
    compareAtPrice: 68,
    currency: 'EUR',
    image: '/images/jarron.webp',
    gallery: ['/images/jarron.webp'],
    category: 'decoracion',
    tags: ['cerámica', 'jarrón', 'artesanal'],
    stock: 24,
    warehouse: 'VAL-1',
    weightGrams: 1500,
    dimensionsCm: { w: 16, h: 32, d: 16 },
    supplier: {
      name: 'Taller Barro',
      email: 'hola@tallerbarro.fake',
      phone: '+34 96 000 2211',
      taxId: 'ES-FAKE-F11223344',
      unitCost: 19.9,
      leadTimeDays: 10,
      warehouseCode: 'VLC-ART',
    },
    margin: 0.66,
    createdBy: 'barro@casa-lumen.fake',
    internalNotes: 'Piezas únicas, fotos de catálogo genéricas.',
    seoTitle: 'Jarrón Arena | Casa Lumen',
    seoKeywords: ['jarrón', 'cerámica', 'gres'],
    relatedIds: ['planta'],
    reviews: [
      review(
        'r7',
        'Irene T.',
        'irene.t@correo.fake',
        5,
        'Cada uno es distinto',
        'El esmalte tiene unas vetas preciosas.',
      ),
    ],
  },
  {
    id: 'manta',
    sku: 'CL-BKT-007',
    name: 'Manta Lana Merino',
    shortDescription: 'Calor suave para el sofá.',
    description: lorem('Manta de lana merino teñida con tintes naturales'),
    careInstructions: lorem('Lavado en frío', 3),
    price: 120,
    compareAtPrice: 150,
    currency: 'EUR',
    image: '/images/manta.webp',
    gallery: ['/images/manta.webp'],
    category: 'textil',
    tags: ['lana', 'manta', 'sofá'],
    stock: 16,
    warehouse: 'MAD-TEX',
    weightGrams: 1100,
    dimensionsCm: { w: 130, h: 4, d: 180 },
    supplier: {
      name: 'Lana del Norte',
      email: 'ventas@lanadelnorte.fake',
      phone: '+34 984 000 5566',
      taxId: 'ES-FAKE-B77665544',
      unitCost: 44,
      leadTimeDays: 18,
      warehouseCode: 'OVD-1',
    },
    margin: 0.63,
    createdBy: 'textil@casa-lumen.fake',
    internalNotes: 'Color terracota: lote limitado.',
    seoTitle: 'Manta merino | Casa Lumen',
    seoKeywords: ['manta', 'lana', 'merino'],
    relatedIds: ['silla', 'planta'],
    reviews: [
      review(
        'r8',
        'Pablo D.',
        'pablo.d@correo.fake',
        4,
        'Muy caliente',
        'Para el invierno del piso es perfecta.',
      ),
    ],
  },
  {
    id: 'silla',
    sku: 'CL-CHR-008',
    name: 'Silla Roble',
    shortDescription: 'Comodidad con líneas limpias.',
    description: lorem('Silla de roble macizo y asiento tapizado en lino'),
    careInstructions: lorem('Aceite de madera una vez al año', 2),
    price: 210,
    compareAtPrice: 260,
    currency: 'EUR',
    image: '/images/silla.webp',
    gallery: ['/images/silla.webp'],
    category: 'mobiliario',
    tags: ['silla', 'roble', 'comedor'],
    stock: 11,
    warehouse: 'MAD-MUE',
    weightGrams: 8200,
    dimensionsCm: { w: 45, h: 82, d: 50 },
    supplier: {
      name: 'Taller Roble',
      email: 'taller@roble.fake',
      phone: '+34 91 000 7788',
      taxId: 'ES-FAKE-C33445566',
      unitCost: 96,
      leadTimeDays: 40,
      warehouseCode: 'TO-WOOD',
    },
    margin: 0.54,
    createdBy: 'mueble@casa-lumen.fake',
    internalNotes: 'Montaje en destino. Coste de transporte no incluido en ficha pública.',
    seoTitle: 'Silla Roble | Casa Lumen',
    seoKeywords: ['silla', 'roble', 'comedor'],
    relatedIds: ['lampara', 'manta'],
    reviews: [
      review(
        'r9',
        'Sofía L.',
        'sofia.l@correo.fake',
        5,
        'Sólida',
        'Se nota la madera. El asiento es cómodo de verdad.',
      ),
    ],
  },
];

export const categories = [
  {
    id: 'audio',
    name: 'Audio',
    managerEmail: 'audio.lead@casa-lumen.fake',
    annualBudget: 120000,
    productIds: ['auriculares', 'altavoz'],
  },
  {
    id: 'botanica',
    name: 'Botánica',
    managerEmail: 'verde@casa-lumen.fake',
    annualBudget: 18000,
    productIds: ['planta'],
  },
  {
    id: 'iluminacion',
    name: 'Iluminación',
    managerEmail: 'luz@casa-lumen.fake',
    annualBudget: 54000,
    productIds: ['lampara'],
  },
  {
    id: 'decoracion',
    name: 'Decoración',
    managerEmail: 'deco@casa-lumen.fake',
    annualBudget: 33000,
    productIds: ['reloj', 'jarron'],
  },
  {
    id: 'textil',
    name: 'Textil',
    managerEmail: 'textil@casa-lumen.fake',
    annualBudget: 27000,
    productIds: ['manta'],
  },
  {
    id: 'mobiliario',
    name: 'Mobiliario',
    managerEmail: 'mueble@casa-lumen.fake',
    annualBudget: 88000,
    productIds: ['silla'],
  },
];

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    `${p.name} ${p.shortDescription} ${p.description} ${p.tags.join(' ')}`
      .toLowerCase()
      .includes(q),
  );
}

export function allReviews(): Review[] {
  return products.flatMap((p) => p.reviews);
}
