export type OfferLike = {
  itemType: 'service' | 'product' | null;
  itemId: string | null;
  offerPrice: string;
  originalPrice?: string | null;
  badge?: string | null;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type PriceInfo = {
  price: string;
  originalPrice?: string;
  onOffer: boolean;
  badge?: string;
};

export function isOfferActive(offer: OfferLike, nowIso: string): boolean {
  if (!offer.active) return false;
  const now = Date.parse(nowIso);
  if (offer.startsAt && Date.parse(offer.startsAt) > now) return false;
  if (offer.endsAt && Date.parse(offer.endsAt) < now) return false;
  return true;
}

export function effectivePrice(
  itemType: 'service' | 'product',
  itemId: string,
  basePrice: string,
  offers: OfferLike[],
  nowIso: string,
): PriceInfo {
  const match = offers.find(
    o => o.itemType === itemType && o.itemId === itemId && isOfferActive(o, nowIso),
  );
  if (!match) return { price: basePrice, onOffer: false };
  return {
    price: match.offerPrice,
    originalPrice: match.originalPrice || basePrice,
    onOffer: true,
    ...(match.badge ? { badge: match.badge } : {}),
  };
}
