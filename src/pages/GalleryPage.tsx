import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, BookOpen, Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { MOCK_BOOKS, CATEGORIES } from "../constants";

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("전체");

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              무한한 세계, <br />
              <span className="text-primary italic">한 페이지씩</span> 완성돼요
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-xl">
              우리 커뮤니티가 만든 수천 개의 AI 생성 이야기를 만나보세요. 깊은 우주부터 마법의 숲까지 준비되어 있어요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-bold transition-all",
                  selectedCategory === cat 
                    ? "bg-primary text-white shadow-lg" 
                    : "glass text-on-surface-variant hover:bg-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {MOCK_BOOKS.filter(b => selectedCategory === "전체" || b.category === selectedCategory).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/book/${book.id}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden book-shadow mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-1 text-xs font-bold">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {book.rating}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500">
                      <BookOpen size={32} />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">{book.title}</h3>
                <p className="text-on-surface-variant text-sm font-medium">{book.author} 작가</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/60">{book.category}</span>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Heart size={14} />
                    <span className="text-xs font-bold">{book.likes}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
