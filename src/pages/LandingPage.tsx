import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Palette, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";

const LandingPage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBooks(0, 6)
      .then((data) => setBooks(data.content))
      .catch(() => {});
  }, []);

  const displayBooks = books.length > 0 ? [...books, ...books, ...books] : [];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || books.length === 0) return;
    slider.scrollLeft = slider.scrollWidth / 3;
  }, [books]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || books.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;
    const onScrollEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const { scrollLeft, scrollWidth } = slider;
        const section = scrollWidth / 3;

        if (scrollLeft < section * 0.5) {
          slider.scrollLeft += section;
        } else if (scrollLeft > section * 1.5) {
          slider.scrollLeft -= section;
        }
      }, 80);
    };

    slider.addEventListener("scroll", onScrollEnd);
    return () => {
      slider.removeEventListener("scroll", onScrollEnd);
      clearTimeout(timeout);
    };
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.6;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen pt-24 magical-gradient relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none storybook-bg" />

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest font-label">
            <Sparkles size={16} />
            AI 기반 스토리텔링
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-extrabold leading-tight md:leading-tight max-w-4xl mx-auto text-on-surface tracking-tight">
            AI로 당신만의 <br />
            <span className="text-primary italic">마법 같은</span> 동화책을 <br />
            만들어보세요
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-body font-medium">
            아이디어만 있다면 누구나 몇 번의 클릭으로 일러스트와 이야기를 완성할 수 있어요.
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-sm md:text-base text-on-surface-variant font-bold">어떤 방식으로 시작할까요?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
              <Link
                to="/dashboard/author"
                className="px-8 py-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-bold shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
              >
                작가로 시작하기
              </Link>
              <Link
                to="/dashboard/reader"
                className="px-8 py-5 rounded-2xl border-2 border-primary/20 bg-white/80 text-on-surface text-lg font-bold hover:bg-white transition-all hover:-translate-y-1 active:scale-95"
              >
                독자로 시작하기
              </Link>
            </div>
          </div>
        </motion.div>

        {books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-16 md:mt-24 w-full max-w-6xl relative"
          >
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-transparent rounded-full flex items-center justify-center text-primary/30 hover:bg-white/90 hover:shadow-lg hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-transparent rounded-full flex items-center justify-center text-primary/30 hover:bg-white/90 hover:shadow-lg hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {displayBooks.map((book, index) => (
                <Link
                  to={`/book/${book.bookId}`}
                  key={`${book.bookId}-${index}`}
                  className="group relative aspect-[3/4] w-[60vw] sm:w-[40vw] md:w-[calc((100%-2.5rem)/3)] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 hover:-translate-y-2 transition-transform duration-300"
                >
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div className="text-white text-left">
                      <h3 className="text-lg md:text-xl font-headline font-bold mb-1">{book.title}</h3>
                      <p className="text-white/80 text-xs font-body">{book.authorName}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      <section className="bg-surface-container-lowest py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">AI 스토리텔링</h4>
              <p className="text-on-surface-variant font-body">간단한 키워드만으로도 몰입감 있는 이야기를 생성할 수 있어요.</p>
            </div>

            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Palette size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">마법 일러스트</h4>
              <p className="text-on-surface-variant font-body">수채화부터 만화풍까지, AI가 이야기 장면을 생생하게 그려줘요.</p>
            </div>

            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                <BookOpen size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">출간까지 한 번에</h4>
              <p className="text-on-surface-variant font-body">완성한 작품을 저장하고 실제 책처럼 감상해보세요.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
