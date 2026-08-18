// Mirrors client/src/data/products.js exactly, so the seeded DB lines up
// 1:1 with the mock data the frontend currently renders.
export const categoryNames = ['Outerwear', 'Shirts', 'Knitwear', 'Trousers', 'Dresses'];

export const products = [
  // ── OUTERWEAR ──────────────────────────────────────────────
  {
    name: 'Oversized Wool Coat',
    colour: 'Charcoal',
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
  {
    name: 'Relaxed Mac Coat',
    colour: 'Stone',
    price: 9800,
    compareAtPrice: null,
    category: 'Outerwear',
    image: '/products/relaxed-mac-coat.webp',
    description:
      'A cotton-blend mac with a dropped shoulder and storm flap, cut for layering. Water-resistant finish without the stiffness of a technical shell.',
    details: ['70% cotton, 30% nylon', 'Water-resistant finish', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 2 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 4 },
    ],
  },
  {
    name: 'Cropped Wool Jacket',
    colour: 'Charcoal',
    price: 7400,
    compareAtPrice: 8900,
    category: 'Outerwear',
    image: '/products/cropped-wool-jacket.webp',
    description:
      'A cropped, boxy wool jacket that sits at the hip. Works over a shirt or straight into knitwear once the weather turns.',
    details: ['90% wool, 10% nylon', 'Half lined', 'Dry clean only'],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 0 },
    ],
  },
  {
    name: 'Cotton Overshirt',
    colour: 'Olive',
    price: 4200,
    compareAtPrice: null,
    category: 'Outerwear',
    image: '/products/cotton-overshirt.webp',
    description:
      'A heavyweight cotton overshirt built to sit between a shirt and a jacket. Two chest pockets, a full button placket, a straight hem.',
    details: ['100% heavyweight cotton', 'Corozo buttons', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 },
    ],
  },

  // ── SHIRTS ─────────────────────────────────────────────────
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
    name: 'Relaxed Oxford Shirt',
    colour: 'Sky Blue',
    price: 3600,
    compareAtPrice: null,
    category: 'Shirts',
    image: '/products/relaxed-oxford-shirt.webp',
    description:
      'A brushed oxford cloth shirt with a soft button-down collar and a relaxed, slightly dropped shoulder. Softens with every wash.',
    details: ['100% brushed cotton oxford', 'Button-down collar', 'Machine wash cold'],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 4 },
    ],
  },
  {
    name: 'Linen Camp Shirt',
    colour: 'Sand',
    price: 3900,
    compareAtPrice: 4800,
    category: 'Shirts',
    image: '/products/linen-camp-shirt.webp',
    description:
      'A boxy camp-collar shirt in washed linen, cut for warm weather. Worn open over a tee or buttoned to the top.',
    details: ['100% washed linen', 'Camp collar', 'Machine wash cold, line dry'],
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 4 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 },
    ],
  },
  {
    name: 'Brushed Cotton Shirt',
    colour: 'Ecru',
    price: 3400,
    compareAtPrice: null,
    category: 'Shirts',
    image: '/products/brushed-cotton-shirt.webp',
    description:
      'A brushed cotton flannel shirt with a soft hand and a substantial weight. Reads more like a light overshirt than a dress shirt.',
    details: ['100% brushed cotton flannel', 'Single chest pocket', 'Machine wash cold'],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 5 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 4 },
    ],
  },
  {
    name: 'Band Collar Shirt',
    colour: 'Optic White',
    price: 3100,
    compareAtPrice: null,
    category: 'Shirts',
    image: '/products/band-collar-shirt.webp',
    description:
      'A collarless poplin shirt with a clean band neckline. Minimal enough to layer under a coat without adding bulk.',
    details: ['100% cotton poplin', 'Band collar', 'Machine wash cold'],
    sizes: [
      { size: 'XS', stock: 0 },
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
    ],
  },

  // ── KNITWEAR ───────────────────────────────────────────────
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
    name: 'Ribbed Wool Sweater',
    colour: 'Camel',
    price: 6200,
    compareAtPrice: null,
    category: 'Knitwear',
    image: '/products/ribbed-wool-sweater.webp',
    description:
      'A fully fashioned rib-knit sweater in lambswool, with a close, body-skimming fit. Holds its shape wash after wash.',
    details: ['100% lambswool', 'Fully fashioned knit', 'Hand wash cold'],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 2 },
    ],
  },
  {
    name: 'Cotton Knit Polo',
    colour: 'Ecru',
    price: 4400,
    compareAtPrice: null,
    category: 'Knitwear',
    image: '/products/cotton-knit-polo.webp',
    description:
      'A pique-knit polo with a two-button placket and a slightly boxy body. Reads dressier than jersey, still easy.',
    details: ['100% cotton pique', 'Two-button placket', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 7 },
      { size: 'L', stock: 4 },
    ],
  },
  {
    name: 'Fine Gauge Cardigan',
    colour: 'Mocha',
    price: 6900,
    compareAtPrice: 8200,
    category: 'Knitwear',
    image: '/products/fine-gauge-cardigan.webp',
    description:
      'A fine-gauge cardigan with horn buttons and a close rib at the cuff and hem. Sits well layered over a shirt.',
    details: ['90% merino, 10% cashmere', 'Horn buttons', 'Hand wash cold'],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 1 },
    ],
  },
  {
    name: 'Wool Mock Neck',
    colour: 'Fog Grey',
    price: 5800,
    compareAtPrice: null,
    category: 'Knitwear',
    image: '/products/wool-mock-neck.webp',
    description:
      'A close-fitting mock neck in fine merino, built to sit smoothly under a coat or jacket without adding bulk at the collar.',
    details: ['100% merino wool', 'Mock neck', 'Hand wash cold'],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 3 },
    ],
  },

  // ── TROUSERS ───────────────────────────────────────────────
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
    name: 'Relaxed Pleated Trouser',
    colour: 'Stone',
    price: 4600,
    compareAtPrice: null,
    category: 'Trousers',
    image: '/products/relaxed-pleated-trouser.webp',
    description:
      'A double-pleated trouser with a relaxed leg and a soft drape. Cut with room through the thigh, tapering gently to the hem.',
    details: ['100% cotton twill', 'Double front pleat', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 3 },
    ],
  },
  {
    name: 'Wide-Leg Cotton Trouser',
    colour: 'Ecru',
    price: 4100,
    compareAtPrice: null,
    category: 'Trousers',
    image: '/products/wide-leg-cotton-trouser.webp',
    description:
      'A wide-leg trouser in heavy cotton drill, with a high rise and a clean waistband. Moves easily, holds its line.',
    details: ['100% cotton drill', 'Side seam pockets', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 },
    ],
  },
  {
    name: 'Straight Denim',
    colour: 'Washed Indigo',
    price: 4800,
    compareAtPrice: 5900,
    category: 'Trousers',
    image: '/products/straight-denim.webp',
    description:
      'A straight-leg jean in rigid selvedge denim, washed once for a broken-in feel from the first wear.',
    details: ['100% selvedge denim', 'Copper rivets', 'Machine wash cold'],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 9 },
      { size: 'L', stock: 5 },
    ],
  },
  {
    name: 'Linen Trouser',
    colour: 'Sand',
    price: 4300,
    compareAtPrice: null,
    category: 'Trousers',
    image: '/products/linen-trouser.webp',
    description:
      'A relaxed linen trouser with a drawstring waist and a tapered leg. Built for warm weather, packs flat for travel.',
    details: ['100% linen', 'Drawstring waist', 'Machine wash cold, line dry'],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 4 },
    ],
  },

  // ── DRESSES ────────────────────────────────────────────────
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
    name: 'Relaxed Midi Dress',
    colour: 'Espresso',
    price: 7200,
    compareAtPrice: null,
    category: 'Dresses',
    image: '/products/relaxed-midi-dress.webp',
    description:
      'A relaxed, unlined midi dress with a dropped shoulder and side seam pockets. Falls straight from the shoulder without clinging.',
    details: ['100% viscose crepe', 'Side seam pockets', 'Machine wash cold'],
    sizes: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 4 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 },
    ],
  },
  {
    name: 'Linen Shirt Dress',
    colour: 'Sand',
    price: 6400,
    compareAtPrice: null,
    category: 'Dresses',
    image: '/products/linen-shirt-dress.webp',
    description:
      'A shirt dress in washed linen with a full button placket and a self-tie waist. Works belted or left open over trousers.',
    details: ['100% washed linen', 'Self-tie waist', 'Machine wash cold, line dry'],
    sizes: [
      { size: 'XS', stock: 2 },
      { size: 'S', stock: 3 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 2 },
    ],
  },
  {
    name: 'Ribbed Knit Dress',
    colour: 'Fog Grey',
    price: 5900,
    compareAtPrice: 7400,
    category: 'Dresses',
    image: '/products/ribbed-knit-dress.webp',
    description:
      'A close, rib-knit midi dress in fine merino. Simple enough to wear on its own or layered under a coat.',
    details: ['95% merino, 5% elastane', 'Rib knit', 'Hand wash cold'],
    sizes: [
      { size: 'XS', stock: 1 },
      { size: 'S', stock: 3 },
      { size: 'M', stock: 3 },
      { size: 'L', stock: 1 },
    ],
  },
  {
    name: 'Pleated Midi Dress',
    colour: 'Taupe',
    price: 6800,
    compareAtPrice: null,
    category: 'Dresses',
    image: '/products/pleated-midi-dress.webp',
    description:
      'A fully pleated midi dress in a lightweight satin-back crepe, with a fitted bodice and a full, movement-friendly skirt.',
    details: ['100% satin-back crepe', 'Fully pleated skirt', 'Dry clean only'],
    sizes: [
      { size: 'XS', stock: 0 },
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
    ],
  },
];
