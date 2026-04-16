// On the server (SSR / RSC) we need an absolute URL pointing at the backend.
// In the browser we use a relative path so the request hits the same origin
// and goes through the /api rewrite in next.config.mjs (which proxies to the
// loopback-only backend). Without this, browsers would try to fetch
// http://127.0.0.1:3001 from the user's own machine and get ERR_CONNECTION_REFUSED.
const API_URL = typeof window === 'undefined'
  ? (process.env.API_URL || 'http://127.0.0.1:3001')
  : '';

async function fetchAPI(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}/api${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getArticles(params?: { page?: number; category?: string; tag?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.category) query.set('category', params.category);
  if (params?.tag) query.set('tag', params.tag);
  return fetchAPI(`/articles?${query}`);
}

export async function getArticle(id: string) {
  return fetchAPI(`/articles/${id}`);
}

export async function getCategories() {
  return fetchAPI('/categories');
}

export async function getTags() {
  return fetchAPI('/tags');
}

export async function getComments(id: string) {
  return fetchAPI(`/articles/${id}/comments`);
}

export async function postComment(id: string, data: { nickname: string; email: string; content: string; parentId?: string }) {
  return fetchAPI(`/articles/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchArticles(q: string, page = 1) {
  return fetchAPI(`/search?q=${encodeURIComponent(q)}&page=${page}`);
}

export async function getGalleryImages(page = 1, limit = 20, category?: string) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) q.set('category', category);
  return fetchAPI(`/gallery?${q}`);
}

export async function getGalleryCategories() {
  return fetchAPI('/gallery-categories');
}
