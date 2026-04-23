import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, BarChart3, BookOpen, TrendingUp, Wallet } from "lucide-react";
import { isLoggedIn } from "../lib/auth";

const monthlyRevenueData = [
  { month: "1월", revenue: 22000 },
  { month: "2월", revenue: 28000 },
  { month: "3월", revenue: 36000 },
  { month: "4월", revenue: 41000 },
  { month: "5월", revenue: 52000 },
  { month: "6월", revenue: 66000 },
];

const bookSalesData = [
  { id: "1", title: "별빛 요정의 모험", sold: 164 },
  { id: "2", title: "숲속 친구들", sold: 129 },
  { id: "3", title: "구름 위의 집", sold: 98 },
  { id: "4", title: "바다 위의 별", sold: 74 },
];

const AuthorRevenuePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, [navigate]);

  const maxMonthlyRevenue = Math.max(...monthlyRevenueData.map((item) => item.revenue));
  const maxBookSales = Math.max(...bookSalesData.map((item) => item.sold));

  const totalRevenue = useMemo(
    () => monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0),
    [],
  );
  const bestMonth = useMemo(
    () => monthlyRevenueData.reduce((best, current) => (current.revenue > best.revenue ? current : best)),
    [],
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/author")}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface">수익 분석</h1>
            <p className="text-on-surface-variant text-sm md:text-base">월별 수익과 작품별 판매량을 확인해보세요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-on-primary md:col-span-2"
          >
            <Wallet size={24} className="mb-2" />
            <p className="text-on-primary/80 text-sm">최근 6개월 누적 수익</p>
            <p className="text-3xl md:text-4xl font-headline font-extrabold mt-1">{totalRevenue.toLocaleString()}원</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20"
          >
            <TrendingUp size={20} className="text-primary mb-2" />
            <p className="text-xs text-on-surface-variant">최고 수익 월</p>
            <p className="text-2xl font-headline font-extrabold text-on-surface mt-1">{bestMonth.month}</p>
            <p className="text-sm text-primary font-bold mt-1">{bestMonth.revenue.toLocaleString()}원</p>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20"
        >
          <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-primary" />
            월별 수익 그래프
          </h2>
          <div className="h-72 flex items-end gap-2 md:gap-4">
            {monthlyRevenueData.map((item, index) => {
              const heightRatio = (item.revenue / maxMonthlyRevenue) * 100;
              return (
                <div key={item.month} className="flex-1 h-full flex flex-col justify-end items-center">
                  <p className="text-[10px] md:text-xs text-on-surface-variant mb-2">{item.revenue.toLocaleString()}원</p>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
                    style={{ transformOrigin: "bottom", height: `${Math.max(heightRatio, 8)}%` }}
                    className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-primary to-secondary shadow-sm"
                  />
                  <p className="text-xs md:text-sm text-on-surface-variant mt-2">{item.month}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20"
        >
          <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-secondary" />
            책별 판매량 그래프
          </h2>
          <div className="space-y-4">
            {bookSalesData.map((book, index) => {
              const widthRatio = (book.sold / maxBookSales) * 100;
              return (
                <div key={book.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-bold text-on-surface truncate pr-2">{book.title}</p>
                    <p className="text-xs md:text-sm text-on-surface-variant">{book.sold}권</p>
                  </div>
                  <div className="h-3 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.65, ease: "easeOut", delay: index * 0.09 }}
                      style={{ transformOrigin: "left", width: `${Math.max(widthRatio, 8)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-tertiary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthorRevenuePage;
