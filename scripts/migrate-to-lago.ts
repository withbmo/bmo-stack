/* eslint-disable no-console */
import axios from 'axios';

const LAGO_API_URL = process.env.LAGO_API_URL ?? 'http://localhost:3010';
const LAGO_API_KEY = process.env.LAGO_API_KEY ?? '';
const DRY_RUN = process.env.DRY_RUN === '1';

type PlanDefinition = {
  name: string;
  code: string;
};

type MetricDefinition = {
  name: string;
  code: string;
  aggregation_type: 'count_agg' | 'sum_agg';
  recurring: boolean;
};

const metrics: MetricDefinition[] = [
  { name: 'Projects', code: 'projects', aggregation_type: 'count_agg', recurring: true },
  { name: 'Environments', code: 'environments', aggregation_type: 'count_agg', recurring: true },
  {
    name: 'Deployments (Monthly)',
    code: 'deployments_monthly',
    aggregation_type: 'count_agg',
    recurring: false,
  },
  { name: 'Storage (GB)', code: 'storage_gb', aggregation_type: 'sum_agg', recurring: true },
];

const plans: PlanDefinition[] = [
  { name: 'Free Monthly', code: 'free_monthly' },
  { name: 'Pro Monthly', code: 'pro_monthly' },
  { name: 'Pro Yearly', code: 'pro_yearly' },
  { name: 'Enterprise Monthly', code: 'enterprise_monthly' },
  { name: 'Enterprise Yearly', code: 'enterprise_yearly' },
];

async function main() {
  if (!LAGO_API_KEY) {
    throw new Error('LAGO_API_KEY is required');
  }

  const client = axios.create({
    baseURL: `${LAGO_API_URL}/api/v1`,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${LAGO_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  console.log(`Lago bootstrap started (dry-run=${DRY_RUN ? 'yes' : 'no'})`);

  for (const metric of metrics) {
    if (DRY_RUN) {
      console.log(`[dry-run] create metric ${metric.code}`);
      continue;
    }

    await client.post('/billable_metrics', { billable_metric: metric });
    console.log(`created metric ${metric.code}`);
  }

  for (const plan of plans) {
    if (DRY_RUN) {
      console.log(`[dry-run] create plan ${plan.code}`);
      continue;
    }

    await client.post('/plans', {
      plan: {
        name: plan.name,
        code: plan.code,
        interval: plan.code.includes('yearly') ? 'yearly' : 'monthly',
        pay_in_advance: false,
      },
    });
    console.log(`created plan ${plan.code}`);
  }
}

void main().catch(error => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Lago bootstrap failed: ${message}`);
  process.exit(1);
});
