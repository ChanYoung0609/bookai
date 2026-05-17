import { z } from "zod";
import { fetchWithAuth } from "./auth";

// ── 공통: 응답 envelope 검증 헬퍼 ──

/**
 * { success, data, error } envelope를 풀고 data를 zod 스키마로 검증한다.
 * - HTTP 실패 / success=false / data 누락 → 서버 메시지(혹은 fallback)로 throw
 * - 스키마 불일치 → fallback 메시지로 throw (개발 모드에서는 상세 이슈 로깅)
 */
async function parseApiResponse<T>(
  res: Response,
  schema: z.ZodType<T>,
  fallbackMessage: string
): Promise<T> {
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success || json?.data == null) {
    throw new Error(json?.error?.message || fallbackMessage);
  }

  const result = schema.safeParse(json.data);
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.error(`[api] 응답 스키마 검증 실패: ${fallbackMessage}`, result.error.issues);
    }
    throw new Error(fallbackMessage);
  }

  return result.data;
}

function pageResponseSchema<T>(item: z.ZodType<T>): z.ZodType<PageResponse<T>> {
  return z.object({
    content: z.array(item),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
    first: z.boolean(),
    number: z.number(),
    size: z.number(),
  }) as unknown as z.ZodType<PageResponse<T>>;
}

function cursorPageResponseSchema<T>(item: z.ZodType<T>): z.ZodType<CursorPageResponse<T>> {
  return z.object({
    items: z.array(item),
    page: z.number(),
    size: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    first: z.boolean(),
    last: z.boolean(),
  }) as unknown as z.ZodType<CursorPageResponse<T>>;
}

// ── 도서 목록 ──

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

export interface CursorPageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

export interface BannerItem {
  bannerId: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  displayOrder: number;
}

export type MyBookStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";
export type MyBookVisibility = "PRIVATE" | "PUBLIC";

export interface MyBookItem {
  bookId: string;
  title: string;
  authorName: string;
  coverImageUrl: string;
  status: MyBookStatus;
  visibility: MyBookVisibility;
  createdAt: string;
}

const bookItemSchema: z.ZodType<BookItem> = z.object({
  bookId: z.string(),
  title: z.string(),
  coverImageUrl: z.string(),
  authorName: z.string(),
  liked: z.boolean().optional(),
});

const bannerItemSchema: z.ZodType<BannerItem> = z.object({
  bannerId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  linkUrl: z.string().nullable().optional(),
  displayOrder: z.number(),
});

const myBookItemSchema: z.ZodType<MyBookItem> = z.object({
  bookId: z.string(),
  title: z.string(),
  authorName: z.string(),
  coverImageUrl: z.string(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED"]),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  createdAt: z.string(),
});

export async function fetchBooks(page: number, size: number): Promise<PageResponse<BookItem>> {
  const res = await fetchWithAuth(`/api/books?page=${page}&size=${size}`, { method: "GET" });
  return parseApiResponse(res, pageResponseSchema(bookItemSchema), "Failed to fetch books");
}

export async function fetchBanners(page = 0, size = 10): Promise<CursorPageResponse<BannerItem>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", "displayOrder,asc");

  const res = await fetchWithAuth(`/api/banners?${params.toString()}`, { method: "GET" });
  return parseApiResponse(res, cursorPageResponseSchema(bannerItemSchema), "배너 목록 조회에 실패했습니다.");
}

export async function fetchMyBooks(
  page: number,
  size: number,
  status?: MyBookStatus
): Promise<PageResponse<MyBookItem>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (status) params.set("status", status);

  const res = await fetchWithAuth(`/api/books/me?${params.toString()}`, { method: "GET" });
  return parseApiResponse(res, pageResponseSchema(myBookItemSchema), "내 책 목록 조회에 실패했습니다.");
}

// ── 도서 상세 ──

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

const bookDetailSchema: z.ZodType<BookDetail> = z.object({
  bookId: z.string(),
  title: z.string(),
  description: z.string(),
  authorName: z.string(),
  coverImageUrl: z.string(),
  pages: z.array(
    z.object({
      pageNumber: z.number(),
      content: z.string(),
      imageUrl: z.string().optional(),
    })
  ),
  characters: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
});

