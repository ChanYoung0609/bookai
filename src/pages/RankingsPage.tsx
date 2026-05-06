import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Coins, Heart, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
  fetchMonthlyPopularAuthors,
  fetchMonthlyPopularBooks,
  fetchMonthlyProlificAuthors,
  fetchWeeklyPopularAuthors,
  fetchWeeklyPopularBooks,
  fetchWeeklyProlificAuthors,
  type MonthlyPopularAuthorItem,
  type MonthlyPopularBookItem,
  type MonthlyProlificAuthorItem,
  type WeeklyPopularAuthorItem,
  type WeeklyPopularBookItem,
  type WeeklyProlificAuthorItem,
} from "../lib/api";

type AuthorRankItem = {
  id: string;
  name: string;
  books: number;
  likes: number;
  growth: string;
  profileImage?: string;
};

type BookRankItem = {
  id: string;
  title: string;
  author: string;
  likes: number;
  sales: number;
  coverImageUrl: string;
};

const rankBadge = ["🥇", "🥈", "🥉"];
const podiumOrder = [1, 0, 2] as const;

const rankingData: Record<
  "weekly" | "monthly",
  {
    prolificAuthors: AuthorRankItem[];
    likedAuthors: AuthorRankItem[];
    likedBooks: BookRankItem[];
    salesBooks: BookRankItem[];
  }
> = {
  monthly: {
    prolificAuthors: [
      { id: "ma-p-1", name: "하늘봄", books: 14, likes: 1840, growth: "+18%" },
      { id: "ma-p-2", name: "초록나무", books: 11, likes: 1560, growth: "+12%" },
      { id: "ma-p-3", name: "달빛", books: 9, likes: 1422, growth: "+9%" },
    ],
    likedAuthors: [
      { id: "ma-l-1", name: "하늘봄", books: 14, likes: 1840, growth: "+18%" },
      { id: "ma-l-2", name: "별비", books: 8, likes: 1710, growth: "+15%" },
      { id: "ma-l-3", name: "초록나무", books: 11, likes: 1560, growth: "+12%" },
    ],
    likedBooks: [
      { id: "mb-l-1", title: "별빛 요정의 모험", author: "하늘봄", likes: 512, sales: 128000, coverImageUrl: "https://picsum.photos/seed/month-like-book-1/600/800" },
      { id: "mb-l-2", title: "숲속 친구들", author: "초록나무", likes: 436, sales: 98000, coverImageUrl: "https://picsum.photos/seed/month-like-book-2/600/800" },
      { id: "mb-l-3", title: "바다 위의 별", author: "달빛", likes: 391, sales: 82000, coverImageUrl: "https://picsum.photos/seed/month-like-book-3/600/800" },
    ],
    salesBooks: [
      { id: "mb-s-1", title: "별빛 요정의 모험", author: "하늘봄", likes: 512, sales: 128000, coverImageUrl: "https://picsum.photos/seed/month-sales-book-1/600/800" },
      { id: "mb-s-2", title: "숲속 친구들", author: "초록나무", likes: 436, sales: 98000, coverImageUrl: "https://picsum.photos/seed/month-sales-book-2/600/800" },
      { id: "mb-s-3", title: "무지개 다리", author: "별비", likes: 374, sales: 90500, coverImageUrl: "https://picsum.photos/seed/month-sales-book-3/600/800" },
    ],
  },
  weekly: {
    prolificAuthors: [],
    likedAuthors: [],
    likedBooks: [],
    salesBooks: [
      { id: "wb-s-1", title: "구름 위 우체국", author: "민들레", likes: 178, sales: 42000, coverImageUrl: "https://picsum.photos/seed/week-sales-book-1/600/800" },
      { id: "wb-s-2", title: "달콤한 별나라 여행", author: "별모래", likes: 161, sales: 36800, coverImageUrl: "https://picsum.photos/seed/week-sales-book-2/600/800" },
      { id: "wb-s-3", title: "바람꽃 도서관", author: "호두나무", likes: 137, sales: 31500, coverImageUrl: "https://picsum.photos/seed/week-sales-book-3/600/800" },
    ],
  },
};

