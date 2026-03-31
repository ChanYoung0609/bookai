import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PlusCircle, Sparkles } from "lucide-react";
import { MOCK_BOOKS } from "../constants";

const LibraryPage = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold">내 책장</h1>
          <Link to="/create" className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-secondary transition-all text-sm md:text-base">
            <PlusCircle size={20} />
            새 이야기 만들기
          </Link>
        </div>

        <div className="space-y-12 md:space-y-16">
          <section className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Sparkles size={24} className="text-primary" />
              </motion.div>
              제작 중이에요
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="glass p-4 md:p-6 rounded-3xl flex gap-4 md:gap-6 items-center">
                <div className="w-20 md:w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src="https://picsum.photos/seed/progress1/300/400" alt="도서" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold truncate">구름 다람쥐</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant">12 페이지 • 마법 수채화</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-wider">
                      <span>일러스트 생성 중</span>
                      <span>65%</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-on-surface-variant/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold">완성된 작품이에요</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {MOCK_BOOKS.map(book => (
                <Link key={book.id} to={`/book/${book.id}`} className="group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden book-shadow mb-3 group-hover:-translate-y-1 transition-transform">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm group-hover:text-primary transition-colors truncate">{book.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
