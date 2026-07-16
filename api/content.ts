import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_db.js';
import { ensureContentSchema, type ServiceRow, type ProductRow, type OfferRow } from './_content.js';

function offerActive(o: OfferRow, now: number): boolean {
  if (!o.active) return false;
  if (o.starts_at && Date.parse(o.starts_at) > now) return false;
  if (o.ends_at && Date.parse(o.ends_at) < now) return false;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    await ensureContentSchema();
    const [services, products, offers] = await Promise.all([
      sql`SELECT * FROM services WHERE active = true ORDER BY sort_order, name` as unknown as Promise<ServiceRow[]>,
      sql`SELECT * FROM products WHERE active = true ORDER BY sort_order, name` as unknown as Promise<ProductRow[]>,
      sql`SELECT * FROM offers WHERE active = true` as unknown as Promise<OfferRow[]>,
    ]);
    const now = Date.now();
    const activeOffers = offers.filter(o => offerActive(o, now));
    const pricing = (type: 'service' | 'product', id: string, base: string | null) => {
      const m = activeOffers.find(o => o.item_type === type && o.item_id === id);
      if (!m) return { price: base || '', onOffer: false };
      return { price: m.offer_price, originalPrice: m.original_price || base || '', onOffer: true, badge: m.badge || undefined };
    };
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      success: true,
      services: services.map(s => ({ ...toCamelService(s), pricing: pricing('service', s.id, s.price) })),
      products: products.map(p => ({ ...toCamelProduct(p), pricing: pricing('product', p.id, p.price) })),
      offers: activeOffers.map(toCamelOffer),
    });
  } catch (err) {
    console.error('content error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load content.' });
  }
}

function toCamelService(s: ServiceRow) {
  return {
    id: s.id, name: s.name, category: s.category, price: s.price, duration: s.duration,
    image: s.image || undefined, heroTitle: s.hero_title || undefined, heroSubtitle: s.hero_subtitle || undefined,
    description: s.description || undefined, longDescription: s.long_description || undefined,
    benefits: s.benefits, idealFor: s.ideal_for, stepFlow: s.step_flow, postCare: s.post_care,
    faqs: s.faqs, options: s.options, technology: s.technology || undefined,
    results: s.results || undefined, downtime: s.downtime || undefined, frequency: s.frequency || undefined,
    recovery: s.recovery || undefined, isMobileAvailable: s.is_mobile_available,
    metaTitle: s.meta_title || undefined, metaDescription: s.meta_description || undefined,
    productsUsed: s.products_used || undefined,
    experience: s.experience || undefined,
    testimonials: s.testimonials,
    precautions: s.precautions,
    skinConcern: s.skin_concern,
  };
}
function toCamelProduct(p: ProductRow) {
  return { id: p.id, name: p.name, category: p.category || undefined, price: p.price || undefined, description: p.description || undefined, image: p.image || undefined };
}
function toCamelOffer(o: OfferRow) {
  return {
    id: o.id, serviceId: o.item_type === 'service' ? o.item_id || undefined : undefined,
    title: o.title, subtitle: o.subtitle || undefined, description: o.description || undefined,
    image: o.image || undefined, originalPrice: o.original_price || undefined,
    offerPrice: o.offer_price, badge: o.badge || undefined, highlights: o.highlights,
  };
}
