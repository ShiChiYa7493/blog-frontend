const API_URL = process.env.API_URL || 'http://127.0.0.1:3001';

async function fetchAPI(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}/api${path}`, {
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

export async function getArticle(slug: string) {
  return fetchAPI(`/articles/${slug}`);
}

export async function getCategories() {
  return fetchAPI('/categories');
}

export async function getTags() {
  return fetchAPI('/tags');
}

export async function getComments(slug: string) {
  return fetchAPI(`/articles/${slug}/comments`);
}

export async function postComment(slug: string, data: { nickname: string; email: string; content: string; parentId?: number }) {
  return fetchAPI(`/articles/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchArticles(q: string, page = 1) {
  return fetchAPI(`/search?q=${encodeURIComponent(q)}&page=${page}`);
}
