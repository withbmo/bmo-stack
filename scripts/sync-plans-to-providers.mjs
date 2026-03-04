#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = process.cwd();
const plansDir = path.join(cwd, 'packages', 'config', 'src', 'plans');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const syncStripe = args.has('--stripe') || args.size === 0;
const syncOrb = args.has('--orb') || args.size === 0;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getPlans() {
  const files = fs
    .readdirSync(plansDir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  return files.map((f) => readJson(path.join(plansDir, f)));
}

function toStripeInterval(interval) {
  return interval === 'year' ? 'year' : 'month';
}

function toOrbInterval(interval) {
  return interval === 'year' ? 'annual' : 'monthly';
}

function buildPlanVariants(plans) {
  const variants = [];
  for (const plan of plans) {
    const monthly = plan?.billing?.monthly ?? null;
    const yearly = plan?.billing?.yearly ?? null;
    if (!monthly || !yearly) {
      throw new Error(`Plan ${plan.id} is missing billing.monthly/yearly variant config.`);
    }
    variants.push({
      planId: plan.id,
      planVersion: Number(plan.version ?? 1),
      planCode: String(monthly.code),
      interval: 'month',
      priceUsd: Number(monthly.price ?? 0),
      displayName: plan.displayName,
      description: plan.description ?? '',
      features: plan.features ?? [],
    });
    variants.push({
      planId: plan.id,
      planVersion: Number(plan.version ?? 1),
      planCode: String(yearly.code),
      interval: 'year',
      priceUsd: Number(yearly.price ?? 0),
      displayName: plan.displayName,
      description: plan.description ?? '',
      features: plan.features ?? [],
    });
  }
  return variants;
}

async function stripeRequest(method, endpoint, form, secret) {
  const body = new URLSearchParams();
  if (form) {
    for (const [key, value] of Object.entries(form)) {
      if (value === undefined || value === null) continue;
      body.append(key, String(value));
    }
  }
  const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'GET' ? undefined : body,
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`Stripe ${method} ${endpoint} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function ensureStripePlan(variant, stripeSecret) {
  if (variant.priceUsd <= 0) {
    console.log(`stripe skip free plan ${variant.planCode}`);
    return;
  }

  const products = await stripeRequest(
    'GET',
    `/products?limit=100&active=true&metadata[plan_code]=${encodeURIComponent(variant.planCode)}`,
    null,
    stripeSecret
  );
  let product = (products.data ?? [])[0] ?? null;

  if (!product) {
    const payload = {
      name: `${variant.displayName} (${variant.interval === 'year' ? 'Yearly' : 'Monthly'})`,
      description: variant.description,
      'metadata[plan_code]': variant.planCode,
      'metadata[plan_id]': variant.planId,
      'metadata[plan_catalog_version]': variant.planVersion,
      'metadata[billing_interval]': variant.interval,
    };
    if (dryRun) {
      console.log(`stripe dry-run create product ${variant.planCode}`);
      product = { id: `dry_${variant.planCode}` };
    } else {
      product = await stripeRequest('POST', '/products', payload, stripeSecret);
      console.log(`stripe created product ${variant.planCode}: ${product.id}`);
    }
  }

  const prices = dryRun
    ? { data: [] }
    : await stripeRequest('GET', `/prices?product=${encodeURIComponent(product.id)}&active=true&limit=100`, null, stripeSecret);

  const unitAmount = Math.round(variant.priceUsd * 100);
  const existing = (prices.data ?? []).find((p) => {
    return (
      p.currency === 'usd' &&
      p.lookup_key === variant.planCode &&
      p.recurring &&
      p.recurring.interval === toStripeInterval(variant.interval) &&
      p.unit_amount === unitAmount
    );
  });
  if (existing) {
    console.log(`stripe ok price ${variant.planCode}: ${existing.id}`);
    return;
  }

  const createPayload = {
    product: product.id,
    currency: 'usd',
    unit_amount: unitAmount,
    lookup_key: variant.planCode,
    transfer_lookup_key: 'true',
    'recurring[interval]': toStripeInterval(variant.interval),
    'metadata[plan_code]': variant.planCode,
    'metadata[plan_id]': variant.planId,
    'metadata[plan_catalog_version]': variant.planVersion,
    'metadata[billing_interval]': variant.interval,
  };

  if (dryRun) {
    console.log(`stripe dry-run create price ${variant.planCode} ${unitAmount} cents`);
    return;
  }
  const price = await stripeRequest('POST', '/prices', createPayload, stripeSecret);
  console.log(`stripe created price ${variant.planCode}: ${price.id}`);
}

async function orbRequest(method, endpoint, payload, orbKey) {
  const response = await fetch(`https://api.withorb.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${orbKey}`,
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (response.status === 404) return { notFound: true };
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Orb ${method} ${endpoint} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

function limitsFromFeatures(features) {
  const limits = {};
  for (const f of features) {
    if (typeof f?.value === 'number' && Number.isFinite(f.value)) {
      limits[f.id] = Math.floor(f.value);
    }
  }
  return limits;
}

async function ensureOrbPlan(variant, orbKey) {
  const limits = limitsFromFeatures(variant.features);
  const metadata = {
    limits_json: JSON.stringify(limits),
    source: 'plans-json',
    plan_catalog_version: String(variant.planVersion),
    source_hash: crypto
      .createHash('sha256')
      .update(JSON.stringify({ limits, priceUsd: variant.priceUsd, interval: variant.interval }))
      .digest('hex'),
  };

  const existing = await orbRequest(
    'GET',
    `/plans/external_plan_id/${encodeURIComponent(variant.planCode)}`,
    null,
    orbKey
  );
  if (!existing.notFound) {
    console.log(`orb ok plan ${variant.planCode} (exists; metadata update is manual-safe)`);
    return;
  }

  const payload = {
    external_plan_id: variant.planCode,
    name: `${variant.displayName} (${variant.interval === 'year' ? 'Yearly' : 'Monthly'})`,
    currency: 'USD',
    billing_cycle_configuration: {
      duration: 1,
      duration_unit: toOrbInterval(variant.interval),
    },
    metadata,
  };

  if (dryRun) {
    console.log(`orb dry-run create plan ${variant.planCode}`);
    return;
  }
  await orbRequest('POST', '/plans', payload, orbKey);
  console.log(`orb created plan ${variant.planCode}`);
}

async function main() {
  const plans = getPlans();
  const variants = buildPlanVariants(plans);

  if (syncStripe) {
    const stripeSecret = (process.env.STRIPE_SECRET_KEY ?? '').trim();
    if (!stripeSecret) {
      throw new Error('STRIPE_SECRET_KEY is required for Stripe sync.');
    }
    console.log(`sync stripe start (${dryRun ? 'dry-run' : 'apply'})`);
    for (const variant of variants) {
      await ensureStripePlan(variant, stripeSecret);
    }
  }

  if (syncOrb) {
    const orbKey = (process.env.ORB_API_KEY ?? '').trim();
    if (!orbKey) {
      throw new Error('ORB_API_KEY is required for Orb sync.');
    }
    console.log(`sync orb start (${dryRun ? 'dry-run' : 'apply'})`);
    for (const variant of variants) {
      await ensureOrbPlan(variant, orbKey);
    }
  }

  console.log('sync complete');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
