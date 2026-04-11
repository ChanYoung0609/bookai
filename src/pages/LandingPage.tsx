import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Flame, Clock3, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { fetchBooks, type BookItem } from "../lib/api";
import { isLoggedIn, fetchUserMe, removeAccessToken, clearUserCache } from "../lib/auth";

const HERO_ILLUSTRATION = {
  src: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/7511d991-8d84-4694-89fc-a9ee3a6a8f91.svg",
  alt: "AI로 만드는 나만의 동화책",
};

const FEATURE_ICONS = {
  story: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/b641b25f-aaea-45fa-af08-5aec3d4b77fd.png",
  illustration: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/c700d0e7-62f1-4a9c-abfd-c8a353491136.png",
  complete: "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/84a114ed-8746-4090-921c-3008150764cb.png",
};
const FEATURE_BANNERS = [
  "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/8bccf1b4-f7f6-4ffe-8f83-5273c70da76d.png",
  "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/8bccf1b4-f7f6-4ffe-8f83-5273c70da76d.png",
  "https://img.mongle.cloud/picturebook/users/9311196f-aceb-41ef-937f-e04bda9de4b9/8bccf1b4-f7f6-4ffe-8f83-5273c70da76d.png",
] as const;

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
  moreLink?: string;
};

const SliderSection = ({ title, icon, books, accentClass, showRank = false, moreLink }: SliderSectionProps) => {
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
      <div className="flex items-center justify-between px-1 md:px-0">
        <div className={`flex items-center gap-2 font-bold text-base md:text-xl ${accentClass}`}>
          {icon}
          {title}
        </div>
        {moreLink && (
          <Link
            to={moreLink}
            className="text-xs md:text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            더보기 ›
          </Link>
        )}
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
        className="flex gap-4 md:gap-5 overflow-x-auto pb-2 px-1 md:px-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {displayBooks.map((book, index) => {
          const rank = showRank ? index + 1 : null;
          return (
            <Link
              to={`/book/${book.bookId}`}
              key={`${title}-${book.bookId}-${index}`}
              className="group shrink-0 w-[44vw] sm:w-[30vw] md:w-[220px] lg:w-[260px] snap-start transition-transform duration-300 hover:-translate-y-1"
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
              <h3 className="font-bold text-sm md:text-base text-on-surface line-clamp-2 leading-snug min-h-[2.75em] group-hover:text-primary transition-colors">
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bannerIndex, setBannerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(0, 20)
      .then((data) => setBooks(data.content))
      .catch(() => {});
  }, []);

  const bestBooks = useMemo(() => [...books].reverse().slice(0, 10), [books]);
  const latestBooks = useMemo(() => books.slice(0, 10), [books]);
  const currentBanner = FEATURE_BANNERS[bannerIndex];
  const goToPrevBanner = () =>
    setBannerIndex((prev) => (prev - 1 + FEATURE_BANNERS.length) % FEATURE_BANNERS.length);
  const goToNextBanner = () => setBannerIndex((prev) => (prev + 1) % FEATURE_BANNERS.length);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % FEATURE_BANNERS.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

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
    <div className="min-h-screen pt-24 bg-[#DCE2F9] relative overflow-hidden">

      <section className="max-w-7xl mx-auto px-6 pt-6 pb-12 md:pt-16 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left space-y-5 md:space-y-7 order-2 md:order-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-black leading-tight text-on-surface">
              AI로 나만의 <span className="text-primary">이야기</span>를
              <br />
              <span className="text-primary">그림책</span>으로 만들어보세요
            </h1>
            <p className="text-sm md:text-lg text-on-surface-variant leading-relaxed font-body">
              아이디어만 있다면 누구나 쉽게
              <br className="hidden sm:block" />
              나만의 동화를 완성할 수 있어요.
            </p>
            <div className="pt-2 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={handleStartClick}
                className="inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-base md:text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
              >
                <Sparkles size={18} />
                지금 시작하기
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 relative aspect-video md:aspect-[4/3]"
          >
            <img
              src={HERO_ILLUSTRATION.src}
              alt={HERO_ILLUSTRATION.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 md:mt-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 md:gap-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 flex-1">
              <div className="flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-2xl glass-card border border-white/20 w-full md:w-52 min-h-[185px] md:min-h-[220px]">
                <div className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] shrink-0 flex items-center justify-center">
                  <img
                    src={FEATURE_ICONS.story}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-headline font-bold text-on-surface leading-tight">이야기 생성</h4>
                  <p className="text-sm md:text-base text-on-surface-variant font-body mt-1 leading-snug">텍스트나 음성으로<br />스토리를 만들어요</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-2xl glass-card border border-white/20 w-full md:w-52 min-h-[185px] md:min-h-[220px]">
                <div className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] shrink-0 flex items-center justify-center">
                  <img
                    src={FEATURE_ICONS.illustration}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-headline font-bold text-on-surface leading-tight">그림 생성</h4>
                  <p className="text-sm md:text-base text-on-surface-variant font-body mt-1 leading-snug">장면에 맞는 그림이<br />자동으로 완성돼요</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-2xl glass-card border border-white/20 w-full md:w-52 min-h-[185px] md:min-h-[220px]">
                <div className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] shrink-0 flex items-center justify-center">
                  <img
                    src={FEATURE_ICONS.complete}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base md:text-lg font-headline font-bold text-on-surface leading-tight">책 완성</h4>
                  <p className="text-sm md:text-base text-on-surface-variant font-body mt-1 leading-snug">한 권의 그림책으로<br />저장하고 공유해요</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[380px] lg:w-[480px] self-start space-y-3">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 glass-card shadow-sm">
              <img
                src={currentBanner}
                alt="동화 제작 배너"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
                <button
                  type="button"
                  onClick={goToPrevBanner}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-on-surface shadow hover:bg-white"
                  aria-label="이전 배너"
                >
                  <ChevronLeft size={18} className="mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={goToNextBanner}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-on-surface shadow hover:bg-white"
                  aria-label="다음 배너"
                >
                  <ChevronRight size={18} className="mx-auto" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2">
                {FEATURE_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBannerIndex(idx)}
                    aria-label={`${idx + 1}번 배너로 이동`}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === bannerIndex ? "w-6 bg-primary" : "w-2.5 bg-white/80 border border-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
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
                  moreLink="/explore"
                />
                <SliderSection
                  title="신간 도서"
                  icon={<Clock3 size={18} />}
                  books={latestBooks}
                  accentClass="text-primary"
                  moreLink="/explore"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

