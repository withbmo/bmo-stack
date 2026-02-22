export type LagoCustomer = {
  lago_id: string;
  external_id: string;
  external_customer_id: string;
  email?: string | null;
  name?: string | null;
  payment_provider?: string | null;
  payment_provider_code?: string | null;
  provider_customer_id?: string | null;
  payment_method_id?: string | null;
};

export type LagoSubscription = {
  lago_id: string;
  external_id?: string | null;
  external_customer_id: string;
  plan_code: string;
  status: string;
  started_at?: string | null;
  ending_at?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  plan?: LagoPlan;
};

export type LagoInvoice = {
  lago_id: string;
  number: string;
  status: string;
  total_amount_cents: number;
  currency: string;
  issuing_date?: string | null;
  payment_due_date?: string | null;
  file_url?: string | null;
};

export type LagoCheckoutUrlResponse = {
  customer?: {
    checkout_url?: string | null;
  };
  checkout_url?: string | null;
};

export type LagoPortalUrlResponse = {
  customer?: {
    portal_url?: string | null;
  };
  portal_url?: string | null;
};

export type LagoInvoicePaymentUrlResponse = {
  invoice?: {
    payment_url?: string | null;
  };
  payment_url?: string | null;
};

export type LagoEvent = {
  transaction_id: string;
  external_customer_id: string;
  code: string;
  timestamp?: number;
  properties?: Record<string, string | number | boolean | null>;
};

export type LagoWallet = {
  lago_id: string;
  name: string;
  currency: string;
  balance: string;
};

export type LagoWalletTransaction = {
  lago_id: string;
  wallet_id: string;
  paid_credits: string;
  granted_credits: string;
};

export type LagoWebhookEvent<T = unknown> = {
  lago_id?: string;
  id?: string;
  type: string;
  data: T;
};

export type LagoBillableMetric = {
  lago_id: string;
  code: string;
  name: string;
  description?: string | null;
  aggregation_type: 'count_agg' | 'sum_agg' | 'max_agg' | 'unique_count_agg' | 'recurring_count_agg';
  recurring?: boolean;
  field_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBillableMetricInput = {
  code: string;
  name: string;
  description?: string;
  aggregation_type: 'count_agg' | 'sum_agg' | 'max_agg' | 'unique_count_agg' | 'recurring_count_agg';
  recurring?: boolean;
  field_name?: string;
};

export type LagoPlan = {
  lago_id: string;
  code: string;
  name: string;
  description?: string | null;
  interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount_cents: number;
  amount_currency: string;
  pay_in_advance?: boolean;
  charges?: LagoCharge[];
  created_at: string;
  updated_at: string;
};

export type LagoCharge = {
  lago_id: string;
  billable_metric_code: string;
  billable_metric_name?: string;
  charge_model: 'standard' | 'graduated' | 'package' | 'percentage' | 'volume';
  properties: {
    amount?: string;
    package_size?: number;
    max_units?: number | null;
    free_units?: number;
    graduated_ranges?: Array<{
      from_value: number;
      to_value: number | null;
      per_unit_amount: string;
      flat_amount: string;
    }>;
  };
  current_usage?: number;
};

export type CreatePlanInput = {
  code: string;
  name: string;
  description?: string;
  interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount_cents: number;
  amount_currency: string;
  pay_in_advance?: boolean;
  charges?: Array<{
    billable_metric_code: string;
    charge_model: 'standard' | 'graduated' | 'package' | 'percentage' | 'volume';
    properties: {
      amount?: string;
      package_size?: number;
      max_units?: number | null;
      free_units?: number;
    };
  }>;
};
