import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Palette, BookOpen } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const featuredBooks = [
    {
      title: "속삭이는 버드나무",
      author: "사라 젠킨스",
      pages: 24,
      style: "마법 수채화",
      image: "https://picsum.photos/seed/magic1/800/1000"
    },
    {
      title: "구름 위의 고래",
      author: "김민준",
      pages: 18,
      style: "몽환적 유화",
      image: "https://picsum.photos/seed/magic2/800/1000"
    },
    {
      title: "별빛 여우의 여행",
      author: "이서연",
      pages: 32,
      style: "파스텔 일러스트",
      image: "https://picsum.photos/seed/magic3/800/1000"
    }
  ];

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    
    if (!hasToken) {
      if (window.confirm("로그인이 필요한 서비스예요. 로그인 페이지로 이동하시겠어요?")) {
        navigate("/login");
      }
    } else {
      navigate("/create");
    }
  };

  return (
    <div className="min-h-screen pt-24 magical-gradient relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none storybook-bg" />

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest font-label">
            <Sparkles size={16} />
            AI 기반 스토리텔링
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-extrabold leading-tight md:leading-tight max-w-4xl mx-auto text-on-surface tracking-tight">
            AI로 당신만의 <br /> <span className="text-primary italic">마법 같은</span> 동화책을 만들어보세요
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-body font-medium">
            아이의 상상력이 현실이 되는 공간이에요. 몇 번의 클릭만으로 고퀄리티 일러스트와 함께 나만의 이야기를 완성해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link 
              to="/create" 
              onClick={handleCreateClick}
              className="px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              지금 시작하기
            </Link>
            <Link to="/explore" className="px-10 py-5 glass-card text-on-surface rounded-full text-lg font-bold hover:bg-white transition-all hover:-translate-y-1 active:scale-95 border border-white/20">
              갤러리 둘러보기
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-16 md:mt-24 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredBooks.map((book, index) => (
            <div 
              key={index}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white text-left">
                  <h3 className="text-xl md:text-2xl font-headline font-bold mb-1">{book.title}</h3>
                  <p className="text-white/80 text-xs md:text-sm font-body">
                    {book.author} • {book.pages} 페이지 • {book.style}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="bg-surface-container-lowest py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">AI 스토리텔링</h4>
              <p className="text-on-surface-variant font-body">간단한 키워드만으로 풍부하고 교훈적인 이야기를 생성해요.</p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Palette size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">마법 수채화</h4>
              <p className="text-on-surface-variant font-body">수채화부터 유화까지, AI가 그리는 마법 같은 일러스트레이션이에요.</p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl glass-card border border-white/20">
              <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                <BookOpen size={32} />
              </div>
              <h4 className="text-2xl font-headline font-bold text-on-surface">실물 도서 제작</h4>
              <p className="text-on-surface-variant font-body">디지털을 넘어 실제 하드커버 책으로 간직할 수 있어요.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
