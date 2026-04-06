import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Palette, Heart, ChevronRight, Globe, FileText, LogOut, Settings } from "lucide-react";
import { MOCK_BOOKS } from "../constants";
import { logout, fetchUserMe, isLoggedIn, type UserInfo } from "../lib/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchUserMe().then((data) => {
      if (!data) {
        navigate("/login");
        return;
      }
      setUser(data);
      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
        <div className="glass p-6 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary shadow-2xl flex-shrink-0">
              <img src={user?.profileImage || "https://i.pravatar.cc/150?u=default"} alt="프로필" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform">
              <Palette size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold">{user?.nickname || "사용자"}</h1>
              <p className="text-on-surface-variant font-medium text-sm md:text-base">{user?.email}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 pt-4">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">12</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">만든 책</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">45</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">공유한 이야기</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold">1.2k</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">받은 좋아요</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button onClick={() => navigate("/profile/edit")} className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-secondary transition-all text-sm md:text-base">프로필 수정</button>
            <button className="px-6 py-3 glass rounded-xl font-bold hover:bg-white transition-all text-sm md:text-base">설정</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass p-6 md:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Heart size={20} className="text-red-500 fill-red-500" />
              좋아요 한 이야기
            </h3>
            <div className="space-y-4">
              {MOCK_BOOKS.slice(0, 2).map(book => (
                <div key={book.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 md:w-16 aspect-[3/4] rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold group-hover:text-primary transition-colors truncate text-sm md:text-base">{book.title}</h4>
                    <p className="text-[10px] md:text-xs text-on-surface-variant">{book.author} 작가</p>
                  </div>
                  <ChevronRight size={20} className="text-on-surface-variant flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 md:p-8 rounded-3xl space-y-6">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              계정 설정
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-white transition-all text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-on-surface-variant" />
                  <span className="font-medium">언어 설정</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-primary">한국어</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-white transition-all text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-on-surface-variant" />
                  <span className="font-medium">구독 플랜</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-primary">매직 프로</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-red-50 text-red-500 transition-all mt-4 text-sm md:text-base"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={20} />
                  <span className="font-bold">로그아웃</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
