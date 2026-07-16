import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES, OFFERS, PRODUCTS } from '../constants';
import type { Service, Offer, Product } from '../types';
import type { PriceInfo } from '../lib/pricing';

type ApiService = Service & { pricing?: PriceInfo };
type ApiProduct = Product & { pricing?: PriceInfo };

type Ctx = {
  services: ApiService[];
  offers: Offer[];
  products: ApiProduct[];
  pricingFor: (type: 'service' | 'product', id: string, base: string) => PriceInfo;
  loading: boolean;
  source: 'api' | 'fallback';
};

const ContentCtx = createContext<Ctx | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Omit<Ctx, 'pricingFor'>>({
    services: SERVICES, offers: OFFERS, products: PRODUCTS, loading: true, source: 'fallback',
  });

  useEffect(() => {
    let alive = true;
    fetch('/api/content')
      .then(r => r.json())
      .then(d => {
        if (!alive || !d?.success) return;
        setState({ services: d.services, offers: d.offers, products: d.products, loading: false, source: 'api' });
      })
      .catch(() => { if (alive) setState(s => ({ ...s, loading: false })); });
    return () => { alive = false; };
  }, []);

  const pricingFor = (type: 'service' | 'product', id: string, base: string): PriceInfo => {
    const list = type === 'service' ? state.services : state.products;
    const found = (list as Array<ApiService | ApiProduct>).find(i => i.id === id);
    if (found && (found as ApiService).pricing) return (found as ApiService).pricing!;
    return { price: base, onOffer: false };
  };

  return <ContentCtx.Provider value={{ ...state, pricingFor }}>{children}</ContentCtx.Provider>;
};

export function useContent(): Ctx {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
