/**
 * King's Kitchen — in-app data layer.
 * All catalog/order/notification access goes through here.
 * Pages never call the backend directly except for auth, realtime subscriptions,
 * and a couple of targeted reads.
 *
 * NOTE: DELIVERY_FEE is a flat stand-in. The ASP.NET API will supply real pricing.
 */

// ── In-memory data store ───────────────────────────────────────────────────────
// Provides simulated real-time data persistence and local state for King's Kitchen.

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toISOString();

// ── Seed data ──────────────────────────────────────────────────────────────────

const CATEGORIES_SEED = [
  {
    id: 'cat-1', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Kitchen Electronics', slug: 'kitchen-electronics', sort_order: 1,
    description: 'High-performance blenders, fryers, and countertop appliances built for real kitchen output.',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    id: 'cat-2', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Appliances', slug: 'appliances', sort_order: 2,
    description: 'Cookers, ovens, and refrigeration specified for demanding professional environments.',
    image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
  },
  {
    id: 'cat-3', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Cookware', slug: 'cookware', sort_order: 3,
    description: 'Professional-gauge pots, pans, and sets designed for even heat and long service life.',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80',
  },
  {
    id: 'cat-4', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Equipment', slug: 'equipment', sort_order: 4,
    description: 'Commercial-grade mixers, processors, and heavy-duty machinery for high-volume kitchens.',
    image_url: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80',
  },
  {
    id: 'cat-5', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Kitchen Wear', slug: 'kitchen-wear', sort_order: 5,
    description: 'Chef coats, aprons, and workwear built for the rigours of a professional kitchen.',
    image_url: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=80',
  },
  {
    id: 'cat-6', created_date: '2024-01-01T00:00:00Z', updated_date: '2024-01-01T00:00:00Z',
    name: 'Accessories', slug: 'accessories', sort_order: 6,
    description: 'Knives, boards, and precision tools that complete a serious kitchen setup.',
    image_url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
  },
];

