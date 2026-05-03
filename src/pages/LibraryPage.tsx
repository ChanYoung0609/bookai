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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchMyBooks(0, PAGE_SIZE, "DRAFT"),
      fetchMyBooks(0, PAGE_SIZE, "IN_PROGRESS"),
      fetchMyBooks(0, PAGE_SIZE, "COMPLETED"),
    ])
      .then(([draft, inProgress, completed]) => {
        if (cancelled) return;
        setDraftBooks(draft.content ?? []);
        setInProgressBooks(inProgress.content ?? []);
        setCompletedBooks(completed.content ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "내 책 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const workingBooks = useMemo(() => [...draftBooks, ...inProgressBooks], [draftBooks, inProgressBooks]);

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
        {error && <p className="text-red-600 font-bold">{error}</p>}

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
                        <p className="text-xs text-on-surface-variant">{new Date(book.createdAt).toLocaleDateString("ko-KR")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
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
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