const podiumHeightClass: Record<1 | 2 | 3, string> = {
  1: "h-24 md:h-28",
  2: "h-20 md:h-24",
  3: "h-16 md:h-20",
};

const podiumToneClass: Record<1 | 2 | 3, string> = {
  1: "from-amber-300 to-amber-500 text-amber-950",
  2: "from-slate-200 to-slate-400 text-slate-800",
  3: "from-orange-300 to-orange-500 text-orange-950",
};

const periodLabel = (period: "weekly" | "monthly") => (period === "monthly" ? "이달의" : "이번 주");

type AuthorSectionProps = {
  title: string;
  icon: React.ReactNode;
  items: AuthorRankItem[];
};

const AuthorSection = ({ title, icon, items }: AuthorSectionProps) => {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
      <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-5">{icon}{title}</h2>
      <div className="flex items-end gap-3 mb-5">
        {podiumOrder.map((index) => {
          const item = items[index];
          if (!item) return <div key={`author-podium-empty-${index}`} className="flex-1" />;
          const rank = (index + 1) as 1 | 2 | 3;
          return (
            <div key={item.id} className="flex-1 min-w-0">
              <div className="mb-2 px-2 py-1 rounded-xl bg-surface-container border border-outline-variant/20 text-center">
                <p className="text-xs font-bold text-on-surface truncate">{item.name}</p>
              </div>
              <div className="mb-2 flex justify-center">
                <img src={item.profileImage || `https://picsum.photos/seed/author-${item.id}/96/96`} alt={`${item.name} 프로필`} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-sm" loading="lazy" decoding="async" />
              </div>
              <motion.div className={`rounded-t-2xl bg-gradient-to-b ${podiumToneClass[rank]} ${podiumHeightClass[rank]} flex items-center justify-center shadow-inner`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.55, ease: "easeOut", delay: rank * 0.08 }} style={{ transformOrigin: "bottom" }}>
                <span className="text-3xl md:text-4xl font-black leading-none">{rank}</span>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl bg-surface-container-low border border-outline-variant/15 p-3 flex items-center gap-3">
            <img src={item.profileImage || `https://picsum.photos/seed/author-list-${item.id}/96/96`} alt={`${item.name} 프로필`} className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover shrink-0 border border-white" loading="lazy" decoding="async" />
            <div className="min-w-0">
              <p className="font-semibold text-on-surface truncate">{rankBadge[i]} {item.name}</p>
              <p className="text-xs text-on-surface-variant mt-1">작품 {item.books}작 · 좋아요 {item.likes.toLocaleString()} · 성장률 {item.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

type BookSectionProps = {
  title: string;
  icon: React.ReactNode;
  items: BookRankItem[];
  metric: "likes" | "sales";
};

const BookSection = ({ title, icon, items, metric }: BookSectionProps) => (
  <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm">
    <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-5">{icon}{title}</h2>
    <div className="flex items-end gap-3 mb-5">
      {podiumOrder.map((index) => {
        const item = items[index];
        if (!item) return <div key={`book-podium-empty-${index}`} className="flex-1" />;
        const rank = (index + 1) as 1 | 2 | 3;
        return (
          <div key={item.id} className="flex-1 min-w-0">
            <div className="mb-2 px-2 py-1 rounded-xl bg-surface-container border border-outline-variant/20 text-center">
              <p className="text-xs font-bold text-on-surface truncate">{item.title}</p>
            </div>
            <div className="mb-2 flex justify-center">
              <img src={item.coverImageUrl} alt={`${item.title} 표지`} className="w-[62px] h-[82px] md:w-[72px] md:h-[100px] rounded-lg object-cover border-2 border-white shadow-sm" loading="lazy" decoding="async" />
            </div>
            <motion.div className={`rounded-t-2xl bg-gradient-to-b ${podiumToneClass[rank]} ${podiumHeightClass[rank]} flex items-center justify-center shadow-inner`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.55, ease: "easeOut", delay: rank * 0.08 }} style={{ transformOrigin: "bottom" }}>
              <span className="text-3xl md:text-4xl font-black leading-none">{rank}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
    <div className="space-y-2">
      {items.map((item, i) => (
        <Link key={item.id} to={`/book/${item.id}`} className="group rounded-xl bg-surface-container-low border border-outline-variant/15 p-3 flex items-center gap-3 hover:bg-surface-container transition-colors">
          <img src={item.coverImageUrl} alt={item.title} className="w-10 h-14 rounded-md object-cover shrink-0" loading="lazy" decoding="async" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{rankBadge[i]} {item.title}</p>
            <p className="text-xs text-on-surface-variant">{item.author} 작가</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{metric === "likes" ? `좋아요 ${item.likes.toLocaleString()}` : `매출 ${item.sales.toLocaleString()}원`}</p>
          </div>
        </Link>
      ))}
    </div>
  </motion.section>
);

const mapProlific = (items: WeeklyProlificAuthorItem[]): AuthorRankItem[] =>
  items.slice(0, 3).map((item) => ({
    id: item.userId,
    name: item.nickname,
    books: item.bookCount,
    likes: 0,
    growth: "-",
    profileImage: item.profileImage,
  }));

const mapPopularAuthors = (items: WeeklyPopularAuthorItem[]): AuthorRankItem[] =>
  items.slice(0, 3).map((item) => ({
    id: item.userId,
    name: item.nickname,
    books: 0,
    likes: item.totalLike,
    growth: "-",
    profileImage: item.profileImage,
  }));

const mapPopularBooks = (items: WeeklyPopularBookItem[]): BookRankItem[] =>
  items.slice(0, 3).map((item) => ({
    id: item.bookId,
    title: item.title,
    author: item.authorNickname,
    likes: item.likeCount,
    sales: 0,
    coverImageUrl: item.coverImageUrl,
  }));

const mapMonthlyProlific = (items: MonthlyProlificAuthorItem[]): AuthorRankItem[] => mapProlific(items);
const mapMonthlyPopularAuthors = (items: MonthlyPopularAuthorItem[]): AuthorRankItem[] => mapPopularAuthors(items);
const mapMonthlyPopularBooks = (items: MonthlyPopularBookItem[]): BookRankItem[] => mapPopularBooks(items);

const RankingsPage = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const isMonthly = period === "monthly";

  const [weeklyProlific, setWeeklyProlific] = useState<AuthorRankItem[]>([]);
  const [weeklyPopularAuthors, setWeeklyPopularAuthors] = useState<AuthorRankItem[]>([]);
  const [weeklyPopularBooks, setWeeklyPopularBooks] = useState<BookRankItem[]>([]);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);
  const [monthlyProlific, setMonthlyProlific] = useState<AuthorRankItem[]>([]);
  const [monthlyPopularAuthors, setMonthlyPopularAuthors] = useState<AuthorRankItem[]>([]);
  const [monthlyPopularBooks, setMonthlyPopularBooks] = useState<BookRankItem[]>([]);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [monthlyLoaded, setMonthlyLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const now = new Date();

    setLoadingWeekly(true);
    Promise.all([
      fetchWeeklyProlificAuthors({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
      fetchWeeklyPopularAuthors({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
      fetchWeeklyPopularBooks({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
    ])
      .then(([prolific, popularAuthors, popularBooks]) => {
        if (cancelled) return;
        setWeeklyProlific(mapProlific(prolific));
        setWeeklyPopularAuthors(mapPopularAuthors(popularAuthors));
        setWeeklyPopularBooks(mapPopularBooks(popularBooks));
      })
      .catch(() => {
        if (cancelled) return;
        setWeeklyProlific([]);
        setWeeklyPopularAuthors([]);
        setWeeklyPopularBooks([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingWeekly(false);
          setWeeklyLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const now = new Date();

    setLoadingMonthly(true);
    Promise.all([
      fetchMonthlyProlificAuthors({ year: now.getFullYear(), month: now.getMonth() + 1 }),
      fetchMonthlyPopularAuthors({ year: now.getFullYear(), month: now.getMonth() + 1 }),
      fetchMonthlyPopularBooks({ year: now.getFullYear(), month: now.getMonth() + 1 }),
    ])
      .then(([prolific, popularAuthors, popularBooks]) => {
        if (cancelled) return;
        setMonthlyProlific(mapMonthlyProlific(prolific));
        setMonthlyPopularAuthors(mapMonthlyPopularAuthors(popularAuthors));
        setMonthlyPopularBooks(mapMonthlyPopularBooks(popularBooks));
      })
      .catch(() => {
        if (cancelled) return;
        setMonthlyProlific([]);
        setMonthlyPopularAuthors([]);
        setMonthlyPopularBooks([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingMonthly(false);
          setMonthlyLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const current = useMemo(() => {
    if (period === "weekly") {
      return {
        prolificAuthors: weeklyLoaded ? weeklyProlific : rankingData.weekly.prolificAuthors,
        likedAuthors: weeklyLoaded ? weeklyPopularAuthors : rankingData.weekly.likedAuthors,
        likedBooks: weeklyLoaded ? weeklyPopularBooks : rankingData.weekly.likedBooks,
        salesBooks: rankingData.weekly.salesBooks,
      };
    }
    return {
      prolificAuthors: monthlyLoaded ? monthlyProlific : rankingData.monthly.prolificAuthors,
      likedAuthors: monthlyLoaded ? monthlyPopularAuthors : rankingData.monthly.likedAuthors,
      likedBooks: monthlyLoaded ? monthlyPopularBooks : rankingData.monthly.likedBooks,
      salesBooks: rankingData.monthly.salesBooks,
    };
  }, [period, weeklyLoaded, weeklyProlific, weeklyPopularAuthors, weeklyPopularBooks, monthlyLoaded, monthlyProlific, monthlyPopularAuthors, monthlyPopularBooks]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-[radial-gradient(circle_at_top_right,rgba(63,87,187,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,103,93,0.12),transparent_45%)]">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-primary/15 via-white to-secondary/10 p-7 md:p-10">
          <div className="relative space-y-3">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface">{isMonthly ? "이달의 랭킹" : "이번 주 랭킹"}</h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">{periodLabel(period)} 기준으로 가장 활발한 작가와 인기 작품 TOP 3를 모아봤어요.</p>
            {period === "weekly" && loadingWeekly && <p className="text-sm text-on-surface-variant">주간 랭킹을 불러오는 중...</p>}
            {period === "monthly" && loadingMonthly && <p className="text-sm text-on-surface-variant">월간 랭킹을 불러오는 중...</p>}
            <div className="pt-2">
              <div className="inline-flex items-center rounded-full p-1 bg-white/75 border border-white/70 shadow-sm">
                <button type="button" onClick={() => setPeriod("weekly")} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${!isMonthly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>주간</button>
                <button type="button" onClick={() => setPeriod("monthly")} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${isMonthly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>월간</button>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <BookSection title={`${periodLabel(period)} 좋아요 책`} icon={<Heart size={20} className="text-rose-500" />} items={current.likedBooks} metric="likes" />
          <BookSection title={`${periodLabel(period)} 최고 매출 책`} icon={<Coins size={20} className="text-amber-600" />} items={current.salesBooks} metric="sales" />
          <AuthorSection title={`${periodLabel(period)} 다작 작가`} icon={<BookOpen size={20} className="text-primary" />} items={current.prolificAuthors} />
          <AuthorSection title={`${periodLabel(period)} 좋아요 작가`} icon={<Trophy size={20} className="text-secondary" />} items={current.likedAuthors} />
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
