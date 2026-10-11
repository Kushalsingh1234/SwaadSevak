export type GstTier = 'inclusive' | '5%' | '18%';

export interface GstCalculation {
  tier: GstTier;
  isInclusive: boolean;
  rate: number;
  cgstRate: number;
  sgstRate: number;
  label: string;
  tax: number;
  cgst: number;
  sgst: number;
  total: number;
}

export function parseGstTier(tier?: string | null): GstTier {
  if (!tier) return '5%';
  const t = tier.trim().toLowerCase();
  if (t === 'inclusive' || t === 'inclusive of taxes' || t === '0%' || t === '0') {
    return 'inclusive';
  }
  if (t === '18%' || t === '18') {
    return '18%';
  }
  return '5%';
}

export function calculateGst(subtotal: number, tier?: string | null): GstCalculation {
  const parsedTier = parseGstTier(tier);
  if (parsedTier === 'inclusive') {
    return {
      tier: 'inclusive',
      isInclusive: true,
      rate: 0,
      cgstRate: 0,
      sgstRate: 0,
      label: 'Inclusive of taxes',
      tax: 0,
      cgst: 0,
      sgst: 0,
      total: Math.round(subtotal * 100) / 100
    };
  }

  if (parsedTier === '18%') {
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const halfTax = Math.round((tax / 2) * 100) / 100;
    return {
      tier: '18%',
      isInclusive: false,
      rate: 0.18,
      cgstRate: 0.09,
      sgstRate: 0.09,
      label: '18% GST',
      tax,
      cgst: halfTax,
      sgst: Math.round((tax - halfTax) * 100) / 100,
      total: Math.round((subtotal + tax) * 100) / 100
    };
  }

  // 5% Default
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const halfTax = Math.round((tax / 2) * 100) / 100;
  return {
    tier: '5%',
    isInclusive: false,
    rate: 0.05,
    cgstRate: 0.025,
    sgstRate: 0.025,
    label: '5% GST',
    tax,
    cgst: halfTax,
    sgst: Math.round((tax - halfTax) * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100
  };
}
