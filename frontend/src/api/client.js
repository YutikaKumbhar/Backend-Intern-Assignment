const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiRequest('/auth/me'),
};

export const taskApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tasks${query ? `?${query}` : ''}`);
  },
  create: (body) => apiRequest('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
};

export const userApi = {
  list: () => apiRequest('/users'),
  updateRole: (id, role) =>
    apiRequest(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};
