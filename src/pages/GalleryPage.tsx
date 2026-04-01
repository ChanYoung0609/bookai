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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold leading-tight tracking-tight text-on-surface">
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
              <Link to={`/book/${book.id}`} className="flex flex-row sm:flex-col gap-4 sm:gap-0">
                <div className="relative w-1/3 sm:w-full aspect-[3/4] rounded-2xl overflow-hidden book-shadow sm:mb-4 group-hover:-translate-y-2 transition-transform duration-500 flex-shrink-0">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 glass rounded-full px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1 text-[10px] sm:text-xs font-bold">
                    <Star size={10} className="text-yellow-500 fill-yellow-500 sm:w-3 sm:h-3" />
                    {book.rating}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500">
                      <BookOpen size={32} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center sm:justify-start flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">{book.category}</span>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Heart size={10} />
                      <span className="text-[10px] font-bold">{book.likes}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors truncate sm:whitespace-normal">{book.title}</h3>
                  <p className="text-on-surface-variant text-xs sm:text-sm font-medium mb-2">{book.author} 작가</p>
                  
                  {/* 모바일에서만 보이는 소개글 */}
                  <p className="text-on-surface-variant text-[11px] leading-relaxed line-clamp-2 mb-2 sm:hidden">
                    {book.description}
                  </p>
                  
                  <div className="hidden sm:flex items-center justify-between mt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/60">{book.category}</span>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Heart size={14} />
                      <span className="text-xs font-bold">{book.likes}</span>
                    </div>
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
