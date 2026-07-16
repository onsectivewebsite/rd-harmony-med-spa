import { describe, it, expect } from 'vitest';
import { isOfferActive, effectivePrice, type OfferLike } from './pricing';

const base: OfferLike = {
  itemType: 'service', itemId: 'hydrafacial', offerPrice: '$99',
  originalPrice: '$249', badge: 'Sale', active: true, startsAt: null, endsAt: null,
};
const NOW = '2026-07-15T12:00:00.000Z';

describe('isOfferActive', () => {
  it('inactive flag → false', () => {
    expect(isOfferActive({ ...base, active: false }, NOW)).toBe(false);
  });
  it('not yet started → false', () => {
    expect(isOfferActive({ ...base, startsAt: '2026-08-01T00:00:00Z' }, NOW)).toBe(false);
  });
  it('expired → false', () => {
    expect(isOfferActive({ ...base, endsAt: '2026-07-01T00:00:00Z' }, NOW)).toBe(false);
  });
  it('open window + active → true', () => {
    expect(isOfferActive(base, NOW)).toBe(true);
  });
});

describe('effectivePrice', () => {
  it('no offer → base price, not on offer', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [], NOW);
    expect(r).toEqual({ price: '$249', onOffer: false });
  });
  it('active linked offer → offer price + original + badge', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [base], NOW);
    expect(r).toEqual({ price: '$99', originalPrice: '$249', onOffer: true, badge: 'Sale' });
  });
  it('offer for a different item is ignored', () => {
    const r = effectivePrice('service', 'microdermabrasion', '$199', [base], NOW);
    expect(r).toEqual({ price: '$199', onOffer: false });
  });
  it('inactive offer → base price', () => {
    const r = effectivePrice('service', 'hydrafacial', '$249', [{ ...base, active: false }], NOW);
    expect(r).toEqual({ price: '$249', onOffer: false });
  });
});
