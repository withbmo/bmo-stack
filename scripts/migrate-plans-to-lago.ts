/**
 * Migration Script: Move Plan Configurations to Lago
 *
 * This script migrates plan definitions from local JSON files to Lago's billing platform.
 * It creates billable metrics and plans in Lago, enabling dynamic plan management without deployments.
 *
 * Usage:
 *   ts-node scripts/migrate-plans-to-lago.ts [--dry-run] [--environment=staging|production]
 *
 * Options:
 *   --dry-run: Preview changes without actually creating resources in Lago
 *   --environment: Target environment (default: staging)
 */

import { ConfigService } from '@nestjs/config';
import { getPlans, type Plan } from '@pytholit/config';
import axios, { type AxiosInstance } from 'axios';

// Configuration
const LAGO_API_URL = process.env.LAGO_API_URL || 'http://localhost:3000';
const LAGO_API_KEY = process.env.LAGO_API_KEY || '';
const LAGO_ORGANIZATION_ID = process.env.LAGO_ORGANIZATION_ID || '';
const DRY_RUN = process.argv.includes('--dry-run');
const ENVIRONMENT = process.argv.find(arg => arg.startsWith('--environment='))?.split('=')[1] || 'staging';

console.log('🚀 Lago Plan Migration Tool');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Environment: ${ENVIRONMENT}`);
console.log(`Lago API URL: ${LAGO_API_URL}`);
console.log(`Dry Run: ${DRY_RUN ? 'Yes (no changes will be made)' : 'No (will create resources)'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!LAGO_API_KEY) {
  console.error('❌ Error: LAGO_API_KEY environment variable is required');
  process.exit(1);
}