const PRODUCTS_SEED = [
  {
    id: 'prod-1', created_date: '2024-02-01T00:00:00Z', updated_date: '2024-02-01T00:00:00Z',
    name: 'Vitapro Vortex 1500W Blender', brand: 'Vitapro',
    slug: 'vitapro-vortex-1500-blender', category_slug: 'kitchen-electronics',
    price: 1850, compare_at_price: 2150, stock: 14, featured: true, badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80',
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80',
    ],
    description: 'A 1,500-watt commercial-duty motor with a hardened steel blade system — built for daily high-volume blending, from hot soups to nut butters.',
    specs: [
      { label: 'Motor', value: '1,500 W' },
      { label: 'Jar', value: 'Borosilicate glass, 2.0 L' },
      { label: 'Speeds', value: '10 + pulse' },
      { label: 'Warranty', value: '2 years' },
      { label: 'Dimensions', value: '20 × 20 × 46 cm' },
    ],
    variations: [
      { name: 'Capacity', options: [{ label: '1.5 L', price_delta: 0, stock: 9 }, { label: '2.0 L', price_delta: 250, stock: 4 }] },
      { name: 'Colour', options: [{ label: 'Graphite', price_delta: 0, stock: 10 }, { label: 'Matte Black', price_delta: 0, stock: 3 }] },
    ],
  },
  {
    id: 'prod-2', created_date: '2024-02-02T00:00:00Z', updated_date: '2024-02-02T00:00:00Z',
    name: 'AirCrisp Pro 8L Air Fryer', brand: 'Nuova',
    slug: 'aircrisp-pro-8l-air-fryer', category_slug: 'kitchen-electronics',
    price: 1290, compare_at_price: null, stock: 14, featured: true, badge: null,
    images: ['https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80'],
    description: 'A precision 8-litre air fryer with rapid-air circulation that achieves deep-fry results at a fraction of the oil. Programmable with 12 presets and a digital display.',
    specs: [
      { label: 'Capacity', value: '8 litres' },
      { label: 'Power', value: '1,800 W' },
      { label: 'Temperature', value: '80°C – 200°C' },
      { label: 'Presets', value: '12 cooking programs' },
      { label: 'Warranty', value: '1 year' },
    ],
    variations: [
      { name: 'Colour', options: [{ label: 'Matte Black', price_delta: 0, stock: 8 }, { label: 'Stainless', price_delta: 150, stock: 6 }] },
    ],
  },
  {
    id: 'prod-3', created_date: '2024-02-03T00:00:00Z', updated_date: '2024-02-03T00:00:00Z',
    name: 'Sanelli 60cm 4-Burner Gas Cooker', brand: 'Sanelli',
    slug: 'sanelli-60cm-4-burner-gas-cooker', category_slug: 'appliances',
    price: 3450, compare_at_price: null, stock: 7, featured: true, badge: null,
    images: ['https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&q=80'],
    description: 'A 60cm freestanding gas cooker with cast-iron pan supports, four sealed burners, and an electric ignition. Oven capacity: 62 litres with grill function.',
    specs: [
      { label: 'Width', value: '60 cm' },
      { label: 'Burners', value: '4 sealed gas burners' },
      { label: 'Oven', value: '62 L, gas with electric grill' },
      { label: 'Ignition', value: 'Electronic auto-ignition' },
      { label: 'Warranty', value: '2 years' },
    ],
    variations: [],
  },
  {
    id: 'prod-4', created_date: '2024-02-04T00:00:00Z', updated_date: '2024-02-04T00:00:00Z',
    name: 'Nuova 25L Digital Microwave', brand: 'Nuova',
    slug: 'nuova-25l-digital-microwave', category_slug: 'kitchen-electronics',
    price: 950, compare_at_price: null, stock: 12, featured: false, badge: null,
    images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80'],
    description: 'A 25-litre digital microwave with 900W power, 10 power levels, a ceramic easy-clean interior, and 8 auto-cook programs covering daily kitchen tasks.',
    specs: [
      { label: 'Capacity', value: '25 litres' },
      { label: 'Power', value: '900 W' },
      { label: 'Levels', value: '10 power levels' },
      { label: 'Interior', value: 'Ceramic enamel, easy-clean' },
      { label: 'Warranty', value: '1 year' },
    ],
    variations: [],
  },
  {
    id: 'prod-5', created_date: '2024-02-05T00:00:00Z', updated_date: '2024-02-05T00:00:00Z',
    name: 'Sanelli 70L Built-in Electric Oven', brand: 'Sanelli',
    slug: 'sanelli-70l-builtin-electric-oven', category_slug: 'appliances',
    price: 4850, compare_at_price: 5400, stock: 5, featured: true, badge: 'New',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80'],
    description: 'A 70-litre built-in electric oven with nine cooking functions, a full-surface grill, steam injection, and a dual-glass door. Engineered for precise, even baking at commercial volumes.',
    specs: [
      { label: 'Capacity', value: '70 litres' },
      { label: 'Functions', value: '9 cooking modes' },
      { label: 'Max Temp', value: '250°C' },
      { label: 'Door', value: 'Double-glass cool-touch' },
      { label: 'Warranty', value: '2 years' },
    ],
    variations: [],
  },
  {
    id: 'prod-6', created_date: '2024-02-06T00:00:00Z', updated_date: '2024-02-06T00:00:00Z',
    name: 'Frigosan 240L Double-Door Refrigerator', brand: 'Frigosan',
    slug: 'frigosan-240l-double-door-refrigerator', category_slug: 'appliances',
    price: 6900, compare_at_price: null, stock: 6, featured: true, badge: null,
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80'],
    description: 'A 240-litre double-door refrigerator with a no-frost system, digital temperature control, a large crisper drawer, and a reversible door. Ideal for the serious home or professional cook.',
    specs: [
      { label: 'Capacity', value: '240 litres (180 fridge + 60 freezer)' },
      { label: 'System', value: 'No-frost, multi-flow' },
      { label: 'Noise', value: '39 dB' },
      { label: 'Energy', value: 'A+' },
      { label: 'Warranty', value: '2 years compressor' },
    ],
    variations: [],
  },
  {
    id: 'prod-7', created_date: '2024-02-07T00:00:00Z', updated_date: '2024-02-07T00:00:00Z',
    name: 'Meridian 5-Piece Stainless Cookware Set', brand: 'Meridian',
    slug: 'meridian-5-piece-stainless-cookware-set', category_slug: 'cookware',
    price: 1650, compare_at_price: null, stock: 9, featured: true, badge: null,
    images: ['https://images.unsplash.com/photo-1584990347449-a6d3f2e62e1d?w=800&q=80'],
    description: 'A five-piece professional stainless-steel cookware set with tri-ply construction, welded handles, and glass lids. Compatible with all hob types including induction.',
    specs: [
      { label: 'Material', value: '18/10 stainless steel, tri-ply' },
      { label: 'Pieces', value: '5 (16cm, 20cm, 24cm saucepans + 28cm fry pan + 24cm sauté)' },
      { label: 'Hob', value: 'All types including induction' },
      { label: 'Oven Safe', value: 'Yes, to 220°C' },
      { label: 'Warranty', value: 'Lifetime on materials' },
    ],
    variations: [],
  },
  {
    id: 'prod-8', created_date: '2024-02-08T00:00:00Z', updated_date: '2024-02-08T00:00:00Z',
    name: "Meridian 8-inch Chef Knife", brand: 'Meridian',
    slug: 'meridian-8-inch-chef-knife', category_slug: 'accessories',
    price: 420, compare_at_price: null, stock: 25, featured: false, badge: null,
    images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'],
    description: 'A full-tang 8-inch chef knife with a German high-carbon steel blade, 58 HRC hardness, and a riveted pakkawood handle. Balanced for precision work over long service sessions.',
    specs: [
      { label: 'Blade', value: '8 inches, German 1.4116 steel' },
      { label: 'Hardness', value: '58 ± 2 HRC' },
      { label: 'Handle', value: 'Triple-riveted pakkawood' },
      { label: 'Tang', value: 'Full tang' },
      { label: 'Warranty', value: 'Lifetime' },
    ],
    variations: [
      { name: 'Handle', options: [{ label: 'Pakkawood', price_delta: 0, stock: 15 }, { label: 'Black Polymer', price_delta: -40, stock: 10 }] },
    ],
  },
  {
    id: 'prod-9', created_date: '2024-02-09T00:00:00Z', updated_date: '2024-02-09T00:00:00Z',
    name: 'Vitapro 20L Commercial Planetary Mixer', brand: 'Vitapro',
    slug: 'vitapro-20l-commercial-planetary-mixer', category_slug: 'equipment',
    price: 12500, compare_at_price: null, stock: 3, featured: true, badge: 'Professional',
    images: ['https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80'],
    description: 'A 20-litre commercial planetary mixer with a 1.5kW direct-drive motor, variable 6-speed transmission, and a stainless-steel bowl. Supplied with dough hook, paddle, and whisk attachments.',
    specs: [
      { label: 'Bowl', value: '20 litres, stainless steel' },
      { label: 'Motor', value: '1.5 kW direct-drive' },
      { label: 'Speeds', value: '6 variable + pulse' },
      { label: 'Attachments', value: 'Dough hook, flat paddle, wire whisk' },
      { label: 'Warranty', value: '1 year parts + labour' },
    ],
    variations: [],
  },
  {
    id: 'prod-10', created_date: '2024-02-10T00:00:00Z', updated_date: '2024-02-10T00:00:00Z',
    name: 'Nuova Precision Sous Vide Circulator', brand: 'Nuova',
    slug: 'nuova-precision-sous-vide-circulator', category_slug: 'kitchen-electronics',
    price: 780, compare_at_price: null, stock: 14, featured: false, badge: null,
    images: ['https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80'],
    description: 'A clip-on sous vide immersion circulator with ±0.1°C temperature accuracy, 1,200W heating, and a 19-litre/minute pump. Compatible with any container up to 20 litres.',
    specs: [
      { label: 'Accuracy', value: '±0.1°C' },
      { label: 'Range', value: '5°C – 95°C' },
      { label: 'Power', value: '1,200 W' },
      { label: 'Flow', value: '19 L/min' },
      { label: 'Max Volume', value: '20 litres' },
    ],
    variations: [],
  },
  {
    id: 'prod-11', created_date: '2024-02-11T00:00:00Z', updated_date: '2024-02-11T00:00:00Z',
    name: 'Atelier Executive Chef Coat', brand: 'Atelier',
    slug: 'atelier-executive-chef-coat', category_slug: 'kitchen-wear',
    price: 220, compare_at_price: null, stock: 30, featured: false, badge: null,
    images: ['https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=80'],
    description: 'A double-breasted executive chef coat in 65/35 poly-cotton twill with stain-release finish, thermometer pocket, pen pocket, and brass stud buttons.',
    specs: [
      { label: 'Fabric', value: '65% polyester / 35% cotton twill' },
      { label: 'Finish', value: 'Stain-release treatment' },
      { label: 'Closure', value: 'Double-breasted, brass studs' },
      { label: 'Pockets', value: 'Thermometer, chest pen pocket' },
      { label: 'Care', value: '60°C machine wash' },
    ],
    variations: [
      { name: 'Size', options: [{ label: 'S', price_delta: 0, stock: 5 }, { label: 'M', price_delta: 0, stock: 8 }, { label: 'L', price_delta: 0, stock: 10 }, { label: 'XL', price_delta: 0, stock: 7 }] },
      { name: 'Colour', options: [{ label: 'White', price_delta: 0, stock: 18 }, { label: 'Black', price_delta: 0, stock: 12 }] },
    ],
  },
  {
    id: 'prod-12', created_date: '2024-02-12T00:00:00Z', updated_date: '2024-02-12T00:00:00Z',
    name: 'Atelier Waxed Canvas Pro Apron', brand: 'Atelier',
    slug: 'atelier-waxed-canvas-pro-apron', category_slug: 'kitchen-wear',
    price: 180, compare_at_price: null, stock: 18, featured: true, badge: null,
    images: ['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80'],
    description: 'A full-length waxed canvas pro apron with leather cross-back straps, a front tool pocket, and a towel loop. Water-resistant, heat-resistant, and built for daily kitchen use.',
    specs: [
      { label: 'Material', value: '14oz waxed canvas' },
      { label: 'Straps', value: 'Full-grain leather cross-back' },
      { label: 'Pockets', value: 'Full-width tool pocket, towel loop' },
      { label: 'Length', value: '90 cm (adjustable)' },
      { label: 'Care', value: 'Spot clean, re-wax annually' },
    ],
    variations: [
      { name: 'Colour', options: [{ label: 'Waxed Tan', price_delta: 0, stock: 10 }, { label: 'Waxed Charcoal', price_delta: 0, stock: 8 }] },
    ],
  },
];

