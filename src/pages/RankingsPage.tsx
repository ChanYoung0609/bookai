import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Coins, Heart, Trophy } from "lucide-react";
import { motion } from "motion/react";

type AuthorRankItem = {
  id: string;
  name: string;
  books: number;
  likes: number;
  growth: string;
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
      {
        id: "mb-l-1",
        title: "별빛 요정의 모험",
        author: "하늘봄",
        likes: 512,
        sales: 128000,
        coverImageUrl: "https://picsum.photos/seed/month-like-book-1/600/800",
      },
      {
        id: "mb-l-2",
        title: "숲속 친구들",
        author: "초록나무",
        likes: 436,
        sales: 98000,
        coverImageUrl: "https://picsum.photos/seed/month-like-book-2/600/800",
      },
      {
        id: "mb-l-3",
        title: "바다 위의 별",
        author: "달빛",
        likes: 391,
        sales: 82000,
        coverImageUrl: "https://picsum.photos/seed/month-like-book-3/600/800",
      },
    ],
    salesBooks: [
      {
        id: "mb-s-1",
        title: "별빛 요정의 모험",
        author: "하늘봄",
        likes: 512,
        sales: 128000,
        coverImageUrl: "https://picsum.photos/seed/month-sales-book-1/600/800",
      },
      {
        id: "mb-s-2",
        title: "숲속 친구들",
        author: "초록나무",
        likes: 436,
        sales: 98000,
        coverImageUrl: "https://picsum.photos/seed/month-sales-book-2/600/800",
      },
      {
        id: "mb-s-3",
        title: "무지개 다리",
        author: "별비",
        likes: 374,
        sales: 90500,
        coverImageUrl: "https://picsum.photos/seed/month-sales-book-3/600/800",
      },
    ],
  },
  weekly: {
    prolificAuthors: [
      { id: "wa-p-1", name: "민들레", books: 7, likes: 426, growth: "+16%" },
      { id: "wa-p-2", name: "별모래", books: 6, likes: 391, growth: "+13%" },
      { id: "wa-p-3", name: "은하수", books: 5, likes: 358, growth: "+10%" },
    ],
    likedAuthors: [
      { id: "wa-l-1", name: "민들레", books: 7, likes: 426, growth: "+16%" },
      { id: "wa-l-2", name: "호두나무", books: 4, likes: 403, growth: "+14%" },
      { id: "wa-l-3", name: "별모래", books: 6, likes: 391, growth: "+13%" },
    ],
    likedBooks: [
      {
        id: "wb-l-1",
        title: "구름 위 우체국",
        author: "민들레",
        likes: 178,
        sales: 42000,
        coverImageUrl: "https://picsum.photos/seed/week-like-book-1/600/800",
      },
      {
        id: "wb-l-2",
        title: "달콤한 별나라 여행",
        author: "별모래",
        likes: 161,
        sales: 36800,
        coverImageUrl: "https://picsum.photos/seed/week-like-book-2/600/800",
      },
      {
        id: "wb-l-3",
        title: "반짝이는 숲의 약속",
        author: "은하수",
        likes: 149,
        sales: 33100,
        coverImageUrl: "https://picsum.photos/seed/week-like-book-3/600/800",
      },
    ],
    salesBooks: [
      {
        id: "wb-s-1",
        title: "구름 위 우체국",
        author: "민들레",
        likes: 178,
        sales: 42000,
        coverImageUrl: "https://picsum.photos/seed/week-sales-book-1/600/800",
      },
      {
        id: "wb-s-2",
        title: "달콤한 별나라 여행",
        author: "별모래",
        likes: 161,
        sales: 36800,
        coverImageUrl: "https://picsum.photos/seed/week-sales-book-2/600/800",
      },
      {
        id: "wb-s-3",
        title: "바람꽃 도서관",
        author: "호두나무",
        likes: 137,
        sales: 31500,
        coverImageUrl: "https://picsum.photos/seed/week-sales-book-3/600/800",
      },
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
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm"
    >
      <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-5">
        {icon}
        {title}
      </h2>

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
                <img
                  src={`https://picsum.photos/seed/author-${item.id}/96/96`}
                  alt={`${item.name} 프로필`}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={`rounded-t-2xl bg-gradient-to-b ${podiumToneClass[rank]} ${podiumHeightClass[rank]} flex items-center justify-center shadow-inner`}
              >
                <span className="text-3xl md:text-4xl font-black leading-none">{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl bg-surface-container-low border border-outline-variant/15 p-3">
            <p className="font-semibold text-on-surface truncate">
              {rankBadge[i]} {item.name}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              작품 {item.books}작 · 좋아요 {item.likes.toLocaleString()} · 성장률 {item.growth}
            </p>
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

const BookSection = ({ title, icon, items, metric }: BookSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm"
    >
      <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-5">
        {icon}
        {title}
      </h2>

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
                <img
                  src={item.coverImageUrl}
                  alt={`${item.title} 표지`}
                  className="w-[52px] h-[68px] md:w-[60px] md:h-[84px] rounded-lg object-cover border-2 border-white shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={`rounded-t-2xl bg-gradient-to-b ${podiumToneClass[rank]} ${podiumHeightClass[rank]} flex items-center justify-center shadow-inner`}
              >
                <span className="text-3xl md:text-4xl font-black leading-none">{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <Link
            key={item.id}
            to={`/book/${item.id}`}
            className="group rounded-xl bg-surface-container-low border border-outline-variant/15 p-3 flex items-center gap-3 hover:bg-surface-container transition-colors"
          >
            <img
              src={item.coverImageUrl}
              alt={item.title}
              className="w-10 h-14 rounded-md object-cover shrink-0"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {rankBadge[i]} {item.title}
              </p>
              <p className="text-xs text-on-surface-variant">{item.author} 작가</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {metric === "likes" ? `좋아요 ${item.likes.toLocaleString()}` : `매출 ${item.sales.toLocaleString()}원`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

const RankingsPage = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const isMonthly = period === "monthly";
  const current = useMemo(() => rankingData[period], [period]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-[radial-gradient(circle_at_top_right,rgba(63,87,187,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,103,93,0.12),transparent_45%)]">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-primary/15 via-white to-secondary/10 p-7 md:p-10"
        >
          <div className="absolute -right-14 -top-14 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />

          <div className="relative space-y-3">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface">{isMonthly ? "이달의 랭킹" : "이번 주 랭킹"}</h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
              {periodLabel(period)} 기준으로 가장 활발한 작가와 인기 작품 TOP 3를 모아봤어요.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center rounded-full p-1 bg-white/75 border border-white/70 shadow-sm">
                <button
                  type="button"
                  onClick={() => setPeriod("weekly")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                    !isMonthly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  주간
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("monthly")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                    isMonthly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  월간
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <AuthorSection
            title={`${periodLabel(period)} 다작 작가`}
            icon={<BookOpen size={20} className="text-primary" />}
            items={current.prolificAuthors}
          />
          <AuthorSection
            title={`${periodLabel(period)} 좋아요 작가`}
            icon={<Trophy size={20} className="text-secondary" />}
            items={current.likedAuthors}
          />
          <BookSection
            title={`${periodLabel(period)} 좋아요 책`}
            icon={<Heart size={20} className="text-rose-500" />}
            items={current.likedBooks}
            metric="likes"
          />
          <BookSection
            title={`${periodLabel(period)} 최고 매출 책`}
            icon={<Coins size={20} className="text-amber-600" />}
            items={current.salesBooks}
            metric="sales"
          />
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
