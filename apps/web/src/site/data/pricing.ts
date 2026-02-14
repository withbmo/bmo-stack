import type { PricingPlan } from '@/shared/types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'p1',
    name: 'TIER 01 // HACKER',
    price: '$0',
    period: '/mo',
    description: 'For experimental prototypes and side projects.',
    features: [
      '512MB RAM / 0.5 vCPU',
      'Public Repositories',
      'Community Support',
      '7-day Log Retention',
      '1 Region (US-East)',
    ],
    buttonText: 'START FREE',
  },
  {
    id: 'p2',
    name: 'TIER 02 // PRO',
    price: '$29',
    period: '/mo',
    description: 'For production-grade applications and scaling.',
    features: [
      '8GB RAM / 4 vCPU',
      'Private Repositories',
      'Priority Support',
      '30-day Log Retention',
      'Global Edge Network',
      'Zero-Cold-Start',
    ],
    recommended: true,
    buttonText: 'UPGRADE PRO',
  },
  {
    id: 'p3',
    name: 'TIER 03 // SCALER',
    price: '$199',
    period: '/mo',
    description: 'High-performance isolation for heavy workloads.',
    features: [
      '32GB RAM / 16 vCPU',
      'Dedicated Clusters',
      '24/7 SLA Support',
      'Unlimited Log Retention',
      'Custom VPC Peering',
      'SSO & Audit Logs',
    ],
    buttonText: 'CONTACT SALES',
  },
];
