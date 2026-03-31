import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { STYLES } from "../constants";
import { IllustrationStyle, StoryWizardState } from "../types";

const WizardPage = () => {
  const [step, setStep] = React.useState(1);
  const [state, setState] = React.useState<StoryWizardState>({
    pageCount: 12,
    style: 'watercolor',
    prompt: '',
    title: ''
  });

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 magical-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm md:text-base",
                step === s ? "bg-primary text-white scale-110 shadow-lg" : 
                step > s ? "bg-green-500 text-white" : "glass text-on-surface-variant"
              )}>
                {s}
              </div>
              <span className={cn("font-bold text-[10px] md:text-sm uppercase tracking-widest", step === s ? "text-primary" : "text-on-surface-variant")}>
                {s === 1 ? "컨셉" : s === 2 ? "스토리" : "검토"}
              </span>
              {s < 3 && <div className="w-12 md:w-20 h-[2px] bg-on-surface-variant/10" />}
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 md:p-12 rounded-3xl space-y-8 md:space-y-10"
        >
          {step === 1 && (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-bold">아이디어를 현실로 만들어보세요</h2>
                <p className="text-on-surface-variant text-sm md:text-base">만들고 싶은 세계에 대해 알려주세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">페이지 수</label>
                  <div className="flex gap-2">
                    {[12, 24, 32].map(count => (
                      <button
                        key={count}
                        onClick={() => setState({...state, pageCount: count})}
                        className={cn(
                          "flex-1 py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base",
                          state.pageCount === count ? "bg-primary text-white shadow-lg" : "bg-surface-container-low hover:bg-white"
                        )}
                      >
                        {count} 페이지
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">일러스트 스타일</label>
                  <select 
                    value={state.style}
                    onChange={(e) => setState({...state, style: e.target.value as IllustrationStyle})}
                    className="w-full p-3 md:p-4 rounded-xl bg-surface-container-low font-bold border-none focus:ring-2 focus:ring-primary outline-none text-sm md:text-base"
                  >
                    {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">스토리 프롬프트</label>
                <textarea 
                  placeholder="예: 구름 속에 숨겨진 도시를 발견하는 용감한 작은 다람쥐 이야기..."
                  className="w-full h-32 md:h-40 p-4 md:p-6 rounded-2xl bg-surface-container-low font-medium border-none focus:ring-2 focus:ring-primary outline-none resize-none text-sm md:text-base"
                  value={state.prompt}
                  onChange={(e) => setState({...state, prompt: e.target.value})}
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!state.prompt}
                className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                스토리 생성 시작하기
              </button>
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center py-12 md:py-20 text-center space-y-8">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20 border-t-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <Sparkles size={32} className="md:w-10 md:h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold">마법을 엮는 중이에요...</h3>
                <p className="text-on-surface-variant text-sm md:text-base">AI가 당신만의 독특한 이야기를 만들고 일러스트를 그리고 있어요.</p>
              </div>
              <button onClick={() => setStep(3)} className="text-primary font-bold hover:underline text-sm">건너뛰기 (데모)</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                  <img src="https://picsum.photos/seed/preview/300/400" alt="미리보기" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-display font-bold">구름 다람쥐</h2>
                  <p className="text-on-surface-variant text-sm md:text-base">장찬영 작가 • 12 페이지 • 마법 수채화</p>
                </div>
              </div>
              <div className="p-4 md:p-6 bg-surface-container-low rounded-2xl">
                <p className="italic text-on-surface-variant text-sm md:text-base leading-relaxed">"거대한 참나무의 가장 높은 가지에, 구름을 만지는 꿈을 꾸는 너티라는 다람쥐가 살고 있었습니다. 어느 날, 하늘에서 황금 잎사귀가 떨어졌습니다..."</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep(1)} className="flex-1 glass py-4 md:py-5 rounded-2xl font-bold text-sm md:text-base">컨셉 수정</button>
                <Link to="/library" className="flex-1 bg-primary text-white py-4 md:py-5 rounded-2xl font-bold text-center shadow-xl hover:bg-secondary text-sm md:text-base">서재에 저장하기</Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WizardPage;
