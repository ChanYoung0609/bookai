import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, BookOpen, Users, Flag, X } from "lucide-react";
import { fetchBookDetail, type BookDetail } from "../lib/api";

const reportReasons = ["스팸/광고", "부적절한 내용", "저작권 침해", "기타"] as const;

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<(typeof reportReasons)[number]>("스팸/광고");
  const [reportDetail, setReportDetail] = useState("");
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBookDetail(id)
      .then((data) => {
        setBook(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportOpen(false);
    setReportDone(true);
    setReportDetail("");
    setReportReason("스팸/광고");
    window.setTimeout(() => setReportDone(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant text-lg">책을 찾을 수 없습니다.</p>
        <Link to="/explore" className="text-primary font-bold hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-300 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
            >
              <Flag size={16} />
              신고
            </button>
          </div>

          {reportDone && (
            <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary font-bold">
              신고가 접수되었습니다. 검토 후 조치할게요.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 md:gap-16 items-start">
            <div className="md:sticky md:top-32 space-y-4 md:space-y-8">
              <div className="flex flex-row md:flex-col gap-5 md:gap-8 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-[150px] md:w-full aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden book-shadow flex-shrink-0"
                >
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>

                <div className="flex-grow md:hidden pt-1">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[11px] mb-2">
                    <Sparkles size={14} />
                    AI 그림책
                  </div>
                  <h2 className="text-3xl font-display font-bold leading-tight mb-2">{book.title}</h2>
                  <p className="text-on-surface-variant text-base font-medium mb-2">{book.authorName} 작가</p>
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <BookOpen size={16} />
                    <span className="text-sm font-medium">{book.pages.length} 페이지</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-4">
                <Link to={`/read/${book.bookId}`} className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl text-center font-bold text-lg shadow-xl hover:bg-secondary transition-all active:scale-95">
                  이야기 읽기
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 md:space-y-10"
            >
              <div className="hidden md:block space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                  <Sparkles size={16} />
                  AI 그림책
                </div>
                <h1 className="text-6xl font-display font-bold leading-tight">{book.title}</h1>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{book.authorName} 작가</span>
                  <div className="h-4 w-[1px] bg-on-surface-variant/20" />
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <BookOpen size={18} />
                    <span className="font-medium">{book.pages.length} 페이지</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                <Link to={`/read/${book.bookId}`} className="w-full bg-primary text-white py-4 rounded-xl text-center font-bold text-lg shadow-lg active:scale-95">
                  이야기 읽기
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                  <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">분량</p>
                  <p className="font-bold text-sm md:text-base">{book.pages.length} 페이지</p>
                </div>
                <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                  <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">등장인물</p>
                  <p className="font-bold text-sm md:text-base">{book.characters.length}명</p>
                </div>
                <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                  <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase mb-1">형식</p>
                  <p className="font-bold text-sm md:text-base">세로형</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-bold">이야기 소개</h3>
                <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">{book.description}</p>
              </div>

              {book.characters.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-on-surface-variant/10">
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Users size={22} />
                    등장인물
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {book.characters.map((character, i) => (
                      <div key={i} className="glass p-4 md:p-5 rounded-2xl space-y-2">
                        <p className="font-bold text-base md:text-lg">{character.name}</p>
                        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">{character.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {book.pages.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-on-surface-variant/10">
                  <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <BookOpen size={22} />
                    미리보기
                  </h3>
                  <div className="space-y-4">
                    {book.pages.map((page) => (
                      <div key={page.pageNumber} className="glass p-4 md:p-6 rounded-2xl space-y-2">
                        <p className="text-xs font-bold text-primary uppercase">{page.pageNumber} 페이지</p>
                        <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">{page.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 z-[90] bg-black/55 px-4 flex items-center justify-center" onClick={() => setIsReportOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">작품 신고</h2>
              <button type="button" onClick={() => setIsReportOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-bold text-on-surface">신고 사유</p>
                <div className="grid grid-cols-2 gap-2">
                  {reportReasons.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setReportReason(reason)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        reportReason === reason
                          ? "bg-red-100 border-red-300 text-red-700"
                          : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="report-detail" className="text-sm font-bold text-on-surface">
                  상세 내용
                </label>
                <textarea
                  id="report-detail"
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  rows={4}
                  placeholder="신고 내용을 입력해주세요."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/40 text-on-surface-variant font-bold hover:bg-surface-container-low"
                >
                  취소
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700">
                  신고 접수
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookDetailPage;

