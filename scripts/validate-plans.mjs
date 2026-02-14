import fs from 'node:fs';
import path from 'node:path';

const plansDir = path.resolve(
  process.cwd(),
  'packages/config/src/plans'
);

const isString = (v) => typeof v === 'string';
const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isNullableString = (v) => v === null || isString(v);

const errors = [];
const ids = new Set();
let defaultCount = 0;
let featureIdSet = null;

const files = fs
  .readdirSync(plansDir)
  .filter((file) => file.endsWith('.json'))
  .sort();

if (files.length === 0) {
  errors.push('No plan JSON files found in packages/config/src/plans');
}

for (const file of files) {
  const fullPath = path.join(plansDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  let plan;
  try {
    plan = JSON.parse(raw);
  } catch (err) {
    errors.push(`${file}: invalid JSON`);
    continue;
  }

  const prefix = `${file}`;

  if (!isString(plan.id)) errors.push(`${prefix}: id must be a string`);
  if (!isString(plan.name)) errors.push(`${prefix}: name must be a string`);
  if (!isString(plan.displayName)) {
    errors.push(`${prefix}: displayName must be a string`);
  }
  if (!isNullableString(plan.description)) {
    errors.push(`${prefix}: description must be string|null`);
  }
  if (!isNumber(plan.monthlyPrice)) {
    errors.push(`${prefix}: monthlyPrice must be a number`);
  }
  if (!isNumber(plan.yearlyPrice)) {
    errors.push(`${prefix}: yearlyPrice must be a number`);
  }
  if (!isNullableString(plan.stripePriceIdMonthly)) {
    errors.push(`${prefix}: stripePriceIdMonthly must be string|null`);
  }
  if (!isNullableString(plan.stripePriceIdYearly)) {
    errors.push(`${prefix}: stripePriceIdYearly must be string|null`);
  }
  if (typeof plan.isActive !== 'boolean') {
    errors.push(`${prefix}: isActive must be boolean`);
  }
  if (typeof plan.isDefault !== 'boolean') {
    errors.push(`${prefix}: isDefault must be boolean`);
  }
  if (!Array.isArray(plan.features)) {
    errors.push(`${prefix}: features must be an array`);
  } else {
    const currentFeatureIds = new Set(
      plan.features
        .map((feature) => (feature && typeof feature.id === 'string' ? feature.id : null))
        .filter(Boolean)
    );
    if (!featureIdSet) {
      featureIdSet = currentFeatureIds;
    } else {
      const missing = [...featureIdSet].filter((id) => !currentFeatureIds.has(id));
      const extra = [...currentFeatureIds].filter((id) => !featureIdSet.has(id));
      if (missing.length > 0 || extra.length > 0) {
        errors.push(
          `${prefix}: feature IDs must match across plans (missing: ${missing.join(
            ', '
          )}; extra: ${extra.join(', ')})`
        );
      }
    }
    plan.features.forEach((feature, idx) => {
      if (!isString(feature.id)) {
        errors.push(`${prefix}: features[${idx}].id must be string`);
      }
      if (!isString(feature.name)) {
        errors.push(`${prefix}: features[${idx}].name must be string`);
      }
      if (!isNullableString(feature.description)) {
        errors.push(
          `${prefix}: features[${idx}].description must be string|null`
        );
      }
      if (
        !isString(feature.value) &&
        !isNumber(feature.value) &&
        typeof feature.value !== 'boolean'
      ) {
        errors.push(
          `${prefix}: features[${idx}].value must be string|number|boolean`
        );
      }
    });
  }

  if (isString(plan.id)) {
    if (ids.has(plan.id)) {
      errors.push(`${prefix}: duplicate id ${plan.id}`);
    }
    ids.add(plan.id);
  }

  if (plan.isDefault === true) {
    defaultCount += 1;
  }
}

if (defaultCount === 0) {
  errors.push('At least one plan must have isDefault=true');
}
if (defaultCount > 1) {
  errors.push('Only one plan can have isDefault=true');
}

if (errors.length > 0) {
  console.error('Plan JSON validation failed:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`Plan JSON validation passed (${files.length} files).`);
