import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, BookPlus, BookOpen, Menu, X, LogIn, Compass, Library, User as UserIcon, Home } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  };

  if (isReading) return null;

  const navLinks = [
    { to: "/explore", label: "갤러리", protected: false, icon: Compass },
    { to: "/library", label: "내 서재", protected: true, icon: Library },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background border-b border-primary/5 shadow-[0px_20px_40px_rgba(39,48,87,0.06)]">
        <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline tracking-tight">
            <BookOpen className="text-primary" size={28} />
            <span>Mongle</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.to}
                to={link.to} 
                onClick={(e) => link.protected ? handleProtectedClick(e, link.to) : null}
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
              <BookPlus size={18} />
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
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-primary/10 px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link to="/explore" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === "/explore" ? "text-primary" : "text-on-surface-variant")}>
            <Compass size={20} />
            <span className="text-[10px] font-bold">갤러리</span>
          </Link>
          <Link 
            to="/library" 
            onClick={(e) => handleProtectedClick(e, "/library")}
            className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === "/library" ? "text-primary" : "text-on-surface-variant")}
          >
            <Library size={20} />
            <span className="text-[10px] font-bold">내 서재</span>
          </Link>
          <Link 
            to="/create" 
            onClick={(e) => handleProtectedClick(e, "/create")}
            className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === "/create" ? "text-primary" : "text-on-surface-variant")}
          >
            <BookPlus size={20} />
            <span className="text-[10px] font-bold">동화 만들기</span>
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === "/profile" ? "text-primary" : "text-on-surface-variant")}>
              <div className={cn("w-5 h-5 rounded-full overflow-hidden border", location.pathname === "/profile" ? "border-primary" : "border-on-surface-variant")}>
                <img src="https://i.pravatar.cc/150?u=jang" alt="프로필" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold">마이</span>
            </Link>
          ) : (
            <Link to="/login" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === "/login" ? "text-primary" : "text-on-surface-variant")}>
              <LogIn size={20} />
              <span className="text-[10px] font-bold">로그인</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
