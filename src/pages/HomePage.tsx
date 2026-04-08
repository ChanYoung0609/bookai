import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Flame, Crown, BookOpen, TrendingUp, Star, Eye, Heart } from "lucide-react";
import { demoPopularBooks, demoPaidPopularBooks, type DemoBookItem } from "../lib/demoData";

type Tab = "popular" | "paid";

const HomePage = () => {
  const [tab, setTab] = useState<Tab>("popular");

  const displayBooks: DemoBookItem[] = tab === "popular" ? demoPopularBooks : demoPaidPopularBooks;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold leading-tight tracking-tight text-on-surface">
            지금 <span className="text-primary italic">인기 있는</span> 이야기
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl">
            독자들이 가장 사랑하는 이야기를 만나보세요.
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("popular")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
              tab === "popular"
                ? "bg-primary text-on-primary shadow-lg shadow-primary/25"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Flame size={18} />
            인기
          </button>
          <button
            onClick={() => setTab("paid")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
              tab === "paid"
                ? "bg-primary text-on-primary shadow-lg shadow-primary/25"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Crown size={18} />
            유료 인기
          </button>
        </div>

        {/* 랭킹 배너 (상위 3개) */}
        {displayBooks.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayBooks.slice(0, 3).map((book, i) => (
              <motion.div
                key={book.bookId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/book/${book.bookId}`}
                  className="group relative block rounded-3xl overflow-hidden aspect-[4/5] shadow-xl hover:-translate-y-2 transition-transform duration-300"
                >
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === 0 ? "bg-yellow-400 text-yellow-900" :
                      i === 1 ? "bg-gray-300 text-gray-700" :
                      "bg-amber-600 text-amber-100"
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                  {book.isPaid && (
                    <div className="absolute top-4 right-4 bg-primary/90 text-on-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Crown size={12} />
                      {book.price.toLocaleString()}원
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-headline font-bold text-white mb-1">{book.title}</h3>
                    <p className="text-white/70 text-sm mb-2">{book.authorName} 작가</p>
                    <div className="flex items-center gap-3 text-white/60 text-xs">
                      <span className="flex items-center gap-1"><Eye size={12} /> {book.reads.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart size={12} /> {book.likes}</span>
                      <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /> {book.rating}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* 나머지 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayBooks.slice(3).map((book, i) => (
            <motion.div
              key={book.bookId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/book/${book.bookId}`} className="group flex flex-row sm:flex-col gap-4 sm:gap-0">
                <div className="relative w-1/3 sm:w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md sm:mb-3 group-hover:-translate-y-1 transition-transform duration-300 flex-shrink-0">
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    #{i + 4}
                  </div>
                  {tab === "paid" && (
                    <div className="absolute top-2 right-2 bg-primary/90 text-on-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      <Crown size={10} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center sm:justify-start min-w-0">
                  <h3 className="text-base font-bold group-hover:text-primary transition-colors truncate">{book.title}</h3>
                  <p className="text-on-surface-variant text-xs">{book.authorName} 작가</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 더보기 */}
        <div className="flex justify-center pt-4">
          <Link
            to="/explore"
            className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all"
          >
            전체 갤러리 보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
