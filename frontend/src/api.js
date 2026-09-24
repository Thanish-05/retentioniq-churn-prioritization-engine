// Resolves API base URL from VITE_API_URL or VITE_API_BASE, falling back to relative '/api' proxy
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = cleanApiUrl 
  ? (cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`)
  : '/api';

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}

export async function fetchCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.risk && params.risk !== 'All') query.append('risk', params.risk);
  if (params.persuadability && params.persuadability !== 'All') query.append('persuadability', params.persuadability);
  if (params.sortBy) query.append('sort_by', params.sortBy);
  if (params.order) query.append('order', params.order);
  if (params.page) query.append('page', params.page);
  if (params.pageSize) query.append('page_size', params.pageSize);

  const res = await fetch(`${API_BASE}/customers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function fetchCustomerDetails(customerId) {
  const res = await fetch(`${API_BASE}/customers/${customerId}`);
  if (!res.ok) throw new Error(`Customer ${customerId} not found`);
  return res.json();
}

export async function fetchSegments() {
  const res = await fetch(`${API_BASE}/segments`);
  if (!res.ok) throw new Error('Failed to load segment data');
  return res.json();
}

export async function fetchOffers() {
  const res = await fetch(`${API_BASE}/offers`);
  if (!res.ok) throw new Error('Failed to load offer library');
  return res.json();
}

export async function fetchChurnModel() {
  const res = await fetch(`${API_BASE}/model/churn`);
  if (!res.ok) throw new Error('Failed to load churn model metrics');
  return res.json();
}

export async function fetchUpliftModel() {
  const res = await fetch(`${API_BASE}/model/uplift`);
  if (!res.ok) throw new Error('Failed to load uplift model metrics');
  return res.json();
}

export async function fetchBudgetScenarios() {
  const res = await fetch(`${API_BASE}/budget/scenarios`);
  if (!res.ok) throw new Error('Failed to load budget scenarios');
  return res.json();
}

export async function optimizeBudget(budget) {
  const res = await fetch(`${API_BASE}/budget/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget: Number(budget) })
  });
  if (!res.ok) throw new Error('Failed to optimize retention budget');
  return res.json();
}
