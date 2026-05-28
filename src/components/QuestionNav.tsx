import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionNavProps {
  questions: Question[];
  totalQuestions: number;
  currentIndex: number;
  correctStatus: { [qId: number]: boolean };
  incorrectAttempts: { [qId: number]: boolean };
  onNavigate: (index: number) => void;
}

export default function QuestionNav({
  questions,
  totalQuestions,
  currentIndex,
  correctStatus,
  incorrectAttempts,
  onNavigate,
}: QuestionNavProps) {
  
  // Categorize questions into sections
  const getSection = (number: number) => {
    const q = questions.find(quest => quest.id === number);
    if (!q) return 'PILIHAN GANDA';
    if (q.type === 'pilihan-ganda') return 'PILIHAN GANDA';
    if (q.type === 'benar-salah') return 'BENAR / SALAH';
    return 'GANDA KOMPLEKS';
  };

  const pgNumbers = questions.filter(q => q.type === 'pilihan-ganda').map(q => q.id);
  const bsNumbers = questions.filter(q => q.type === 'benar-salah').map(q => q.id);
  const pkNumbers = questions.filter(q => q.type === 'pilihan-ganyak').map(q => q.id);

  const getButtonClass = (number: number) => {
    const isCurrent = currentIndex === questions.findIndex(q => q.id === number);
    const isCorrect = correctStatus[number] === true;
    const hasError = incorrectAttempts[number] === true;

    let base = "h-11 w-11 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-150 border-2 shadow-sm relative cursor-pointer ";
    
    if (isCurrent) {
      base += "ring-4 ring-blue-300 ring-offset-1 border-blue-600 scale-105 z-10 ";
    }

    if (isCorrect) {
      base += "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700";
    } else if (hasError) {
      base += "bg-red-500 border-red-650 text-white hover:bg-red-600";
    } else {
      base += "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50";
    }

    return base;
  };

  const renderSectionGrid = (numbers: number[], title: string, subtitle: string) => (
    <div className="mb-5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
      <div className="flex flex-col mb-2.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <button
            id={`btn-nav-question-${num}`}
            key={num}
            onClick={() => onNavigate(questions.findIndex(q => q.id === num))}
            className={getButtonClass(num)}
            title={`Buka Soal Nomor ${num} (${getSection(num)})`}
          >
            {num}
            {/* Miniature absolute status dot if answered */}
            {correctStatus[num] && (
              <span className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-white"></span>
            )}
            {!correctStatus[num] && incorrectAttempts[num] && (
              <span className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-white"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
      {/* Nav Card Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">NAVIGASI SOAL</h3>
          <p className="text-[10px] text-slate-400">Pilih nomor soal untuk melompat</p>
        </div>
        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-105">
          Z-01
        </span>
      </div>

      {/* Grid segments */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto no-scrollbar">
        {renderSectionGrid(pgNumbers, "1. PILIHAN GANDA", "Opsi Tunggal (25 Soal)")}
        {renderSectionGrid(bsNumbers, "2. BENAR / SALAH", "Pernyataan Benar / Salah (2 Soal)")}
        {renderSectionGrid(pkNumbers, "3. GANDA KOMPLEKS", "Pilihan Ganda Kompleks (3 Soal)")}
      </div>

      {/* CBT Legend indicators description */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-emerald-600 rounded border border-emerald-700 shrink-0"></div>
          <span>Salah Satu Pilihan Benar (Menyelesaikan Soal)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-red-500 rounded border border-red-600 shrink-0"></div>
          <span>Jawaban Keliru (Silakan pelajari materi / coba lagi)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white rounded border border-slate-200 shrink-0"></div>
          <span>Belum Dijawab / Menunggu Umpan Balik</span>
        </div>
      </div>
    </div>
  );
}
