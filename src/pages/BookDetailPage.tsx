import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Star } from "lucide-react";
import { MOCK_BOOKS } from "../constants";

const BookDetailPage = () => {
  const book = MOCK_BOOKS[0]; // Just for demo

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:sticky md:top-32"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden book-shadow">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to={`/read/${book.id}`} className="flex-1 bg-primary text-white py-4 md:py-5 rounded-2xl text-center font-bold text-lg shadow-xl hover:bg-secondary transition-all active:scale-95">
              이야기 읽기
            </Link>
            <button className="flex-1 glass py-4 md:py-5 rounded-2xl text-center font-bold text-lg hover:bg-white transition-all active:scale-95">
              양장본 구매하기
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 md:space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
              <Sparkles size={16} />
              에디터 추천
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">{book.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/150?u=sarah" alt="작가" className="w-8 h-8 rounded-full" />
                <span className="font-bold">사라 젠킨스</span>
              </div>
              <div className="hidden sm:block h-4 w-[1px] bg-on-surface-variant/20" />
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={18} className="fill-current" />
                <span className="font-bold text-on-surface">{book.rating}</span>
                <span className="text-on-surface-variant font-medium">(1.2k 리뷰)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-2xl text-center">
              <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">분량</p>
              <p className="font-bold">{book.length}</p>
            </div>
            <div className="glass p-4 rounded-2xl text-center">
              <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">언어</p>
              <p className="font-bold">{book.language}</p>
            </div>
            <div className="glass p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">형식</p>
              <p className="font-bold">디지털</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">이야기 소개예요</h3>
            <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
              {book.description}
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-on-surface-variant/10">
            <h3 className="text-2xl font-bold">커뮤니티 피드백이에요</h3>
            <div className="space-y-6">
              {book.reviews.map(review => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold">{review.user}</p>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? "fill-current" : ""} />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant">{review.date}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm md:text-base">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetailPage;
