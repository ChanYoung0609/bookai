const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mongle.cloud';

export interface BookItem {
  bookId: string;
  title: string;
  coverImageUrl: string;
  authorName: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

export async function fetchBooks(page: number, size: number): Promise<PageResponse<BookItem>> {
  const res = await fetch(`${API_BASE_URL}/api/books?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  const json = await res.json();
  return json.data;
}

export interface BookDetailPage {
  pageNumber: number;
  content: string;
  imageUrl?: string;
}

export interface BookDetailCharacter {
  name: string;
  description: string;
}

export interface BookDetail {
  bookId: string;
  title: string;
  description: string;
  authorName: string;
  coverImageUrl: string;
  pages: BookDetailPage[];
  characters: BookDetailCharacter[];
}

export async function fetchBookDetail(bookId: string): Promise<BookDetail> {
  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
  if (!res.ok) throw new Error('Failed to fetch book detail');
  const json = await res.json();
  return json.data;
}
