import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Palette, BookOpen, Flame, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";
import { isLoggedIn, fetchUserMe, removeAccessToken, clearUserCache } from "../lib/auth";

type SliderSectionProps = {
  title: string;
  icon: React.ReactNode;
  books: BookItem[];
  accentClass: string;
};

const SliderSection = ({ title, icon, books, accentClass }: SliderSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const displayBooks = useMemo(() => (books.length > 0 ? [...books, ...books, ...books] : []), [books]);

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
    const scrollAmount = sliderRef.current.clientWidth * 0.72;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (books.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white/75 backdrop-blur-sm border border-white/60 p-5 md:p-6 space-y-5 relative">
      <div className={`flex items-center gap-2 font-bold text-sm md:text-base ${accentClass}`}>
        {icon}
        {title}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-white text-on-surface-variant hover:text-on-surface hover:bg-white shadow-sm"
        aria-label={`${title} 왼쪽으로 이동`}
      >
        <ChevronLeft size={18} className="mx-auto" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-white text-on-surface-variant hover:text-on-surface hover:bg-white shadow-sm"
        aria-label={`${title} 오른쪽으로 이동`}
      >
        <ChevronRight size={18} className="mx-auto" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-2 px-9 md:px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {displayBooks.map((book, index) => (
          <Link
            to={`/book/${book.bookId}`}
            key={`${title}-${book.bookId}-${index}`}
            className="group shrink-0 w-[58vw] sm:w-[40vw] lg:w-[280px]"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mb-2">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{book.title}</h3>
            <p className="text-xs text-on-surface-variant">{book.authorName} 작가</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(0, 8)
      .then((data) => setBooks(data.content))
      .catch(() => {});
  }, []);

  const latestBooks = useMemo(() => books.slice(0, 8), [books]);
  const popularBooks = useMemo(() => [...books].reverse().slice(0, 8), [books]);

  const handleStartClick = async () => {
    if (isLoggedIn()) {
      const user = await fetchUserMe(true);
      if (user) {
        navigate("/start");
        return;
      }
      // 토큰이 남아있지만 서버가 인정하지 않으면 정리 후 로그인으로
      removeAccessToken();
      clearUserCache();
    }
    navigate("/login");
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

          <div className="pt-8">
            <button
              type="button"
              onClick={handleStartClick}
              className="inline-flex px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              지금 시작하기
            </button>
          </div>
        </motion.div>

        {books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-16 md:mt-24 w-full max-w-7xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-10">
              <SliderSection title="최신순" icon={<Clock3 size={18} />} books={latestBooks} accentClass="text-primary" />
              <SliderSection title="인기순" icon={<Flame size={18} />} books={popularBooks} accentClass="text-secondary" />
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
