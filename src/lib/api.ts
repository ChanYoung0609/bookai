import { fetchWithAuth } from "./auth";

export interface BookItem {
  bookId: string;
  title: string;
  coverImageUrl: string;
  authorName: string;
  liked?: boolean;
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
  const res = await fetchWithAuth(`/api/books?page=${page}&size=${size}`, {
    method: "GET",
  });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || !json?.data) {
    throw new Error(json?.error?.message || "Failed to fetch books");
  }

  return json.data as PageResponse<BookItem>;
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
  const res = await fetchWithAuth(`/api/books/${bookId}`, {
    method: "GET",
  });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || !json?.data) {
    throw new Error(json?.error?.message || "Failed to fetch book detail");
  }

  return json.data as BookDetail;
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

export interface BookLikeStatus {
  bookId: string;
  likeCount: number;
  likedByMe: boolean;
}

export async function fetchBookLikeStatus(bookId: string): Promise<BookLikeStatus> {
  const res = await fetchWithAuth(`/api/books/${bookId}/likes`, { method: "GET" });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || !json?.data) {
    throw new Error(json?.error?.message || "좋아요 상태 조회에 실패했습니다.");
  }

  return json.data as BookLikeStatus;
}

async function handleBookLikeAction(
  bookId: string,
  method: "POST" | "DELETE",
  fallbackMessage: string
): Promise<BookLikeStatus> {
  if (import.meta.env.DEV) {
    console.log(`[likes] request ${method} /api/books/${bookId}/likes`);
  }
  const res = await fetchWithAuth(`/api/books/${bookId}/likes`, { method });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || !json?.data) {
    throw new Error(json?.error?.message || fallbackMessage);
  }

  return json.data as BookLikeStatus;
}

export async function addBookLike(bookId: string): Promise<BookLikeStatus> {
  return handleBookLikeAction(bookId, "POST", "좋아요 처리에 실패했습니다.");
}

export async function removeBookLike(bookId: string): Promise<BookLikeStatus> {
  return handleBookLikeAction(bookId, "DELETE", "좋아요 취소에 실패했습니다.");
}

export interface RankingDateParams {
  year?: number;
  month?: number;
  day?: number;
}

export interface WeeklyProlificAuthorItem {
  userId: string;
  nickname: string;
  profileImage: string;
  bookCount: number;
  rank: number;
}

export interface WeeklyPopularAuthorItem {
  userId: string;
  nickname: string;
  profileImage: string;
  totalLike: number;
  rank: number;
}

export interface WeeklyPopularBookItem {
  bookId: string;
  title: string;
  coverImageUrl: string;
  authorNickname: string;
  likeCount: number;
  rank: number;
}

function buildRankingQuery(params?: RankingDateParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (typeof params.year === "number") search.set("year", String(params.year));
  if (typeof params.month === "number") search.set("month", String(params.month));
  if (typeof params.day === "number") search.set("day", String(params.day));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function fetchRankingList<T>(path: string, fallbackMessage: string): Promise<T[]> {
  const res = await fetchWithAuth(path, { method: "GET" });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || !Array.isArray(json?.data)) {
    throw new Error(json?.error?.message || fallbackMessage);
  }

  return json.data as T[];
}

export async function fetchWeeklyProlificAuthors(params?: RankingDateParams): Promise<WeeklyProlificAuthorItem[]> {
  return fetchRankingList<WeeklyProlificAuthorItem>(
    `/api/ranking/weekly/prolific-authors${buildRankingQuery(params)}`,
    "�̹� �� ���� �۰� ��ȸ�� �����߽��ϴ�."
  );
}

export async function fetchWeeklyPopularAuthors(params?: RankingDateParams): Promise<WeeklyPopularAuthorItem[]> {
  return fetchRankingList<WeeklyPopularAuthorItem>(
    `/api/ranking/weekly/popular-authors${buildRankingQuery(params)}`,
    "�̹� �� �α� �۰� ��ȸ�� �����߽��ϴ�."
  );
}

export async function fetchWeeklyPopularBooks(params?: RankingDateParams): Promise<WeeklyPopularBookItem[]> {
  return fetchRankingList<WeeklyPopularBookItem>(
    `/api/ranking/weekly/popular-books${buildRankingQuery(params)}`,
    "�̹� �� �α� å ��ȸ�� �����߽��ϴ�."
  );
}
