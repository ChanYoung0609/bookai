import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  BookOpen, DollarSign, Eye, Heart, TrendingUp,
  Star, ArrowLeft, PenTool, BarChart3, Crown
} from "lucide-react";
import { isLoggedIn } from "../lib/auth";

// TODO: 실제 API 연동
const mockAuthorStats = {
  totalBooks: 12,
  publishedBooks: 8,
  draftBooks: 4,
  totalRevenue: 245_000,
  monthlyRevenue: 48_000,
  totalReads: 1_580,
  totalLikes: 342,
  avgRating: 4.6,
};

const mockBookPerformance = [
  { id: "1", title: "달빛 요정의 모험", reads: 520, likes: 128, revenue: 82_000, isPaid: true, rating: 4.8 },
  { id: "2", title: "숲속 친구들", reads: 380, likes: 95, revenue: 65_000, isPaid: true, rating: 4.5 },
  { id: "3", title: "바다 위의 별", reads: 290, likes: 67, revenue: 0, isPaid: false, rating: 4.7 },
  { id: "4", title: "구름 위의 성", reads: 210, likes: 52, revenue: 48_000, isPaid: true, rating: 4.3 },
];

const AuthorDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface">작가 대시보드</h1>
            <p className="text-on-surface-variant text-sm md:text-base">작품 성과와 수익을 확인하세요.</p>
          </div>
        </div>

        {/* 수익 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-on-primary"
          >
            <DollarSign size={28} className="mb-3" />
            <p className="text-on-primary/70 text-sm">총 수익</p>
            <p className="text-4xl font-headline font-extrabold mt-1">{mockAuthorStats.totalRevenue.toLocaleString()}원</p>
            <div className="flex items-center gap-2 mt-3 text-on-primary/80 text-sm">
              <TrendingUp size={14} />
              이번 달 {mockAuthorStats.monthlyRevenue.toLocaleString()}원
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "출판 작품", value: mockAuthorStats.publishedBooks, icon: BookOpen },
              { label: "작성 중", value: mockAuthorStats.draftBooks, icon: PenTool },
              { label: "총 조회수", value: mockAuthorStats.totalReads.toLocaleString(), icon: Eye },
              { label: "평균 평점", value: mockAuthorStats.avgRating, icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20"
              >
                <stat.icon size={18} className="text-primary mb-2" />
                <p className="text-xl font-headline font-bold text-on-surface">{stat.value}</p>
                <p className="text-xs text-on-surface-variant">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 작품별 성과 */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              작품별 성과
            </h2>
          </div>

          {/* 테이블 헤더 - 데스크탑 */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <div className="col-span-4">작품</div>
            <div className="col-span-2 text-right">조회수</div>
            <div className="col-span-2 text-right">좋아요</div>
            <div className="col-span-2 text-right">평점</div>
            <div className="col-span-2 text-right">수익</div>
          </div>

          <div className="space-y-3">
            {mockBookPerformance.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors items-center"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="text-sm font-bold text-on-surface-variant w-6">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface truncate">{book.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {book.isPaid && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown size={8} /> 유료
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 md:text-right flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-on-surface-variant">조회수</span>
                  <p className="font-bold text-on-surface">{book.reads.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2 md:text-right flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-on-surface-variant">좋아요</span>
                  <p className="font-bold text-on-surface">{book.likes}</p>
                </div>
                <div className="md:col-span-2 md:text-right flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-on-surface-variant">평점</span>
                  <p className="font-bold text-on-surface flex items-center gap-1 md:justify-end">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> {book.rating}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-right flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-on-surface-variant">수익</span>
                  <p className="font-bold text-on-surface">
                    {book.revenue > 0 ? `${book.revenue.toLocaleString()}원` : "-"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 새 작품 CTA */}
        <div className="flex justify-center">
          <Link
            to="/create"
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-bold shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <PenTool size={18} />
            새 이야기 만들기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboardPage;
