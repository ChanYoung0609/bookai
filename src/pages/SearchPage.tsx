import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, X, BookOpen, Crown, Star } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";

type SortOption = "popular" | "latest" | "rating";
type PriceFilter = "all" | "free" | "paid";

const PAGE_SIZE = 8;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searched, setSearched] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadBooks = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      // TODO: 검색 쿼리, 정렬, 필터 파라미터 API 연동
      const data = await fetchBooks(pageNum, PAGE_SIZE);
      setBooks((prev) => reset ? data.content : [...prev, ...data.content]);
      setHasMore(!data.last);
      setPage(pageNum + 1);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setBooks([]);
    setPage(0);
    setHasMore(true);
    loadBooks(0, true);
  };

  // 무한스크롤
  useEffect(() => {
    if (!searched) return;
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) loadBooks(page);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [searched, hasMore, loading, page, loadBooks]);

  // 초기 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const popularKeywords = ["동물", "우주", "마법", "공주", "바다", "숲", "친구", "모험"];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface">
            이야기 <span className="text-primary italic">검색</span>
          </h1>
          <p className="text-on-surface-variant text-base">
            키워드, 작가, 제목으로 원하는 이야기를 찾아보세요.
          </p>
        </div>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl border-2 border-outline-variant/30 focus-within:border-primary transition-colors px-5 py-4 shadow-sm">
            <Search size={22} className="text-on-surface-variant flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목, 작가, 키워드로 검색..."
              className="flex-grow bg-transparent outline-none text-on-surface text-lg placeholder:text-on-surface-variant/50 font-body"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                showFilters ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </form>

        {/* 인기 키워드 */}
        {!searched && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-on-surface-variant">인기 키워드</p>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => { setQuery(keyword); setSearched(true); setBooks([]); setPage(0); setHasMore(true); loadBooks(0, true); }}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-sm font-medium hover:bg-primary hover:text-on-primary transition-all"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 필터 패널 */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-5"
          >
            <div>
              <p className="text-sm font-bold text-on-surface mb-3">정렬</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "popular", label: "인기순" },
                  { value: "latest", label: "최신순" },
                  { value: "rating", label: "평점순" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      sort === opt.value
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface mb-3">가격</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "all", label: "전체" },
                  { value: "free", label: "무료" },
                  { value: "paid", label: "유료" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceFilter(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      priceFilter === opt.value
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 검색 결과 */}
        {searched && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">"{query || "전체"}"</span> 검색 결과
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, i) => (
                <motion.div
                  key={`${book.bookId}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % PAGE_SIZE) * 0.05 }}
                >
                  <Link to={`/book/${book.bookId}`} className="group flex flex-row sm:flex-col gap-4 sm:gap-0">
                    <div className="relative w-1/3 sm:w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md sm:mb-3 group-hover:-translate-y-1 transition-transform duration-300 flex-shrink-0">
                      <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500">
                          <BookOpen size={28} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center sm:justify-start min-w-0">
                      <h3 className="text-base font-bold group-hover:text-primary transition-colors truncate">{book.title}</h3>
                      <p className="text-on-surface-variant text-xs">{book.authorName} 작가</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {books.length === 0 && !loading && (
              <div className="text-center py-20 space-y-4">
                <Search size={48} className="mx-auto text-on-surface-variant/30" />
                <p className="text-on-surface-variant text-lg">검색 결과가 없습니다.</p>
                <p className="text-on-surface-variant/70 text-sm">다른 키워드로 검색해보세요.</p>
              </div>
            )}

            <div ref={observerRef} className="h-10 flex items-center justify-center">
              {loading && (
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