// Create Lago API client
const lagoClient: AxiosInstance = axios.create({
  baseURL: `${LAGO_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${LAGO_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Feature to billable metric mapping
const FEATURE_TO_METRIC_MAP: Record<string, { aggregationType: string; fieldName?: string }> = {
  projects: { aggregationType: 'count_agg' },
  environments: { aggregationType: 'count_agg' },
  deployments: { aggregationType: 'count_agg' },
  storage: { aggregationType: 'sum_agg', fieldName: 'amount' },
  env_max_vcpu: { aggregationType: 'max_agg', fieldName: 'value' },
  env_max_ram_gb: { aggregationType: 'max_agg', fieldName: 'value' },
  env_max_disk_gb: { aggregationType: 'max_agg', fieldName: 'value' },
};

interface MigrationStats {
  metricsCreated: number;
  metricsSkipped: number;
  plansCreated: number;
  plansSkipped: number;
  errors: string[];
}

const stats: MigrationStats = {
  metricsCreated: 0,
  metricsSkipped: 0,
  plansCreated: 0,
  plansSkipped: 0,
  errors: [],
};

/**
 * Create a billable metric in Lago
 */
async function createBillableMetric(featureId: string, featureName: string): Promise<boolean> {
  const metricConfig = FEATURE_TO_METRIC_MAP[featureId];

  if (!metricConfig) {
    console.log(`  ⚠️  Skipping feature "${featureId}" (not a metered feature)`);
    stats.metricsSkipped++;
    return false;
  }

  const metricCode = featureId;
  const metricData = {
    billable_metric: {
      code: metricCode,
      name: featureName,
      description: `Tracks ${featureName.toLowerCase()} usage`,
      aggregation_type: metricConfig.aggregationType,
      recurring: false,
      field_name: metricConfig.fieldName,
    },
  };

  console.log(`  📊 Creating billable metric: ${metricCode} (${metricConfig.aggregationType})`);

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create:`, JSON.stringify(metricData, null, 2));
    stats.metricsCreated++;
    return true;
  }

  try {
    // Check if metric already exists
    try {
      await lagoClient.get(`/billable_metrics/${metricCode}`);
      console.log(`  ✓ Metric already exists: ${metricCode}`);
      stats.metricsSkipped++;
      return true;
    } catch (error: any) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Metric doesn't exist, create it
    }

    await lagoClient.post('/billable_metrics', metricData);
    console.log(`  ✅ Created billable metric: ${metricCode}`);
    stats.metricsCreated++;
    return true;
  } catch (error: any) {
    const errorMsg = `Failed to create metric ${metricCode}: ${error.message}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
    return false;
  }
}

/**
 * Create a plan in Lago
 */
async function createPlan(plan: Plan, interval: 'monthly' | 'yearly'): Promise<boolean> {
  const planCode = `${plan.id}_${interval}`;
  const planPrice = interval === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  // Build charges for metered features
  const charges = plan.features
    .filter(feature => FEATURE_TO_METRIC_MAP[feature.id])
    .map(feature => ({
      billable_metric_code: feature.id,
      charge_model: 'package' as const,
      properties: {
        amount: '0', // Free usage within limit
        package_size: 1,
        max_units: feature.value === 'unlimited' ? null : (typeof feature.value === 'number' ? feature.value : null),
        free_units: 0,
      },
    }));

  const planData = {
    plan: {
      code: planCode,
      name: `${plan.displayName} (${interval === 'monthly' ? 'Monthly' : 'Yearly'})`,
      description: plan.description || `${plan.displayName} plan - ${interval} billing`,
      interval,
      amount_cents: Math.round(planPrice * 100),
      amount_currency: 'USD',
      pay_in_advance: true,
      charges,
    },
  };

  console.log(`\n  💰 Creating plan: ${planCode}`);
  console.log(`     Price: $${planPrice}/${interval}`);
  console.log(`     Charges: ${charges.length} metered features`);

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create:`, JSON.stringify(planData, null, 2));
    stats.plansCreated++;
    return true;
  }

  try {
    // Check if plan already exists
    try {
      await lagoClient.get(`/plans/${planCode}`);
      console.log(`  ✓ Plan already exists: ${planCode}`);
      stats.plansSkipped++;
      return true;
    } catch (error: any) {
      if (error.response?.status !== 404) {
        throw error;
      }
      // Plan doesn't exist, create it
    }

    await lagoClient.post('/plans', planData);
    console.log(`  ✅ Created plan: ${planCode}`);
    stats.plansCreated++;
    return true;
  } catch (error: any) {
    const errorMsg = `Failed to create plan ${planCode}: ${error.message}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    // Get all plans from config
    const plans = getPlans();
    console.log(`📋 Found ${plans.length} plans to migrate\n`);

    // Step 1: Create billable metrics
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 1: Creating Billable Metrics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Collect all unique features across all plans
    const allFeatures = new Map<string, string>();
    for (const plan of plans) {
      for (const feature of plan.features) {
        if (!allFeatures.has(feature.id)) {
          allFeatures.set(feature.id, feature.name);
        }
      }
    }

    console.log(`Found ${allFeatures.size} unique features\n`);

    for (const [featureId, featureName] of allFeatures) {
      await createBillableMetric(featureId, featureName);
    }

    // Step 2: Create plans
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 2: Creating Plans');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const plan of plans) {
      console.log(`\n📦 Plan: ${plan.displayName} (${plan.id})`);

      // Create monthly plan
      if (plan.monthlyPrice !== null && plan.monthlyPrice !== undefined) {
        await createPlan(plan, 'monthly');
      } else {
        console.log(`  ⚠️  Skipping monthly plan (no monthly price defined)`);
      }

      // Create yearly plan
      if (plan.yearlyPrice !== null && plan.yearlyPrice !== undefined) {
        await createPlan(plan, 'yearly');
      } else {
        console.log(`  ⚠️  Skipping yearly plan (no yearly price defined)`);
      }
    }

    // Print summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Migration Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📊 Billable Metrics:`);
    console.log(`   Created: ${stats.metricsCreated}`);
    console.log(`   Skipped (already exist): ${stats.metricsSkipped}`);
    console.log(`\n💰 Plans:`);
    console.log(`   Created: ${stats.plansCreated}`);
    console.log(`   Skipped (already exist): ${stats.plansSkipped}`);

    if (stats.errors.length > 0) {
      console.log(`\n❌ Errors (${stats.errors.length}):`);
      stats.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (DRY_RUN) {
      console.log('✅ Dry run completed successfully!');
      console.log('   Run without --dry-run to apply changes.\n');
    } else if (stats.errors.length > 0) {
      console.log('⚠️  Migration completed with errors');
      console.log('   Please review the errors above.\n');
      process.exit(1);
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('   All plans and billable metrics are now in Lago.\n');
      console.log('Next steps:');
      console.log('1. Verify plans in Lago UI');
      console.log('2. Test subscription creation with new plan codes');
      console.log('3. Update EntitlementsService to use Lago plans');
      console.log('4. Remove JSON plan files after verification\n');
    }

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.response?.data) {
      console.error('   API Error:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run migration
migrate().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
