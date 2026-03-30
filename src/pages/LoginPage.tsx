import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Lock, MessageCircle } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Set a mock token in cookies
    document.cookie = "token=mock_token; path=/; max-age=3600";
    navigate("/");
    window.location.reload(); // Refresh to update navbar state
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인은 현재 준비 중입니다.`);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-surface font-body text-on-surface">
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center relative pt-20 pb-12 px-6">
        {/* Storybook Background Atmosphere */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-BOjPd2NLrVS5sE-5ZN7YWo3Y5QbPQAPT7_bOwJPcnmoVrxT4d9i4_SnN6Y88uXp75QO_VQn_qcxq1AzpF6xrW9VJYn_twsEPKDbAWTB99JIH3YZDc4C5ENtV43qZek7Q7dQdyDnx8okJHSZu9WzbCk16v3hmn2IVXhPmuJxoF_J-7J2pSyp3zpUN9erkCujXGobAl-4czmAPpH5lC_II2Zfy03AtX9xmbPk5lJkdAEM0t1A3-Is_vJb9LrWSi9rcF-QYrH94g1VZ')", 
            backgroundSize: "cover" 
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Login Card */}
          <div className="glass-card rounded-xl p-8 md:p-10 shadow-[0px_20px_40px_rgba(39,48,87,0.06)] border border-white/20">
            <div className="text-center mb-8">
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">다시 오신 것을 환영합니다</h1>
              <p className="text-on-surface-variant text-sm font-medium">마법 같은 이야기를 계속 만들어보세요</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Input: Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface ml-1 font-label">이메일 또는 사용자 이름</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none" 
                    placeholder="dreamer@magic.com" 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={20} />
                </div>
              </div>
              
              {/* Input: Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-on-surface font-label">비밀번호</label>
                  <Link to="#" className="text-xs font-semibold text-primary hover:underline">비밀번호를 잊으셨나요?</Link>
                </div>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={20} />
                </div>
              </div>
              
              {/* Primary Action */}
              <button 
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all" 
                type="submit"
              >
                로그인
              </button>
            </form>
            
            {/* Social Login Section */}
            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/20"></div>
                </div>
                <span className="relative bg-white px-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest font-label">소셜 계정으로 로그인</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Naver */}
                <button 
                  onClick={() => handleSocialLogin("네이버")}
                  className="flex items-center justify-center gap-2 bg-[#03C75A] text-white py-3 rounded-lg hover:brightness-95 active:scale-95 transition-all font-bold text-sm"
                >
                  <span className="w-5 h-5 flex items-center justify-center font-black text-xs border border-white rounded-sm">N</span>
                  네이버
                </button>
                {/* Kakao */}
                <button 
                  onClick={() => handleSocialLogin("카카오")}
                  className="flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] py-3 rounded-lg hover:brightness-95 active:scale-95 transition-all font-bold text-sm"
                >
                  <MessageCircle size={20} fill="currentColor" />
                  카카오
                </button>
              </div>
            </div>
            
            {/* Footer Link */}
            <p className="text-center mt-8 text-on-surface-variant text-sm font-medium">
              처음이신가요? <Link className="text-primary font-bold hover:underline" to="/signup">회원가입</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;
