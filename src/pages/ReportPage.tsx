import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, CheckCircle, Send } from "lucide-react";

type ReportCategory = "inappropriate" | "copyright" | "spam" | "harassment" | "other";

const REPORT_CATEGORIES: { value: ReportCategory; label: string; description: string }[] = [
  { value: "inappropriate", label: "부적절한 콘텐츠", description: "폭력적이거나 선정적인 내용" },
  { value: "copyright", label: "저작권 침해", description: "허가 없이 타인의 작품을 사용" },
  { value: "spam", label: "스팸/광고", description: "홍보 또는 반복적인 콘텐츠" },
  { value: "harassment", label: "괴롭힘/혐오", description: "특정 대상을 향한 혐오 표현" },
  { value: "other", label: "기타", description: "위 항목에 해당하지 않는 문제" },
];

const ReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("bookId");
  const bookTitle = searchParams.get("title") || "알 수 없는 작품";

  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setSubmitting(true);
    // TODO: 신고 API 연동
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">신고가 접수되었습니다</h2>
          <p className="text-on-surface-variant">
            신고 내용을 검토한 후 적절한 조치를 취하겠습니다. 검토에는 영업일 기준 1~3일이 소요될 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full bg-surface-container text-on-surface font-bold hover:bg-surface-container-high transition-colors"
            >
              돌아가기
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all"
            >
              홈으로
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-extrabold text-on-surface">콘텐츠 신고</h1>
            <p className="text-on-surface-variant text-sm">부적절한 콘텐츠를 신고해주세요.</p>
          </div>
        </div>

        {/* 대상 작품 */}
        {bookId && (
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-error flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-on-surface-variant">신고 대상</p>
              <p className="font-bold text-on-surface truncate">{bookTitle}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 신고 유형 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-on-surface">신고 유형 *</label>
            <div className="space-y-2">
              {REPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    category === cat.value
                      ? "border-error bg-error/5"
                      : "border-outline-variant/20 hover:border-outline-variant/40 bg-surface-container-lowest"
                  }`}
                >
                  <p className={`font-bold text-sm ${category === cat.value ? "text-error" : "text-on-surface"}`}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-on-surface">상세 내용</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="구체적인 문제 상황을 설명해주세요. (선택사항)"
              rows={5}
              className="w-full bg-surface-container-lowest border-2 border-outline-variant/20 rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary outline-none resize-none font-body transition-colors"
            />
            <p className="text-xs text-on-surface-variant text-right">{detail.length}/500</p>
          </div>

          {/* 안내 */}
          <div className="bg-surface-container-low rounded-2xl p-4 text-xs text-on-surface-variant space-y-1">
            <p className="font-bold text-on-surface text-sm">신고 시 유의사항</p>
            <p>• 허위 신고 시 서비스 이용이 제한될 수 있습니다.</p>
            <p>• 신고 내용은 운영팀만 확인할 수 있습니다.</p>
            <p>• 긴급한 경우 고객센터로 직접 연락해주세요.</p>
          </div>

          {/* 제출 */}
          <button
            type="submit"
            disabled={!category || submitting}
            className="w-full py-4 rounded-2xl bg-error text-on-error font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-error/25 transition-all"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-on-error border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                신고 접수하기
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
