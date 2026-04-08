import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";

const PAGE_SIZE = 4;
type SortOption = "newest" | "titleAsc" | "titleDesc";

const GalleryPage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchBooks(page, PAGE_SIZE);
      setBooks((prev) => [...prev, ...data.content]);
      setHasMore(!data.last);
      setPage((prev) => prev + 1);
    } catch {
      // Stop infinite loading when API fails.
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let result = [...books];

    if (normalized) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(normalized) ||
          book.authorName.toLowerCase().includes(normalized)
      );
    }

    if (sort === "titleAsc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "titleDesc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      result.sort((a, b) => b.bookId.localeCompare(a.bookId));
    }

    return result;
  }, [books, query, sort]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold leading-tight tracking-tight text-on-surface">
            Infinite stories, <br />
            <span className="text-primary italic">one page at a time</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl">
            Explore community-made AI stories, from fairy tales to magical adventures.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl border-2 border-outline-variant/30 focus-within:border-primary transition-colors px-4 md:px-5 py-3 md:py-4 shadow-sm">
            <Search size={20} className="text-on-surface-variant flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author"
              className="flex-grow bg-transparent outline-none text-on-surface text-base md:text-lg placeholder:text-on-surface-variant/50 font-body min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-on-surface-variant hover:text-on-surface p-1"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                showFilters
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
              aria-label="Toggle sort options"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 md:p-6 space-y-3"
            >
              <p className="text-sm font-bold text-on-surface">Sort</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "newest", label: "Newest" },
                  { value: "titleAsc", label: "Title A-Z" },
                  { value: "titleDesc", label: "Title Z-A" },
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
            </motion.div>
          )}

          <p className="text-sm text-on-surface-variant">
            {isSearching ? `Results for \"${query}\"` : "All stories"} ({visibleBooks.length})
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {visibleBooks.map((book, i) => (
            <motion.div
              key={book.bookId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % PAGE_SIZE) * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/book/${book.bookId}`} className="flex flex-row sm:flex-col gap-4 sm:gap-0">
                <div className="relative w-1/3 sm:w-full aspect-[3/4] rounded-2xl overflow-hidden book-shadow sm:mb-4 group-hover:-translate-y-2 transition-transform duration-500 flex-shrink-0">
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500">
                      <BookOpen size={32} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center sm:justify-start flex-grow min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors truncate sm:whitespace-normal">{book.title}</h3>
                  <p className="text-on-surface-variant text-xs sm:text-sm font-medium">{book.authorName}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {visibleBooks.length === 0 && !loading && (
          <div className="text-center py-16 space-y-3">
            <Search size={44} className="mx-auto text-on-surface-variant/30" />
            <p className="text-on-surface-variant text-lg">No results found.</p>
            <p className="text-on-surface-variant/70 text-sm">Try a different keyword.</p>
          </div>
        )}

        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {loading && <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />}
        </div>

        {isSearching && hasMore && (
          <p className="text-center text-xs text-on-surface-variant/70">
            More books are loading. Search results can increase as more pages arrive.
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
