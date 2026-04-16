const API_BASE = '/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function adminFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function login(username: string, password: string) {
  const data = await adminFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('admin_token', data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  window.location.href = '/admin/login';
}

export function isLoggedIn() {
  return !!getToken();
}

export const getProfile = () => adminFetch('/admin/profile');
export const updateProfile = (data: Record<string, unknown>) => adminFetch('/admin/profile', { method: 'PUT', body: JSON.stringify(data) });
export const getAdminArticles = (page = 1) => adminFetch(`/admin/articles?page=${page}`);
export const createArticle = (data: Record<string, unknown>) => adminFetch('/admin/articles', { method: 'POST', body: JSON.stringify(data) });
export const updateArticle = (id: string, data: Record<string, unknown>) => adminFetch(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteArticle = (id: string) => adminFetch(`/admin/articles/${id}`, { method: 'DELETE' });
export const getAdminCategories = () => adminFetch('/categories');
export const createCategory = (data: Record<string, unknown>) => adminFetch('/admin/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id: string, data: Record<string, unknown>) => adminFetch(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id: string) => adminFetch(`/admin/categories/${id}`, { method: 'DELETE' });
export const getAdminTags = () => adminFetch('/tags');
export const createTag = (data: Record<string, unknown>) => adminFetch('/admin/tags', { method: 'POST', body: JSON.stringify(data) });
export const updateTag = (id: string, data: Record<string, unknown>) => adminFetch(`/admin/tags/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTag = (id: string) => adminFetch(`/admin/tags/${id}`, { method: 'DELETE' });
export const getAdminComments = (page = 1) => adminFetch(`/admin/comments?page=${page}`);
export const updateCommentStatus = (id: string, status: string) => adminFetch(`/admin/comments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteComment = (id: string) => adminFetch(`/admin/comments/${id}`, { method: 'DELETE' });
export const getStats = () => adminFetch('/admin/stats');

export async function uploadImage(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

// Gallery
export const getGalleryImages = (page = 1, limit = 20, category?: string) => {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) q.set('category', category);
  return adminFetch(`/gallery?${q}`);
};

export async function uploadGalleryImage(file: File, categoryId?: string) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  if (categoryId) formData.append('categoryId', categoryId);
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export const updateGalleryImage = (id: string, data: { title?: string; description?: string; categoryId?: string | null }) =>
  adminFetch(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteGalleryImage = (id: string) =>
  adminFetch(`/admin/gallery/${id}`, { method: 'DELETE' });

// Gallery categories
export const getAdminGalleryCategories = () => adminFetch('/gallery-categories');
export const createGalleryCategory = (data: Record<string, unknown>) =>
  adminFetch('/admin/gallery-categories', { method: 'POST', body: JSON.stringify(data) });
export const updateGalleryCategory = (id: string, data: Record<string, unknown>) =>
  adminFetch(`/admin/gallery-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGalleryCategory = (id: string) =>
  adminFetch(`/admin/gallery-categories/${id}`, { method: 'DELETE' });
