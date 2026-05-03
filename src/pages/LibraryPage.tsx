import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PlusCircle, Sparkles } from "lucide-react";
import { fetchMyBooks, type MyBookItem } from "../lib/api";

const PAGE_SIZE = 30;

const statusLabel: Record<MyBookItem["status"], string> = {
  DRAFT: "작성중",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

const LibraryPage = () => {
  const [draftBooks, setDraftBooks] = useState<MyBookItem[]>([]);
  const [inProgressBooks, setInProgressBooks] = useState<MyBookItem[]>([]);
  const [completedBooks, setCompletedBooks] = useState<MyBookItem[]>([]);

  const [draftPage, setDraftPage] = useState(0);
  const [inProgressPage, setInProgressPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);

  const [hasMoreDraft, setHasMoreDraft] = useState(false);
  const [hasMoreInProgress, setHasMoreInProgress] = useState(false);
  const [hasMoreCompleted, setHasMoreCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMoreWorking, setLoadingMoreWorking] = useState(false);
  const [loadingMoreCompleted, setLoadingMoreCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCreatedAt = (createdAt: string) => {
    const parsed = Date.parse(createdAt);
    if (Number.isNaN(parsed)) return "";
    return new Date(parsed).toLocaleDateString("ko-KR");
  };

  const loadInitial = async () => {
    setLoading(true);
    setError(null);

    try {
      const [draft, inProgress, completed] = await Promise.all([
        fetchMyBooks(0, PAGE_SIZE, "DRAFT"),
        fetchMyBooks(0, PAGE_SIZE, "IN_PROGRESS"),
        fetchMyBooks(0, PAGE_SIZE, "COMPLETED"),
      ]);

      setDraftBooks(draft.content ?? []);
      setInProgressBooks(inProgress.content ?? []);
      setCompletedBooks(completed.content ?? []);

      setDraftPage(0);
      setInProgressPage(0);
      setCompletedPage(0);

      setHasMoreDraft(!draft.last);
      setHasMoreInProgress(!inProgress.last);
      setHasMoreCompleted(!completed.last);
    } catch (e) {
      setError(e instanceof Error ? e.message : "내 책 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInitial();
  }, []);

  const workingBooks = useMemo(() => [...draftBooks, ...inProgressBooks], [draftBooks, inProgressBooks]);
  const hasMoreWorking = hasMoreDraft || hasMoreInProgress;

  const loadMoreWorking = async () => {
    if (loadingMoreWorking || !hasMoreWorking) return;

    setLoadingMoreWorking(true);
    setError(null);

    try {
      const tasks: Promise<void>[] = [];

      if (hasMoreDraft) {
        const nextDraftPage = draftPage + 1;
        tasks.push(
          fetchMyBooks(nextDraftPage, PAGE_SIZE, "DRAFT").then((res) => {
            setDraftBooks((prev) => [...prev, ...(res.content ?? [])]);
            setDraftPage(nextDraftPage);
            setHasMoreDraft(!res.last);
          })
        );
      }

      if (hasMoreInProgress) {
        const nextProgressPage = inProgressPage + 1;
        tasks.push(
          fetchMyBooks(nextProgressPage, PAGE_SIZE, "IN_PROGRESS").then((res) => {
            setInProgressBooks((prev) => [...prev, ...(res.content ?? [])]);
            setInProgressPage(nextProgressPage);
            setHasMoreInProgress(!res.last);
          })
        );
      }

      await Promise.all(tasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "작업 중 목록을 더 불러오지 못했습니다.");
    } finally {
      setLoadingMoreWorking(false);
    }
  };

  const loadMoreCompleted = async () => {
    if (loadingMoreCompleted || !hasMoreCompleted) return;

    setLoadingMoreCompleted(true);
    setError(null);

    try {
      const nextPage = completedPage + 1;
      const res = await fetchMyBooks(nextPage, PAGE_SIZE, "COMPLETED");
      setCompletedBooks((prev) => [...prev, ...(res.content ?? [])]);
      setCompletedPage(nextPage);
      setHasMoreCompleted(!res.last);
    } catch (e) {
      setError(e instanceof Error ? e.message : "완성 작품을 더 불러오지 못했습니다.");
    } finally {
      setLoadingMoreCompleted(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold">내 책장</h1>
          <Link
            to="/create"
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-secondary transition-all text-sm md:text-base"
          >
            <PlusCircle size={20} />
            새 이야기 만들기
          </Link>
        </div>

        {loading && <p className="text-on-surface-variant">책 목록을 불러오는 중...</p>}
        {error && (
          <div className="flex items-center gap-3">
            <p className="text-red-600 font-bold">{error}</p>
            <button
              type="button"
              onClick={() => void loadInitial()}
              className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-high"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-12 md:space-y-16">
            <section className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Sparkles size={24} className="text-primary" />
                </motion.div>
                작업 중이에요
              </h3>

              {workingBooks.length === 0 ? (
                <p className="text-on-surface-variant">작성중/진행중인 책이 없어요.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {workingBooks.map((book) => (
                    <Link key={book.bookId} to={`/book/${book.bookId}`} className="glass p-4 md:p-6 rounded-3xl flex gap-4 md:gap-6 items-center hover:-translate-y-1 transition-transform">
                      <div className="w-20 md:w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg md:text-xl font-bold truncate">{book.title}</h4>
                        <p className="text-xs md:text-sm text-on-surface-variant">{book.authorName} · {statusLabel[book.status]}</p>
                        <p className="text-xs text-on-surface-variant">{formatCreatedAt(book.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {hasMoreWorking && (
                <button
                  type="button"
                  onClick={() => void loadMoreWorking()}
                  disabled={loadingMoreWorking}
                  className="px-5 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-high disabled:opacity-60"
                >
                  {loadingMoreWorking ? "불러오는 중..." : "작업 중 더 보기"}
                </button>
              )}
            </section>

            <section className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold">완성된 작품이에요</h3>
              {completedBooks.length === 0 ? (
                <p className="text-on-surface-variant">완료된 작품이 없어요.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {completedBooks.map((book) => (
                    <Link key={book.bookId} to={`/book/${book.bookId}`} className="group">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden book-shadow mb-3 group-hover:-translate-y-1 transition-transform">
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                      <h4 className="font-bold text-xs md:text-sm group-hover:text-primary transition-colors truncate">{book.title}</h4>
                    </Link>
                  ))}
                </div>
              )}

              {hasMoreCompleted && (
                <button
                  type="button"
                  onClick={() => void loadMoreCompleted()}
                  disabled={loadingMoreCompleted}
                  className="px-5 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-high disabled:opacity-60"
                >
                  {loadingMoreCompleted ? "불러오는 중..." : "완성 작품 더 보기"}
                </button>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
