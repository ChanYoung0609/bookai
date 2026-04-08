const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mongle.cloud';
import { demoBooks, type DemoBookItem } from "./demoData";

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

const bookItemCache = new Map<string, BookItem>();

function toDemoBookDetail(book: DemoBookItem): BookDetail {
  const pageCount = Math.max(1, book.pageCount || 8);
  return {
    bookId: book.bookId,
    title: book.title,
    description: book.description || `A demo story: ${book.title}`,
    authorName: book.authorName,
    coverImageUrl: book.coverImageUrl,
    pages: Array.from({ length: pageCount }, (_, i) => ({
      pageNumber: i + 1,
      content: `Page ${i + 1}. ${book.title} continues with a warm and playful scene.`,
      imageUrl: book.coverImageUrl,
    })),
    characters: [
      { name: "Narrator", description: "Guides the story with kind, simple language." },
      { name: "Main Character", description: "Learns and grows through each chapter." },
    ],
  };
}

function toCachedBookDetail(book: BookItem): BookDetail {
  return {
    bookId: book.bookId,
    title: book.title,
    description: `This book detail is temporarily generated because the server detail endpoint returned 404 for "${book.bookId}".`,
    authorName: book.authorName,
    coverImageUrl: book.coverImageUrl,
    pages: Array.from({ length: 6 }, (_, i) => ({
      pageNumber: i + 1,
      content: `Page ${i + 1}. Preview content generated from list metadata.`,
      imageUrl: book.coverImageUrl,
    })),
    characters: [
      { name: "Story Guide", description: "Placeholder character shown until real detail is available." },
    ],
  };
}

export async function fetchBooks(page: number, size: number): Promise<PageResponse<BookItem>> {
  const res = await fetch(`${API_BASE_URL}/api/books?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  const json = await res.json();
  const data = json.data as PageResponse<BookItem>;
  data.content.forEach((book) => bookItemCache.set(book.bookId, book));
  return data;
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
  const demoBook = demoBooks.find((book) => book.bookId === bookId);
  if (demoBook) {
    return toDemoBookDetail(demoBook);
  }

  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
  if (!res.ok) {
    if (res.status === 404) {
      const cached = bookItemCache.get(bookId);
      if (cached) {
        return toCachedBookDetail(cached);
      }
    }
    throw new Error(`Failed to fetch book detail (${res.status})`);
  }
  const json = await res.json();
  return json.data;
}
