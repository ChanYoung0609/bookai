import { fetchWithAuth } from "./auth";

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

export type ReportReason = "SPAM" | "INAPPROPRIATE" | "COPYRIGHT" | "OTHER";

export interface ReportBookRequest {
  reason: ReportReason;
  detail?: string;
}

export async function reportBook(bookId: string, payload: ReportBookRequest): Promise<string> {
  const res = await fetchWithAuth(`/api/report/${bookId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const code = json?.error?.code;
    const message =
      code === "BOOK_001"
        ? "해당 도서를 찾을 수 없습니다."
        : code === "REPORT_001"
          ? "이미 해당 도서에 대한 신고 기록이 존재합니다."
          : code === "REPORT_002"
            ? "본인의 도서는 신고할 수 없습니다."
            : json?.error?.message || "신고 접수에 실패했습니다.";
    throw new Error(message);
  }

  if (!json?.success) {
    throw new Error(json?.error?.message || "신고 접수에 실패했습니다.");
  }

  return json?.data || "신고가 등록되었습니다.";
}
