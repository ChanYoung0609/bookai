import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Wand2, Image as ImageIcon } from "lucide-react";
import { fetchMyBooks, type MyBookItem } from "../lib/api";

type LibraryTab = "working" | "completed" | "liked";

const PAGE_SIZE = 30;

const statusLabel: Record<MyBookItem["status"], string> = {
  DRAFT: "제작중",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

const tabLabel: Record<LibraryTab, string> = {
  working: "제작 중인 책",
  completed: "완성된 책",
  liked: "좋아요 한 책",
};

const progressByStatus: Record<MyBookItem["status"], number> = {
  DRAFT: 15,
  IN_PROGRESS: 55,
  COMPLETED: 100,
};

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<LibraryTab>("working");

  const [draftBooks, setDraftBooks] = useState<MyBookItem[]>([]);
  const [inProgressBooks, setInProgressBooks] = useState<MyBookItem[]>([]);
  const [completedBooks, setCompletedBooks] = useState<MyBookItem[]>([]);

  const [draftPage, setDraftPage] = useState(0);
  const [inProgressPage, setInProgressPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);

  const [hasMoreDraft, setHasMoreDraft] = useState(false);
  const [hasMoreInProgress, setHasMoreInProgress] = useState(false);
  const [hasMoreCompleted, setHasMoreCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);

    try {
      const [draft, inProgress, completed] = await Promise.all([
        fetchMyBooks(0, PAGE_SIZE, "DRAFT"),
        fetchMyBooks(0, PAGE_SIZE, "IN_PROGRESS"),
        fetchMyBooks(0, PAGE_SIZE, "COMPLETED"),
      ]);

      setDraftBooks(draft.content ?? []);
      setInProgressBooks(inProgress.content ?? []);
      setCompletedBooks(completed.content ?? []);

      setDraftPage(0);
      setInProgressPage(0);
      setCompletedPage(0);

      setHasMoreDraft(!draft.last);
      setHasMoreInProgress(!inProgress.last);
      setHasMoreCompleted(!completed.last);
    } catch (e) {
      setError(e instanceof Error ? e.message : "내 책 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInitial();
  }, []);

  const workingBooks = useMemo(() => [...draftBooks, ...inProgressBooks], [draftBooks, inProgressBooks]);

  const visibleBooks = useMemo(() => {
    if (activeTab === "working") return workingBooks;
    if (activeTab === "completed") return completedBooks;
    return [] as MyBookItem[];
  }, [activeTab, workingBooks, completedBooks]);

  const hasMore = useMemo(() => {
    if (activeTab === "working") return hasMoreDraft || hasMoreInProgress;
    if (activeTab === "completed") return hasMoreCompleted;
    return false;
  }, [activeTab, hasMoreDraft, hasMoreInProgress, hasMoreCompleted]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      if (activeTab === "working") {
        const tasks: Promise<void>[] = [];

        if (hasMoreDraft) {
          const nextDraftPage = draftPage + 1;
          tasks.push(
            fetchMyBooks(nextDraftPage, PAGE_SIZE, "DRAFT").then((res) => {
              setDraftBooks((prev) => [...prev, ...(res.content ?? [])]);
              setDraftPage(nextDraftPage);
              setHasMoreDraft(!res.last);
            })
          );
        }

        if (hasMoreInProgress) {
          const nextProgressPage = inProgressPage + 1;
          tasks.push(
            fetchMyBooks(nextProgressPage, PAGE_SIZE, "IN_PROGRESS").then((res) => {
              setInProgressBooks((prev) => [...prev, ...(res.content ?? [])]);
              setInProgressPage(nextProgressPage);
              setHasMoreInProgress(!res.last);
            })
          );
        }

        await Promise.all(tasks);
      } else if (activeTab === "completed" && hasMoreCompleted) {
        const nextPage = completedPage + 1;
        const res = await fetchMyBooks(nextPage, PAGE_SIZE, "COMPLETED");
        setCompletedBooks((prev) => [...prev, ...(res.content ?? [])]);
        setCompletedPage(nextPage);
        setHasMoreCompleted(!res.last);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록을 더 불러오지 못했습니다.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-[#f4f4fa]">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e2e66] tracking-tight">나의 책</h1>
              <p className="text-[#5a6595] max-w-2xl text-sm md:text-base">
                상상의 날개를 펼쳐 제작 중인 이야기들을 확인하세요. AI 아틀리에에서 당신만의 동화가 탄생하고 있습니다.
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-[#6f82dc] hover:bg-[#6074d0] text-white px-6 py-3 rounded-full font-bold shadow"
            >
              <Plus size={18} />
              새 책 만들기
            </Link>
          </div>

          <div className="flex items-center gap-6 border-b border-[#dde1f2]">
            {(["working", "completed", "liked"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-1 text-sm md:text-lg font-bold transition-colors border-b-4 ${
                  activeTab === tab
                    ? "text-[#4862d3] border-[#4862d3]"
                    : "text-[#2d3f80] border-transparent hover:text-[#4862d3]"
                }`}
              >
                {tabLabel[tab]}
              </button>
            ))}
          </div>
        </section>

        {loading && <p className="text-[#5a6595]">책 목록을 불러오는 중...</p>}

        {!loading && (
          <>
            {error && (
              <div className="flex items-center gap-3">
                <p className="text-red-600 font-bold">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadInitial()}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#d9dff7] text-sm font-bold"
                >
                  다시 시도
                </button>
              </div>
            )}

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTab === "working" && (
                <Link
                  to="/create"
                  className="rounded-[32px] border-2 border-dashed border-[#d3daf8] bg-white/40 min-h-[360px] flex items-center justify-center text-center p-7 hover:bg-white/70 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#e5e9fb] text-[#5f72c8] mx-auto flex items-center justify-center">
                      <Wand2 size={22} />
                    </div>
                    <h3 className="text-3xl font-bold text-[#1e2e66]">새로운 이야기 시작</h3>
                    <p className="text-sm text-[#6673a8]">AI와 함께 마법 같은 동화 속으로 떠나볼까요?</p>
                  </div>
                </Link>
              )}

              {visibleBooks.map((book) => {
                const progress = progressByStatus[book.status];
                return (
                  <Link key={book.bookId} to={`/book/${book.bookId}`} className="rounded-[32px] overflow-hidden bg-white shadow-sm hover:-translate-y-1 transition-transform">
                    <div className="aspect-[4/3] bg-[#dde2f6]">
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a6b0db]">
                          <ImageIcon size={30} />
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3.5">
                      <h4 className="text-[30px] leading-tight font-bold text-[#1e2e66] truncate">{book.title}</h4>
                      <p className="text-sm text-[#6673a8]">{book.authorName} · {statusLabel[book.status]}</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-[#4d5fb7]">
                          <span>진행률</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#e6e9f7] overflow-hidden">
                          <div className="h-full bg-[#576bd0]" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {activeTab === "liked" && (
                <div className="col-span-full text-center py-16 text-[#6673a8]">좋아요 한 책 기능은 곧 연결될 예정이에요.</div>
              )}

              {activeTab !== "liked" && visibleBooks.length === 0 && (
                <div className="col-span-full text-center py-16 text-[#6673a8]">표시할 책이 없어요.</div>
              )}
            </section>

            {activeTab !== "liked" && hasMore && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="px-5 py-2 rounded-full bg-white border border-[#d9dff7] text-sm font-bold text-[#2d3f80] disabled:opacity-60"
                >
                  {loadingMore ? "불러오는 중..." : "더 보기"}
                </button>
              </div>
            )}

            <section className="rounded-[34px] bg-[#e9ebf8] p-10 text-center space-y-4">
              <h3 className="text-3xl font-extrabold text-[#1f2f67]">영감이 필요한가요?</h3>
              <p className="text-[#6270a8]">다른 작가들의 이야기를 둘러보고 새로운 영감을 얻어보세요.</p>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#cfd7ff] text-[#23357b] font-bold hover:bg-[#c0cbfd]"
              >
                둘러보기
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