// In-memory stores
let _categories = [...CATEGORIES_SEED];
let _products = [...PRODUCTS_SEED];
let _orders = [];
let _orderItems = [];
let _orderMessages = [];
let _notifications = [];
let _contactInquiries = [];

// ── Subscriptions ─────────────────────────────────────────────────────────────
const _listeners = {};
function _emit(entity, event) {
  (_listeners[entity] || []).forEach((fn) => fn(event));
}
export function subscribe(entity, fn) {
  if (!_listeners[entity]) _listeners[entity] = [];
  _listeners[entity].push(fn);
  return () => { _listeners[entity] = _listeners[entity].filter((f) => f !== fn); };
}

// ── Catalog ───────────────────────────────────────────────────────────────────
export const getCategories = async () => [..._categories].sort((a, b) => a.sort_order - b.sort_order);

export const filterProducts = (products, params = {}) => {
  const { q, category, brands, maxPrice, inStock, featured, sort } = params;
  let list = [...products];
  if (featured) list = list.filter((p) => p.featured);
  if (category) list = list.filter((p) => p.category_slug === category);
  if (brands?.length) list = list.filter((p) => brands.includes(p.brand));
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
  if (inStock) list = list.filter((p) => (p.stock ?? 0) > 0);
  if (q) {
    const lq = q.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.brand, p.category_slug, p.description].some((v) => v?.toLowerCase().includes(lq))
    );
  }
  switch (sort) {
    case 'price_asc': list.sort((a, b) => a.price - b.price); break;
    case 'price_desc': list.sort((a, b) => b.price - a.price); break;
    case 'newest': list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)); break;
    default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
  }
  return list;
};

