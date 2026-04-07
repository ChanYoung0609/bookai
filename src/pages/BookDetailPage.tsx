import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, BookOpen, Users } from "lucide-react";
import { fetchBookDetail, type BookDetail } from "../lib/api";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBookDetail(id)
      .then((data) => setBook(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant text-lg">책을 찾을 수 없습니다.</p>
        <Link to="/explore" className="text-primary font-bold hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 md:gap-16 items-start">
          {/* Left Column (Desktop) / Top Header (Mobile) */}
          <div className="md:sticky md:top-32 space-y-4 md:space-y-8">
            <div className="flex flex-row md:flex-col gap-5 md:gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[150px] md:w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden book-shadow flex-shrink-0"
              >
                <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>

              {/* Mobile Title & Author Info */}
              <div className="flex-grow md:hidden pt-1">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[11px] mb-2">
                  <Sparkles size={14} />
                  AI 그림책
                </div>
                <h1 className="text-3xl font-display font-bold leading-tight mb-2">{book.title}</h1>
                <p className="text-on-surface-variant text-base font-medium mb-2">{book.authorName} 작가</p>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <BookOpen size={16} />
                  <span className="text-sm font-medium">{book.pages.length} 페이지</span>
                </div>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-col gap-4">
              <Link to={`/read/${book.bookId}`} className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl text-center font-bold text-lg shadow-xl hover:bg-secondary transition-all active:scale-95">
                이야기 읽기
              </Link>
            </div>
          </div>

          {/* Right Column (Desktop) / Main Content (Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-10"
          >
            {/* Desktop Title Header */}
            <div className="hidden md:block space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                <Sparkles size={16} />
                AI 그림책
              </div>
              <h1 className="text-6xl font-display font-bold leading-tight">{book.title}</h1>
              <div className="flex items-center gap-4">
                <span className="font-bold">{book.authorName} 작가</span>
                <div className="h-4 w-[1px] bg-on-surface-variant/20" />
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <BookOpen size={18} />
                  <span className="font-medium">{book.pages.length} 페이지</span>
                </div>
              </div>
            </div>

            {/* Mobile Buttons (Full Width) */}
            <div className="flex flex-col gap-3 md:hidden">
              <Link to={`/read/${book.bookId}`} className="w-full bg-primary text-white py-4 rounded-xl text-center font-bold text-lg shadow-lg active:scale-95">
                이야기 읽기
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">분량</p>
                <p className="font-bold text-sm md:text-base">{book.pages.length} 페이지</p>
              </div>
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">등장인물</p>
                <p className="font-bold text-sm md:text-base">{book.characters.length}명</p>
              </div>
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">형식</p>
                <p className="font-bold text-sm md:text-base">디지털</p>
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold">이야기 소개예요</h3>
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
                {book.description}
              </p>
            </div>

            {/* Characters */}
            {book.characters.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-on-surface-variant/10">
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Users size={22} />
                  등장인물
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {book.characters.map((character, i) => (
                    <div key={i} className="glass p-4 md:p-5 rounded-2xl space-y-2">
                      <p className="font-bold text-base md:text-lg">{character.name}</p>
                      <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">{character.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pages Preview */}
            {book.pages.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-on-surface-variant/10">
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <BookOpen size={22} />
                  미리보기
                </h3>
                <div className="space-y-4">
                  {book.pages.map((page) => (
                    <div key={page.pageNumber} className="glass p-4 md:p-6 rounded-2xl space-y-2">
                      <p className="text-xs font-bold text-primary uppercase">
                        {page.pageNumber} 페이지
                      </p>
                      <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                        {page.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
