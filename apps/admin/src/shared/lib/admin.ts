import type { AdminLevel } from '@pytholit/contracts';
import { apiRequest, API_V1 } from './client';

export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminUserRow = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
  createdAt: string;
};

export type AdminMembershipRow = {
  userId: string;
  email: string;
  username: string;
  level: AdminLevel;
  grantedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminEnvironmentRow = {
  id: string;
  ownerId: string;
  projectId: string | null;
  envType: string;
  displayName: string;
  tierPolicy: string;
  executionMode: string;
  region: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDeployJobRow = {
  id: string;
  status: string;
  projectId: string;
  environmentId: string;
  triggeredByUserId: string | null;
  currentStep: string | null;
  createdAt: string;
};

export type AdminSubscriptionRow = {
  id: string;
  userId: string;
  planId: string | null;
  status: string;
  externalSubscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export type AdminInvoiceRow = {
  id: string;
  userId: string;
  externalInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
};

const ADMIN_PREFIX = `${API_V1}/admin`;

export async function adminListUsers(
  token: string,
  params: { q?: string; page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminUserRow>> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminUserRow>>(`${ADMIN_PREFIX}/users${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function adminUpdateUser(
  token: string,
  userId: string,
  body: Partial<Pick<AdminUserRow, 'isActive'>>
): Promise<AdminUserRow> {
  return apiRequest<AdminUserRow>(`${ADMIN_PREFIX}/users/${userId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(body),
  });
}

export async function adminListAdmins(
  token: string,
  params: { q?: string; page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminMembershipRow>> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminMembershipRow>>(`${ADMIN_PREFIX}/admins${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function adminGrantAdmin(
  token: string,
  body: { userId: string; level: AdminLevel }
): Promise<AdminMembershipRow> {
  return apiRequest<AdminMembershipRow>(`${ADMIN_PREFIX}/admins`, {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export async function adminUpdateAdminLevel(
  token: string,
  userId: string,
  body: { level: AdminLevel }
): Promise<AdminMembershipRow> {
  return apiRequest<AdminMembershipRow>(`${ADMIN_PREFIX}/admins/${userId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(body),
  });
}

export async function adminRevokeAdmin(
  token: string,
  userId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${ADMIN_PREFIX}/admins/${userId}`, {
    method: 'DELETE',
    token,
  });
}

export async function adminListEnvironments(
  token: string,
  params: { q?: string; page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminEnvironmentRow>> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminEnvironmentRow>>(`${ADMIN_PREFIX}/environments${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function adminListDeployJobs(
  token: string,
  params: { status?: string; page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminDeployJobRow>> {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminDeployJobRow>>(`${ADMIN_PREFIX}/deploy-jobs${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function adminCancelDeployJob(
  token: string,
  jobId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${ADMIN_PREFIX}/deploy-jobs/${jobId}/cancel`, {
    method: 'POST',
    token,
  });
}

export async function adminListSubscriptions(
  token: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminSubscriptionRow>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminSubscriptionRow>>(`${ADMIN_PREFIX}/billing/subscriptions${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function adminListInvoices(
  token: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<PageResult<AdminInvoiceRow>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return apiRequest<PageResult<AdminInvoiceRow>>(`${ADMIN_PREFIX}/billing/invoices${suffix}`, {
    method: 'GET',
    token,
  });
}