export const getProducts = async (params = {}) => filterProducts([..._products], params);
export const getProductBySlug = async (slug) => _products.find((p) => p.slug === slug) || null;
export const getProduct = async (id) => _products.find((p) => p.id === id) || null;

export const createProduct = async (data) => {
  const p = { id: generateId(), created_date: now(), updated_date: now(), ...data };
  _products.unshift(p);
  return p;
};
export const updateProduct = async (id, data) => {
  const idx = _products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Product not found');
  _products[idx] = { ..._products[idx], ...data, updated_date: now() };
  return _products[idx];
};
export const deleteProduct = async (id) => { _products = _products.filter((p) => p.id !== id); };

export const createCategory = async (data) => {
  const c = { id: generateId(), created_date: now(), updated_date: now(), ...data };
  _categories.push(c);
  return c;
};
export const updateCategory = async (id, data) => {
  const idx = _categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Category not found');
  _categories[idx] = { ..._categories[idx], ...data, updated_date: now() };
  return _categories[idx];
};

// ── Orders ─────────────────────────────────────────────────────────────────────
export const DELIVERY_FEE = 40; // flat stand-in; ASP.NET API will supply real pricing

const makeOrderNumber = () => `KK-${Date.now().toString().slice(-6)}`;

export const createOrderWithItems = async ({ customer, items, shipping_fee, processing_fee = 0, created_by_id }) => {
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const order = {
    id: generateId(),
    created_date: now(),
    updated_date: now(),
    created_by_id: created_by_id || 'guest',
    order_number: makeOrderNumber(),
    ...customer,
    subtotal,
    processing_fee,
    shipping_fee,
    total: subtotal + shipping_fee + processing_fee,
    order_status: 'pending_payment',
    payment_status: 'pending',
    delivery_status: 'not_started',
    tracking: [{ stage: 'order_placed', timestamp: now(), note: 'Order received' }],
  };
  _orders.unshift(order);

  if (items.length) {
    const orderItems = items.map((i) => ({
      id: generateId(), created_date: now(), updated_date: now(),
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.name,
      brand: i.brand,
      variation: i.variation || '',
      unit_price: i.unit_price,
      quantity: i.quantity,
      image_url: i.image || '',
    }));
    _orderItems.push(...orderItems);
  }
  return order;
};

