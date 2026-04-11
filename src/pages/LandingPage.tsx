import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Palette, BookOpen, Flame, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";
import { isLoggedIn, fetchUserMe, removeAccessToken, clearUserCache } from "../lib/auth";

const HERO_BANNERS = [
  {
    src: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/66ee6490-053d-4211-9a24-24f4b93101e9.png",
    alt: "AI로 만드는 마법 같은 동화책",
  },
  {
    src: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/0f845712-3c82-4586-be72-6ca142991c87.png",
    alt: "아이디어만 있다면 누구나 작가",
  },
];
const BANNER_INTERVAL_MS = 5000;

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "fairy", label: "동화" },
  { id: "fantasy", label: "판타지" },
  { id: "adventure", label: "모험" },
  { id: "daily", label: "일상" },
  { id: "education", label: "교육" },
  { id: "emotion", label: "감성" },
] as const;

type SliderSectionProps = {
  title: string;
  icon: React.ReactNode;
  books: BookItem[];
  accentClass: string;
  showRank?: boolean;
};

const SliderSection = ({ title, icon, books, accentClass, showRank = false }: SliderSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const displayBooks = useMemo(
    () => (showRank ? books : books.length > 0 ? [...books, ...books, ...books] : []),
    [books, showRank],
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || books.length === 0 || showRank) return;
    slider.scrollLeft = slider.scrollWidth / 3;
  }, [books, showRank]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || books.length === 0 || showRank) return;

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
  }, [books, showRank]);

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
    <div className="space-y-4 md:space-y-5 relative">
      <div className={`flex items-center gap-2 font-bold text-base md:text-xl px-1 md:px-0 ${accentClass}`}>
        {icon}
        {title}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-white text-on-surface-variant hover:text-on-surface hover:bg-white shadow-sm"
        aria-label={`${title} 왼쪽으로 이동`}
      >
        <ChevronLeft size={18} className="mx-auto" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-white text-on-surface-variant hover:text-on-surface hover:bg-white shadow-sm"
        aria-label={`${title} 오른쪽으로 이동`}
      >
        <ChevronRight size={18} className="mx-auto" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-2 px-1 md:px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {displayBooks.map((book, index) => {
          const rank = showRank ? index + 1 : null;
          return (
            <Link
              to={`/book/${book.bookId}`}
              key={`${title}-${book.bookId}-${index}`}
              className="group shrink-0 w-[44vw] sm:w-[30vw] md:w-[220px] lg:w-[260px]"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md mb-3 bg-surface-container-lowest">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {rank !== null && (
                  <div
                    className={`absolute top-2 left-2 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg font-headline font-black text-lg md:text-xl shadow-lg ${
                      rank <= 3 ? "bg-primary text-on-primary" : "bg-white/95 text-on-surface"
                    }`}
                  >
                    {rank}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-base text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1">{book.authorName} 작가</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(0, 20)
      .then((data) => setBooks(data.content))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, BANNER_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const bestBooks = useMemo(() => [...books].reverse().slice(0, 10), [books]);
  const latestBooks = useMemo(() => books.slice(0, 10), [books]);

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

      <section className="max-w-7xl mx-auto px-6 pt-4 pb-12 md:pt-6 md:pb-20 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="relative w-screen md:w-[65vw] md:max-w-5xl aspect-video left-1/2 -translate-x-1/2 md:rounded-3xl overflow-hidden shadow-2xl md:border md:border-white/60 bg-surface-container-lowest">
            <AnimatePresence mode="wait">
              <motion.img
                key={bannerIndex}
                src={HERO_BANNERS[bannerIndex].src}
                alt={HERO_BANNERS[bannerIndex].alt}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {HERO_BANNERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBannerIndex(i)}
                  aria-label={`${i + 1}번 배너로 이동`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === bannerIndex ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 md:pt-8">
            <button
              type="button"
              onClick={handleStartClick}
              className="inline-flex px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              지금 시작하기
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-5 md:mt-12 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-2 md:gap-3 justify-start md:justify-center px-2 min-w-max md:min-w-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 md:px-7 md:py-3 rounded-full text-sm md:text-base font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-primary text-on-primary shadow-lg"
                    : "bg-white/80 text-on-surface-variant hover:bg-white border border-white/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-12 md:mt-16 w-full"
          >
            <div className="space-y-7 md:space-y-10">
              <SliderSection
                title="베스트셀러 TOP 10"
                icon={<Flame size={18} />}
                books={bestBooks}
                accentClass="text-secondary"
                showRank
              />
              <SliderSection
                title="신간 도서"
                icon={<Clock3 size={18} />}
                books={latestBooks}
                accentClass="text-primary"
              />
            </div>
          </motion.div>
        )}
      </section>

      <section className="bg-surface-container-lowest py-10 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12">
            <div className="space-y-3 md:space-y-4 p-5 md:p-8 rounded-2xl md:rounded-3xl glass-card border border-white/20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-lg md:text-2xl font-headline font-bold text-on-surface">AI 스토리텔링</h4>
              <p className="text-sm md:text-base text-on-surface-variant font-body">간단한 키워드만으로도 몰입감 있는 이야기를 생성할 수 있어요.</p>
            </div>

            <div className="space-y-3 md:space-y-4 p-5 md:p-8 rounded-2xl md:rounded-3xl glass-card border border-white/20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Palette className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-lg md:text-2xl font-headline font-bold text-on-surface">마법 일러스트</h4>
              <p className="text-sm md:text-base text-on-surface-variant font-body">수채화부터 만화풍까지, AI가 이야기 장면을 생생하게 그려줘요.</p>
            </div>

            <div className="space-y-3 md:space-y-4 p-5 md:p-8 rounded-2xl md:rounded-3xl glass-card border border-white/20">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h4 className="text-lg md:text-2xl font-headline font-bold text-on-surface">출간까지 한 번에</h4>
              <p className="text-sm md:text-base text-on-surface-variant font-body">완성한 작품을 저장하고 실제 책처럼 감상해보세요.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
