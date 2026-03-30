import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, PlusCircle, Menu, X, LogIn } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isReading = location.pathname.startsWith('/read');

  useEffect(() => {
    const checkToken = () => {
      const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
      setIsLoggedIn(hasToken);
    };

    checkToken();
  }, [location]);

  const handleProtectedClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    
    if (!hasToken) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
    } else {
      navigate(target);
    }
    setIsMobileMenuOpen(false);
  };

  if (isReading) return null;

  const navLinks = [
    { to: "/explore", label: "갤러리", protected: false },
    { to: "/library", label: "내 서재", protected: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(39,48,87,0.06)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
          StoryMagic
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.to}
              to={link.to} 
              onClick={(e) => link.protected ? handleProtectedClick(e, link.to) : setIsMobileMenuOpen(false)}
              className={cn(
                "text-on-surface hover:text-primary transition-colors font-label font-medium", 
                location.pathname === link.to ? "text-primary" : "text-on-surface"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/create" 
            onClick={(e) => handleProtectedClick(e, "/create")}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 duration-200 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            동화 만들기
          </Link>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                <img src="https://i.pravatar.cc/150?u=jang" alt="프로필" className="w-full h-full object-cover" />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-surface-container-high text-primary px-6 py-2.5 rounded-full font-bold hover:bg-white transition-all shadow-sm active:scale-95"
              >
                <LogIn size={18} />
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-white/20">
              {navLinks.map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={(e) => link.protected ? handleProtectedClick(e, link.to) : setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-bold p-2 rounded-xl transition-colors", 
                    location.pathname === link.to ? "bg-primary/10 text-primary" : "text-on-surface"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/create" 
                onClick={(e) => handleProtectedClick(e, "/create")}
                className="flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-2xl font-bold shadow-lg"
              >
                <PlusCircle size={20} />
                동화 만들기
              </Link>

              <div className="h-px bg-on-surface-variant/10 my-2" />

              {isLoggedIn ? (
                <Link 
                  to="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                    <img src="https://i.pravatar.cc/150?u=jang" alt="프로필" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-on-surface text-lg">내 프로필</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-surface-container-high text-primary py-4 rounded-2xl font-bold"
                >
                  <LogIn size={20} />
                  로그인
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