export async function fetchBookDetail(bookId: string): Promise<BookDetail> {
  const res = await fetchWithAuth(`/api/books/${bookId}`, { method: "GET" });
  return parseApiResponse(res, bookDetailSchema, "Failed to fetch book detail");
}

// ── 신고 ──

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

  return typeof json?.data === "string" ? json.data : "신고가 등록되었습니다.";
}

// ── 리뷰 ──

export interface BookReviewItem {
  reviewId: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  nickname: string;
  rating: number;
  content: string;
  mine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPageResponse {
  items: BookReviewItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

export interface ReviewPayload {
  rating: number;
  content: string;
}

const bookReviewItemSchema: z.ZodType<BookReviewItem> = z.object({
  reviewId: z.string(),
  bookId: z.string(),
  bookTitle: z.string(),
  userId: z.string(),
  nickname: z.string(),
  rating: z.number(),
  content: z.string(),
  mine: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const reviewPageResponseSchema: z.ZodType<ReviewPageResponse> =
  cursorPageResponseSchema(bookReviewItemSchema) as unknown as z.ZodType<ReviewPageResponse>;

const reviewDeleteResultSchema: z.ZodType<{ reviewId: string; bookId: string; deleted: boolean }> =
  z.object({
    reviewId: z.string(),
    bookId: z.string(),
    deleted: z.boolean(),
  });

function buildReviewQuery(page: number, size: number, sort = "createdAt,desc"): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", sort);
  return params.toString();
}

export async function fetchBookReviews(bookId: string, page = 0, size = 10): Promise<ReviewPageResponse> {
  const res = await fetchWithAuth(`/api/books/${bookId}/reviews?${buildReviewQuery(page, size)}`, {
    method: "GET",
  });
  return parseApiResponse(res, reviewPageResponseSchema, "리뷰 목록 조회에 실패했습니다.");
}

export async function fetchMyReviews(page = 0, size = 10): Promise<ReviewPageResponse> {
  const res = await fetchWithAuth(`/api/reviews/me?${buildReviewQuery(page, size)}`, {
    method: "GET",
  });
  return parseApiResponse(res, reviewPageResponseSchema, "내 리뷰 목록 조회에 실패했습니다.");
}

export async function createBookReview(bookId: string, payload: ReviewPayload): Promise<BookReviewItem> {
  const res = await fetchWithAuth(`/api/books/${bookId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiResponse(res, bookReviewItemSchema, "리뷰 작성에 실패했습니다.");
}

export async function updateBookReview(reviewId: string, payload: ReviewPayload): Promise<BookReviewItem> {
  const res = await fetchWithAuth(`/api/reviews/${reviewId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiResponse(res, bookReviewItemSchema, "리뷰 수정에 실패했습니다.");
}

export async function deleteBookReview(
  reviewId: string
): Promise<{ reviewId: string; bookId: string; deleted: boolean }> {
  const res = await fetchWithAuth(`/api/reviews/${reviewId}`, { method: "DELETE" });
  return parseApiResponse(res, reviewDeleteResultSchema, "리뷰 삭제에 실패했습니다.");
}

// ── 좋아요 ──

export interface BookLikeStatus {
  bookId: string;
  likeCount: number;
  likedByMe: boolean;
}

export interface ReadingProgress {
  lastReadPageNumber: number;
  isCompleted: boolean;
}

export interface MyReadingProgressItem {
  bookId: string;
  title: string;
  coverImageUrl: string | null;
  authorName: string | null;
  progressPercentage: number;
  isCompleted: boolean;
  lastReadAt: string;
}

export interface MyReadingProgressPage {
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  items: MyReadingProgressItem[];
  last: boolean;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface ReadingGoal {
  targetCount: number | null;
  completedCount: number;
  achievementPercentage: number;
}

const bookLikeStatusSchema: z.ZodType<BookLikeStatus> = z.object({
  bookId: z.string(),
  likeCount: z.number(),
  likedByMe: z.boolean(),
});

const readingProgressSchema: z.ZodType<ReadingProgress> = z.object({
  lastReadPageNumber: z.number(),
  isCompleted: z.boolean(),
});

const myReadingProgressItemSchema: z.ZodType<MyReadingProgressItem> = z.object({
  bookId: z.string(),
  title: z.string(),
  coverImageUrl: z.string().nullable(),
  authorName: z.string().nullable(),
  progressPercentage: z.number(),
  isCompleted: z.boolean(),
  lastReadAt: z.string(),
});

const myReadingProgressPageSchema: z.ZodType<MyReadingProgressPage> = z.object({
  first: z.boolean(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  items: z.array(myReadingProgressItemSchema),
  last: z.boolean(),
  page: z.number(),
  size: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const readingGoalSchema: z.ZodType<ReadingGoal> = z.object({
  targetCount: z.number().nullable(),
  completedCount: z.number(),
  achievementPercentage: z.number(),
});

export async function fetchBookLikeStatus(bookId: string): Promise<BookLikeStatus> {
  const res = await fetchWithAuth(`/api/books/${bookId}/likes`, { method: "GET" });
  return parseApiResponse(res, bookLikeStatusSchema, "좋아요 상태 조회에 실패했습니다.");
}

async function handleBookLikeAction(
  bookId: string,
  method: "POST" | "DELETE",
  fallbackMessage: string
): Promise<BookLikeStatus> {
  const res = await fetchWithAuth(`/api/books/${bookId}/likes`, { method });
  return parseApiResponse(res, bookLikeStatusSchema, fallbackMessage);
}

export async function addBookLike(bookId: string): Promise<BookLikeStatus> {
  return handleBookLikeAction(bookId, "POST", "좋아요 처리에 실패했습니다.");
}

export async function removeBookLike(bookId: string): Promise<BookLikeStatus> {
  return handleBookLikeAction(bookId, "DELETE", "좋아요 취소에 실패했습니다.");
}

export async function fetchReadingProgress(bookId: string): Promise<ReadingProgress> {
  const res = await fetchWithAuth(`/api/books/${bookId}/reading-progress`, { method: "GET" });
  return parseApiResponse(res, readingProgressSchema, "내 진행도 조회에 실패했습니다.");
}

export async function upsertReadingProgress(bookId: string, lastReadPageNumber: number): Promise<string> {
  const res = await fetchWithAuth(`/api/books/${bookId}/reading-progress`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastReadPageNumber }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "진행도 저장에 실패했습니다.");
  }
  return typeof json?.data === "string" ? json.data : "책 진행도 업데이트 완료";
}

export async function completeReadingProgress(bookId: string, lastReadPageNumber: number): Promise<string> {
  const res = await fetchWithAuth(`/api/books/${bookId}/reading-progress/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastReadPageNumber }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "완독 처리에 실패했습니다.");
  }
  return typeof json?.data === "string" ? json.data : "완독 처리 완료";
}

export async function fetchMyReadingProgresses(
  page: number,
  size: number,
  includeCompleted = false
): Promise<MyReadingProgressPage> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("includeCompleted", String(includeCompleted));

  const res = await fetchWithAuth(`/api/user/me/reading-progresses?${params.toString()}`, {
    method: "GET",
  });
  return parseApiResponse(res, myReadingProgressPageSchema, "이어보기 목록 조회에 실패했습니다.");
}

// ── 랭킹 ──

export async function fetchReadingGoal(params?: { year?: number; month?: number }): Promise<ReadingGoal> {
  const search = new URLSearchParams();
  if (typeof params?.year === "number") search.set("year", String(params.year));
  if (typeof params?.month === "number") search.set("month", String(params.month));
  const qs = search.toString();

  const res = await fetchWithAuth(`/api/reading-goals${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
  return parseApiResponse(res, readingGoalSchema, "읽기 목표 조회에 실패했습니다.");
}

export async function upsertReadingGoal(targetCount: number): Promise<string> {
  const res = await fetchWithAuth("/api/reading-goals", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetCount }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "읽기 목표 저장에 실패했습니다.");
  }
  return typeof json?.data === "string" ? json.data : "읽기 목표가 저장되었습니다.";
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

const weeklyProlificAuthorItemSchema: z.ZodType<WeeklyProlificAuthorItem> = z.object({
  userId: z.string(),
  nickname: z.string(),
  profileImage: z.string(),
  bookCount: z.number(),
  rank: z.number(),
});

const weeklyPopularAuthorItemSchema: z.ZodType<WeeklyPopularAuthorItem> = z.object({
  userId: z.string(),
  nickname: z.string(),
  profileImage: z.string(),
  totalLike: z.number(),
  rank: z.number(),
});

const weeklyPopularBookItemSchema: z.ZodType<WeeklyPopularBookItem> = z.object({
  bookId: z.string(),
  title: z.string(),
  coverImageUrl: z.string(),
  authorNickname: z.string(),
  likeCount: z.number(),
  rank: z.number(),
});

function buildRankingQuery(params?: RankingDateParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (typeof params.year === "number") search.set("year", String(params.year));
  if (typeof params.month === "number") search.set("month", String(params.month));
  if (typeof params.day === "number") search.set("day", String(params.day));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function fetchRankingList<T>(
  path: string,
  itemSchema: z.ZodType<T>,
  fallbackMessage: string
): Promise<T[]> {
  const res = await fetchWithAuth(path, { method: "GET" });
  return parseApiResponse(res, z.array(itemSchema), fallbackMessage);
}

export async function fetchWeeklyProlificAuthors(params?: RankingDateParams): Promise<WeeklyProlificAuthorItem[]> {
  return fetchRankingList(
    `/api/ranking/weekly/prolific-authors${buildRankingQuery(params)}`,
    weeklyProlificAuthorItemSchema,
    "이번 주 다작 작가 조회에 실패했습니다."
  );
}

export async function fetchWeeklyPopularAuthors(params?: RankingDateParams): Promise<WeeklyPopularAuthorItem[]> {
  return fetchRankingList(
    `/api/ranking/weekly/popular-authors${buildRankingQuery(params)}`,
    weeklyPopularAuthorItemSchema,
    "이번 주 인기 작가 조회에 실패했습니다."
  );
}

export async function fetchWeeklyPopularBooks(params?: RankingDateParams): Promise<WeeklyPopularBookItem[]> {
  return fetchRankingList(
    `/api/ranking/weekly/popular-books${buildRankingQuery(params)}`,
    weeklyPopularBookItemSchema,
    "이번 주 인기 책 조회에 실패했습니다."
  );
}

export type MonthlyProlificAuthorItem = WeeklyProlificAuthorItem;
export type MonthlyPopularAuthorItem = WeeklyPopularAuthorItem;
export type MonthlyPopularBookItem = WeeklyPopularBookItem;

export async function fetchMonthlyProlificAuthors(
  params?: Pick<RankingDateParams, "year" | "month">
): Promise<MonthlyProlificAuthorItem[]> {
  return fetchRankingList(
    `/api/ranking/monthly/prolific-authors${buildRankingQuery(params)}`,
    weeklyProlificAuthorItemSchema,
    "이달의 다작 작가 조회에 실패했습니다."
  );
}

export async function fetchMonthlyPopularAuthors(
  params?: Pick<RankingDateParams, "year" | "month">
): Promise<MonthlyPopularAuthorItem[]> {
  return fetchRankingList(
    `/api/ranking/monthly/popular-authors${buildRankingQuery(params)}`,
    weeklyPopularAuthorItemSchema,
    "이달의 인기 작가 조회에 실패했습니다."
  );
}

export async function fetchMonthlyPopularBooks(
  params?: Pick<RankingDateParams, "year" | "month">
): Promise<MonthlyPopularBookItem[]> {
  return fetchRankingList(
    `/api/ranking/monthly/popular-books${buildRankingQuery(params)}`,
    weeklyPopularBookItemSchema,
    "이달의 인기 책 조회에 실패했습니다."
  );
}