export const getOrders = async () => [..._orders].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
export const getOrder = async (id) => _orders.find((o) => o.id === id) || null;
export const updateOrder = async (id, data) => {
  const idx = _orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Order not found');
  _orders[idx] = { ..._orders[idx], ...data, updated_date: now() };
  _emit('Order', { type: 'update', data: _orders[idx] });
  return _orders[idx];
};
export const getOrderItems = async (order_id) =>
  [..._orderItems.filter((i) => i.order_id === order_id)].sort((a, b) =>
    a.product_name.localeCompare(b.product_name)
  );

// ── Messages ───────────────────────────────────────────────────────────────────
export const getMessages = async (order_id) =>
  [..._orderMessages.filter((m) => m.order_id === order_id)].sort(
    (a, b) => new Date(a.created_date) - new Date(b.created_date)
  );
export const sendMessage = async (data) => {
  const msg = { id: generateId(), created_date: now(), updated_date: now(), ...data };
  _orderMessages.push(msg);
  _emit('OrderMessage', { type: 'create', data: msg });
  return msg;
};

// ── Notifications ──────────────────────────────────────────────────────────────
export const getNotifications = async () =>
  [..._notifications].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 20);
export const createNotification = async (data) => {
  const n = { id: generateId(), created_date: now(), updated_date: now(), read: false, ...data };
  _notifications.unshift(n);
  _emit('Notification', { type: 'create', data: n });
  return n;
};
export const deleteNotification = async (id) => { _notifications = _notifications.filter((n) => n.id !== id); };
export const markAllRead = async (ids) => {
  ids.forEach((id) => {
    const idx = _notifications.findIndex((n) => n.id === id);
    if (idx !== -1) _notifications[idx] = { ..._notifications[idx], read: true };
  });
};

// ── Contact inquiries ──────────────────────────────────────────────────────────
export const createContactInquiry = async (data) => {
  const inquiry = { id: generateId(), created_date: now(), updated_date: now(), ...data };
  _contactInquiries.push(inquiry);
  return inquiry;
};
