import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, User, ArrowLeft, Save, Mail } from "lucide-react";
import { fetchUserMe, fetchWithAuth, isLoggedIn, type UserInfo } from "../lib/auth";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchUserMe().then((data) => {
      if (data) {
        setName(data.nickname);
        setEmail(data.email);
        setProfileImage(data.profileImage);
      }
      setLoading(false);
    });
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetchWithAuth('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: name, email }),
      });
      navigate("/profile");
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white transition-colors"
            >
              <ArrowLeft size={20} className="text-on-surface" />
            </button>
            <h1 className="text-3xl font-display font-bold">프로필 수정</h1>
          </div>

          <div className="glass-card rounded-3xl p-6 md:p-10 shadow-[0px_20px_40px_rgba(39,48,87,0.06)] border border-white/20">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Profile Picture Edit */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                    <img src="https://i.pravatar.cc/150?u=jang" alt="프로필" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={32} className="text-white drop-shadow-md" />
                  </div>
                </div>
                <p className="text-sm font-bold text-primary cursor-pointer hover:underline">사진 변경하기</p>
              </div>

              <div className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface ml-1 font-label">이름</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 pl-11 text-on-surface transition-all outline-none font-medium"
                      required
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface ml-1 font-label">이메일</label>
                  <div className="relative">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 pl-11 text-on-surface transition-all outline-none font-medium"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-4 glass rounded-xl font-bold hover:bg-white transition-all text-on-surface"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      저장하기
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
