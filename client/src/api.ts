export const BASE_URL = 'http://localhost:8080';

export interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export interface CreateArticleInput {
  title: string;
  contents: string;
}

export interface UpdateArticleInput {
  title?: string;
  contents?: string;
}

export interface Comment {
  commentId: number;
  articleId: number;
  body: string;
}

export interface CreateCommentInput {
  body: string;
}

export interface UpdateCommentInput {
  body: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      }
    } catch {
      // Body may not be JSON
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

// --- Article Endpoints ---

export async function listArticles(titleContains?: string): Promise<Article[]> {
  const url = new URL(`${BASE_URL}/articles`);
  if (titleContains && titleContains.trim() !== '') {
    url.searchParams.set('title_contains', titleContains.trim());
  }
  const res = await fetch(url.toString());
  return handleResponse<Article[]>(res);
}

export async function getArticle(articleId: number): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/${articleId}`);
  return handleResponse<Article>(res);
}

export async function createArticle(data: CreateArticleInput): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function updateArticle(
  articleId: number,
  data: UpdateArticleInput,
): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function deleteArticle(articleId: number): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/${articleId}`, {
    method: 'DELETE',
  });
  return handleResponse<Article>(res);
}

// --- Comment Endpoints ---

export async function listComments(articleId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`);
  return handleResponse<Comment[]>(res);
}

export async function getComment(
  articleId: number,
  commentId: number,
): Promise<Comment> {
  const res = await fetch(
    `${BASE_URL}/articles/${articleId}/comments/${commentId}`,
  );
  return handleResponse<Comment>(res);
}

export async function createComment(
  articleId: number,
  data: CreateCommentInput,
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Comment>(res);
}

export async function updateComment(
  articleId: number,
  commentId: number,
  data: UpdateCommentInput,
): Promise<Comment> {
  const res = await fetch(
    `${BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
  return handleResponse<Comment>(res);
}

export async function deleteComment(
  articleId: number,
  commentId: number,
): Promise<Comment> {
  const res = await fetch(
    `${BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'DELETE',
    },
  );
  return handleResponse<Comment>(res);
}
