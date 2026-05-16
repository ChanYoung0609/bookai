import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, BarChart3, BookOpen } from "lucide-react";
import { isLoggedIn } from "../lib/auth";

const yearlyRevenueData = [
  { month: "1월", revenue: 22000 },
  { month: "2월", revenue: 28000 },
  { month: "3월", revenue: 36000 },
  { month: "4월", revenue: 41000 },
  { month: "5월", revenue: 52000 },
  { month: "6월", revenue: 66000 },
  { month: "7월", revenue: 57000 },
  { month: "8월", revenue: 62000 },
  { month: "9월", revenue: 73000 },
  { month: "10월", revenue: 68000 },
  { month: "11월", revenue: 76000 },
  { month: "12월", revenue: 81000 },
];

const getRevenueDataByYear = (year: number) => {
  const yearOffset = year - 2026;
  const growthFactor = 1 + yearOffset * 0.06;

  return yearlyRevenueData.map((item, index) => {
    const seasonalFactor = index % 4 === 0 ? 0.97 : index % 3 === 0 ? 1.04 : 1;
    const value = Math.max(8000, Math.round(item.revenue * growthFactor * seasonalFactor));
    return { month: item.month, revenue: Math.round(value / 100) * 100 };
  });
};

const bookSalesData = [
  { id: "1", title: "별빛 요정의 모험", monthly: [8, 10, 12, 14, 15, 18, 16, 17, 19, 21, 20, 22] },
  { id: "2", title: "숲속 친구들", monthly: [6, 7, 8, 9, 10, 11, 10, 11, 12, 13, 13, 14] },
  { id: "3", title: "구름 위의 집", monthly: [4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12] },
  { id: "4", title: "바다 위의 별", monthly: [3, 4, 5, 5, 6, 7, 6, 7, 8, 8, 9, 10] },
];

const monthLabels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const getBookMonthlySalesByYear = (bookId: string, year: number) => {
  const selectedBook = bookSalesData.find((book) => book.id === bookId) ?? bookSalesData[0];
  const yearOffset = year - 2026;
  const growthFactor = 1 + yearOffset * 0.05;

  return selectedBook.monthly.map((value, index) => {
    const seasonalFactor = index % 4 === 0 ? 0.95 : index % 3 === 0 ? 1.08 : 1;
    const count = Math.max(1, Math.round(value * growthFactor * seasonalFactor));
    return { month: monthLabels[index], sold: count };
  });
};

const AuthorRevenuePage = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<"revenue" | "sales">("revenue");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedBookId, setSelectedBookId] = useState(bookSalesData[0].id);

  useEffect(() => {
    if (!isLoggedIn()) navigate("/login");
  }, [navigate]);

  const revenueData = useMemo(() => getRevenueDataByYear(selectedYear), [selectedYear]);
  const selectedBook = useMemo(
    () => bookSalesData.find((book) => book.id === selectedBookId) ?? bookSalesData[0],
    [selectedBookId],
  );
  const selectedBookMonthlySales = useMemo(
    () => getBookMonthlySalesByYear(selectedBookId, selectedYear),
    [selectedBookId, selectedYear],
  );

  const maxMonthlyRevenue = Math.max(...revenueData.map((item) => item.revenue));
  const maxMonthlyBookSales = Math.max(...selectedBookMonthlySales.map((item) => item.sold));

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

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20"
        >
          <div className="flex flex-col gap-3 mb-6">
            <div className="inline-flex items-center rounded-full p-1 bg-surface-container border border-outline-variant/30 w-fit">
              <button
                type="button"
                onClick={() => setChartType("revenue")}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  chartType === "revenue" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                월별 수익
              </button>
              <button
                type="button"
                onClick={() => setChartType("sales")}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  chartType === "sales" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                책별 판매량
              </button>
            </div>

          </div>

          {chartType === "revenue" ? (
            <>
              <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-primary" />
                월별 수익 그래프
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => prev - 1)}
                  className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="이전 연도"
                >
                  {"<"}
                </button>
                <p className="text-lg md:text-xl font-headline font-bold text-on-surface min-w-20 text-center">
                  {selectedYear}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => prev + 1)}
                  className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="다음 연도"
                >
                  {">"}
                </button>
              </div>
              <div className="h-72 flex items-end gap-2 md:gap-3">
                {revenueData.map((item, index) => {
                  const heightRatio = (item.revenue / maxMonthlyRevenue) * 100;
                  return (
                    <div key={`${selectedYear}-${item.month}`} className="flex-1 h-full flex flex-col justify-end items-center">
                      <p className="text-[10px] md:text-xs text-on-surface-variant mb-2">{item.revenue.toLocaleString()}원</p>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.06 }}
                        style={{ transformOrigin: "bottom", height: `${Math.max(heightRatio, 8)}%` }}
                        className="w-full max-w-14 rounded-t-xl bg-gradient-to-t from-primary to-secondary shadow-sm"
                      />
                      <p className="text-xs md:text-sm text-on-surface-variant mt-2">{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-secondary" />
                책별 판매량 그래프
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => prev - 1)}
                  className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="이전 연도"
                >
                  {"<"}
                </button>
                <p className="text-lg md:text-xl font-headline font-bold text-on-surface min-w-20 text-center">
                  {selectedYear}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => prev + 1)}
                  className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="다음 연도"
                >
                  {">"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {bookSalesData.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      selectedBookId === book.id
                        ? "bg-secondary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {book.title}
                  </button>
                ))}
              </div>

              <p className="text-sm text-on-surface-variant mb-3">
                <span className="font-bold text-on-surface">{selectedBook.title}</span>의 월별 판매 권수
              </p>

              <div className="h-72 flex items-end gap-2 md:gap-3">
                {selectedBookMonthlySales.map((item, index) => {
                  const heightRatio = (item.sold / maxMonthlyBookSales) * 100;
                  return (
                    <div key={`${selectedBookId}-${selectedYear}-${item.month}`} className="flex-1 h-full flex flex-col justify-end items-center">
                      <p className="text-[10px] md:text-xs text-on-surface-variant mb-2">{item.sold}권</p>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.06 }}
                        style={{ transformOrigin: "bottom", height: `${Math.max(heightRatio, 8)}%` }}
                        className="w-full max-w-14 rounded-t-xl bg-gradient-to-t from-secondary to-tertiary shadow-sm"
                      />
                      <p className="text-xs md:text-sm text-on-surface-variant mt-2">{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default AuthorRevenuePage;
