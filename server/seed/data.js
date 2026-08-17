// Mirrors client/src/data/products.js exactly, so the seeded DB lines up
// 1:1 with the mock data the frontend currently renders.
export const categoryNames = ['Outerwear', 'Shirts', 'Knitwear', 'Trousers', 'Dresses'];

export const products = [
  {
    name: 'Oversized Wool Coat',
    colour: 'Camel',
    price: 12400,
    compareAtPrice: null,
    category: 'Outerwear',
    image: '/products/oversized-wool-coat.webp',
    description:
      'A relaxed double-faced wool coat with dropped shoulders and a concealed placket. Cut long enough to layer over knitwear without crowding.',
    details: ['80% wool, 20% cashmere', 'Fully lined', 'Dry clean only', 'Made in India'],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 },
    ],
  },
  {
    name: 'Tailored Wool Trouser',
    colour: 'Charcoal',
    price: 4890,
    compareAtPrice: 6200,
    category: 'Trousers',
    image: '/products/tailored-wool-trouser.webp',
    description:
      'High-rise trouser in a mid-weight wool suiting, with a straight leg and a clean front. Falls without a break.',
    details: ['100% virgin wool', 'Hook-and-bar closure', 'Dry clean only'],
    sizes: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 4 },
    ],
  },
  {
    name: 'Cotton Poplin Shirt',
    colour: 'Optic White',
    price: 3200,
    compareAtPrice: null,
    category: 'Shirts',
    image: '/products/poplin-shirt.webp',
    description:
      'A crisp poplin shirt with a slightly extended collar and a boxy body. Sharp enough for work, loose enough for weekends.',
    details: ['100% organic cotton', 'Mother-of-pearl buttons', 'Machine wash cold'],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 6 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 5 },
    ],
  },
  {
    name: 'Merino Crew Knit',
    colour: 'Fog Grey',
    price: 5600,
    compareAtPrice: null,
    category: 'Knitwear',
    image: '/products/merino-crew-knit.webp',
    description:
      'Fine-gauge extra-fine merino in a straight crew neck. Light enough to wear under a jacket year round.',
    details: ['100% extra-fine merino', 'Ribbed cuffs and hem', 'Hand wash cold'],
    sizes: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
    ],
  },
  {
    name: 'Bias-Cut Slip Dress',
    colour: 'Ecru',
    price: 6750,
    compareAtPrice: 8900,
    category: 'Dresses',
    image: '/products/bias-cut-slip-dress.webp',
    description:
      'Cut on the bias so it moves with you, in a heavy sandwashed silk. Adjustable straps, midi length.',
    details: ['100% sandwashed silk', 'Adjustable straps', 'Dry clean only'],
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 2 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 1 },
    ],
  },
  {
    name: 'Boxy Denim Jacket',
    colour: 'Washed Indigo',
    price: 5900,
    compareAtPrice: null,
    category: 'Outerwear',
    image: '/products/boxy-denim-jacket.webp',
    description:
      'A squared-off denim jacket in rigid Japanese selvedge, washed once for softness. Fades with wear.',
    details: ['100% Japanese selvedge denim', 'Copper hardware', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 3 },
    ],
  },
];
