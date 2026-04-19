import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Clock, TrendingUp, Heart, ArrowLeft, CheckCircle, BookMarked, Target, X } from "lucide-react";
import { isLoggedIn } from "../lib/auth";

// TODO: 실제 API 연동
const mockReaderStats = {
  totalRead: 47,
  completedBooks: 32,
  inProgressBooks: 5,
  totalReadingTime: 1260,
  readingStreak: 7,
  likedBooks: 28,
  avgReadingPerDay: 35,
  monthlyGoal: 10,
  monthlyCompleted: 7,
};

const mockReadingList = [
  { id: "1", title: "별빛 요정의 모험", author: "하늘봄", progress: 75, lastRead: "2시간 전", lastReadMinutes: 120, totalPages: 12 },
  { id: "2", title: "숲속 친구들", author: "초록나무", progress: 40, lastRead: "어제", lastReadMinutes: 1440, totalPages: 8 },
  { id: "3", title: "구름 위의 집", author: "하늘봄", progress: 20, lastRead: "3일 전", lastReadMinutes: 4320, totalPages: 16 },
  { id: "4", title: "마법의 정원", author: "봄햇살", progress: 90, lastRead: "5일 전", lastReadMinutes: 7200, totalPages: 10 },
];

const mockCompletedRecent = [
  { id: "5", title: "바다 위의 별", author: "푸른노리", completedDate: "2일 전", rating: 5 },
  { id: "6", title: "무지개 다리", author: "햇동이", completedDate: "1주 전", rating: 4 },
  { id: "7", title: "별빛 기차", author: "달빛", completedDate: "2주 전", rating: 5 },
];

const ReaderDashboardPage = () => {
  const navigate = useNavigate();
  const [readingSort, setReadingSort] = useState<"high" | "low" | "recent">("recent");
  const [monthlyGoal, setMonthlyGoal] = useState<number>(mockReaderStats.monthlyGoal);
  const [goalDraft, setGoalDraft] = useState<string>(String(mockReaderStats.monthlyGoal));
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, [navigate]);

  const goalPercent = Math.min(100, Math.round((mockReaderStats.monthlyCompleted / monthlyGoal) * 100));

  const sortedReadingList = useMemo(() => {
    const list = [...mockReadingList];

    if (readingSort === "high") {
      return list.sort((a, b) => b.progress - a.progress);
    }

    if (readingSort === "low") {
      return list.sort((a, b) => a.progress - b.progress);
    }

    return list.sort((a, b) => a.lastReadMinutes - b.lastReadMinutes);
  }, [readingSort]);

  const openGoalModal = () => {
    setGoalDraft(String(monthlyGoal));
    setIsGoalModalOpen(true);
  };

  const closeGoalModal = () => {
    setIsGoalModalOpen(false);
  };

  const saveGoal = () => {
    const parsed = Number(goalDraft);
    if (!Number.isFinite(parsed)) return;
    const safeValue = Math.max(1, Math.min(100, Math.round(parsed)));
    setMonthlyGoal(safeValue);
    setIsGoalModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/start")}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface">독자로서의 독서 기록</h1>
            <p className="text-on-surface-variant text-sm md:text-base">읽기 기록과 진행률을 확인해보세요</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "읽은 책", value: mockReaderStats.totalRead, icon: BookOpen, color: "text-primary" },
            { label: "완독", value: mockReaderStats.completedBooks, icon: CheckCircle, color: "text-secondary" },
            { label: "연속 읽기", value: `${mockReaderStats.readingStreak}일`, icon: TrendingUp, color: "text-tertiary" },
            {
              label: "총 읽기 시간",
              value: `${Math.round(mockReaderStats.totalReadingTime / 60)}시간`,
              icon: Clock,
              color: "text-primary",
            },
            {
              label: "좋아요 한 책",
              value: mockReaderStats.likedBooks,
              icon: Heart,
              color: "text-red-500",
              onClick: () => navigate("/dashboard/reader/liked"),
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 ${
                stat.onClick ? "cursor-pointer hover:bg-surface-container-low transition-colors" : ""
              }`}
              onClick={stat.onClick}
              role={stat.onClick ? "button" : undefined}
              tabIndex={stat.onClick ? 0 : undefined}
              onKeyDown={
                stat.onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        stat.onClick?.();
                      }
                    }
                  : undefined
              }
            >
              <stat.icon size={20} className={`${stat.color} mb-2`} />
              <p className="text-2xl font-headline font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-on-surface-variant">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                <BookMarked size={20} className="text-primary" />
                읽고 있는 책
              </h2>
              <select
                value={readingSort}
                onChange={(e) => setReadingSort(e.target.value as "high" | "low" | "recent")}
                className="w-full sm:w-auto rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="읽고 있는 책 정렬"
              >
                <option value="high">많이 읽은순</option>
                <option value="low">적게 읽은순</option>
                <option value="recent">최신으로 읽은순</option>
              </select>
            </div>

            <div className="space-y-4">
              {sortedReadingList.map((book) => (
                <Link
                  key={book.id}
                  to={`/read/${book.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{book.title}</p>
                    <p className="text-xs text-on-surface-variant">{book.author} 작가 · {book.lastRead}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${book.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-primary w-12 text-right">{book.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to="/library"
                className="text-sm font-bold text-primary hover:underline"
              >
                더보기
              </Link>
            </div>
          </div>

          <div className="space-y-4 lg:h-full lg:flex lg:flex-col">
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-headline font-bold text-on-surface flex items-center gap-2">
                  <Target size={18} className="text-tertiary" />
                  이번 달 목표
                </h3>
                <button
                  type="button"
                  onClick={openGoalModal}
                  className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  설정
                </button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      className="text-tertiary"
                      strokeWidth="3"
                      strokeDasharray={`${goalPercent} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-on-surface">{goalPercent}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-headline font-bold text-on-surface">
                    {mockReaderStats.monthlyCompleted}/{monthlyGoal}
                  </p>
                  <p className="text-xs text-on-surface-variant">완독 목표</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 lg:flex-1">
              <h3 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-secondary" />
                최근 완독
              </h3>
              <div className="space-y-3">
                {mockCompletedRecent.map((book) => (
                  <div key={book.id} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-secondary flex-shrink-0" />
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-bold text-on-surface truncate">{book.title}</p>
                      <p className="text-xs text-on-surface-variant">{book.completedDate}</p>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: book.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGoalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
          onClick={closeGoalModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-outline-variant/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-headline font-bold text-on-surface">이번 달 목표 설정</h4>
              <button
                type="button"
                onClick={closeGoalModal}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
                aria-label="닫기"
              >
                <X size={16} />
              </button>
            </div>

            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">완독 목표 권수</label>
            <input
              type="number"
              min={1}
              max={100}
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 px-4 py-3 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <p className="mt-2 text-xs text-on-surface-variant">1권 ~ 100권 사이로 설정할 수 있어요.</p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={closeGoalModal}
                className="flex-1 rounded-xl py-3 font-bold border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low"
              >
                취소
              </button>
              <button
                type="button"
                onClick={saveGoal}
                className="flex-1 rounded-xl py-3 font-bold bg-primary text-white hover:bg-secondary"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderDashboardPage;
