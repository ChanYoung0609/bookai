import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { setAccessToken } from "../lib/auth";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isNewUser = searchParams.get("isNewUser") === "true";

    if (!accessToken) {
      setError(true);
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    // 토큰 저장
    setAccessToken(accessToken);

    // 축하 효과
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#ec4899"],
    });

    // 로그인 성공 후 홈으로 이동
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass-card rounded-2xl p-12 shadow-2xl border border-white/30 flex flex-col items-center">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-headline font-black text-on-surface mb-2">
              로그인 실패
            </h2>
            <p className="text-on-surface-variant font-medium">
              다시 시도해주세요. <br /> 로그인 페이지로 이동합니다.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="glass-card rounded-2xl p-12 shadow-2xl border border-white/30 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-headline font-black text-on-surface mb-2">
            반가워요!
          </h2>
          <p className="text-on-surface-variant font-medium">
            로그인에 성공했습니다. <br /> 곧 마법의 숲으로 안내할게요.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthCallbackPage;
