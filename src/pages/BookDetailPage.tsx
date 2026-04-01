import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Star } from "lucide-react";
import { MOCK_BOOKS } from "../constants";

const BookDetailPage = () => {
  const book = MOCK_BOOKS[0]; // Just for demo

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-10 md:gap-16 items-start">
          {/* Left Column (Desktop) / Top Header (Mobile) */}
          <div className="md:sticky md:top-32 space-y-8">
            <div className="flex flex-row md:flex-col gap-6 md:gap-8 items-start">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[120px] md:w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden book-shadow flex-shrink-0"
              >
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>

              {/* Mobile Title & Author Info */}
              <div className="flex-grow md:hidden pt-2">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
                  <Sparkles size={14} />
                  에디터 추천
                </div>
                <h1 className="text-2xl font-display font-bold leading-tight mb-2">{book.title}</h1>
                <p className="text-on-surface-variant text-sm font-medium mb-1">{book.author} 작가</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} className="fill-current" />
                  <span className="font-bold text-on-surface text-sm">{book.rating}</span>
                  <span className="text-on-surface-variant text-[10px] font-medium ml-1">(1.2k 리뷰)</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-col gap-4">
              <Link to={`/read/${book.id}`} className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl text-center font-bold text-lg shadow-xl hover:bg-secondary transition-all active:scale-95">
                이야기 읽기
              </Link>
            </div>
          </div>

          {/* Right Column (Desktop) / Main Content (Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 md:space-y-10"
          >
            {/* Desktop Title Header */}
            <div className="hidden md:block space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                <Sparkles size={16} />
                에디터 추천
              </div>
              <h1 className="text-6xl font-display font-bold leading-tight">{book.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="작가" className="w-8 h-8 rounded-full" />
                  <span className="font-bold">사라 젠킨스</span>
                </div>
                <div className="h-4 w-[1px] bg-on-surface-variant/20" />
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={18} className="fill-current" />
                  <span className="font-bold text-on-surface">{book.rating}</span>
                  <span className="text-on-surface-variant font-medium">(1.2k 리뷰)</span>
                </div>
              </div>
            </div>

            {/* Mobile Buttons (Full Width) */}
            <div className="flex flex-col gap-3 md:hidden">
              <Link to={`/read/${book.id}`} className="w-full bg-primary text-white py-4 rounded-xl text-center font-bold text-base shadow-lg active:scale-95">
                이야기 읽기
              </Link>
            </div>

            {/* Stats Grid (Full Width) */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">분량</p>
                <p className="font-bold text-sm md:text-base">{book.length}</p>
              </div>
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">언어</p>
                <p className="font-bold text-sm md:text-base">{book.language}</p>
              </div>
              <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">형식</p>
                <p className="font-bold text-sm md:text-base">디지털</p>
              </div>
            </div>

            {/* Introduction (Full Width) */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold">이야기 소개예요</h3>
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
                {book.description}
              </p>
            </div>

            {/* Community Feedback (Full Width) */}
            <div className="space-y-6 pt-8 border-t border-on-surface-variant/10">
              <h3 className="text-xl md:text-2xl font-bold">커뮤니티 피드백이에요</h3>
              <div className="space-y-6">
                {book.reviews.map(review => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-bold text-sm md:text-base">{review.user}</p>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? "fill-current" : ""} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-on-surface-variant">{review.date}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
