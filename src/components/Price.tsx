import React from 'react';
import type { PriceInfo } from '../lib/pricing';

export const Price: React.FC<{ info: PriceInfo; className?: string; showBadge?: boolean }> = ({ info, className, showBadge = true }) => {
  if (!info.onOffer) return <span className={className}>{info.price}</span>;
  return (
    <span className={className}>
      {info.originalPrice && <s className="text-spa-ink/40 mr-1.5">{info.originalPrice}</s>}
      <span className="text-emerald-600 font-semibold">{info.price}</span>
      {showBadge && info.badge && (
        <span className="ml-2 text-[9px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full">{info.badge}</span>
      )}
    </span>
  );
};
