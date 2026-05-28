import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, HelpCircle, FileText } from 'lucide-react';

interface QuestionAreaProps {
  question: Question;
  selectedAnswer: string | string[];
  isCorrect: boolean;
  hasIncorrectAttempt: boolean;
  onAnswerSubmit: (answer: string | string[]) => void;
  // Navigation
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  textScale: 'sm' | 'base' | 'lg' | 'xl';
  onTextScaleChange: (scale: 'sm' | 'base' | 'lg' | 'xl') => void;
}

export default function QuestionArea({
  question,
  selectedAnswer,
  isCorrect,
  hasIncorrectAttempt,
  onAnswerSubmit,
  onPrev,
  onNext,
  isFirst,
  isLast,
  textScale,
  onTextScaleChange,
}: QuestionAreaProps) {
  // Local state for multiple selection
  const [multiSelection, setMultiSelection] = useState<string[]>([]);

  // Update multiple selection when question changes or when selectedAnswer is updated
  useEffect(() => {
    if (question.type === 'pilihan-ganyak') {
      if (Array.isArray(selectedAnswer)) {
        setMultiSelection(selectedAnswer);
      } else {
        setMultiSelection([]);
      }
    }
  }, [question, selectedAnswer]);

  // Determine material category based on question ID
  const getCategory = (id: number): { label: string; color: string } => {
    if (id <= 4 || id === 21 || id === 26) {
      return { label: 'Akhlak Terpuji: Tawadhu', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    } else if (id <= 7 || id === 22 || id === 27) {
      return { label: 'Akhlak Terpuji: Tasamuh', color: 'bg-indigo-50 text-indigo-705 border-indigo-200 text-indigo-700' };
    } else if (id <= 10 || id === 23 || id === 28) {
      return { label: 'Akhlak Terpuji: Ta\'awun', color: 'bg-amber-50 text-amber-705 border-amber-200 text-amber-700' };
    } else if (id <= 13 || id === 24 || id === 29) {
      return { label: 'Adab Media Sosial', color: 'bg-sky-50 text-sky-700 border-sky-200' };
    } else {
      return { label: 'Keteladanan Abu Bakar As-Siddiq', color: 'bg-violet-50 text-violet-700 border-violet-200' };
    }
  };

  const category = getCategory(question.id);

  // Text scaling mapping
  const getTextClass = () => {
    switch (textScale) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getHeadingClass = () => {
    switch (textScale) {
      case 'sm': return 'text-base';
      case 'lg': return 'text-xl';
      case 'xl': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  const handleSingleClick = (key: string) => {
    if (isCorrect || hasIncorrectAttempt) return; // Locked once answered
    onAnswerSubmit(key);
  };

  const handleCheckboxToggle = (key: string) => {
    if (isCorrect || hasIncorrectAttempt) return; // Locked once answered
    setMultiSelection(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key].sort();
      }
    });
  };

  const handleMultiSubmit = () => {
    onAnswerSubmit(multiSelection);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-col justify-between min-h-[500px]">
      
      {/* Question Header & Font Resizer */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 px-3 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded-full border border-blue-200">
              UJI-{question.id.toString().padStart(2, '0')}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${category.color}`}>
              {category.label}
            </span>
          </div>

          {/* Size Changer */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-1 sm:block hidden">Ukuran Soal:</span>
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-1">
              {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                <button
                  id={`btn-scale-${sz}`}
                  key={sz}
                  onClick={() => onTextScaleChange(sz)}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    textScale === sz 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {sz === 'base' ? 'A' : sz === 'sm' ? 'A-' : sz === 'lg' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Panel */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
              {question.id}
            </div>
            <p className={`${getHeadingClass()} font-semibold text-slate-800 leading-relaxed`}>
              {question.questionText}
            </p>
          </div>

          {question.type === 'pilihan-ganyak' && (
            <div className="ml-10 mt-2 p-2 px-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-blue-500" />
              <span>Petunjuk: Pilihlah dari satu atau lebih jawaban yang benar, lalu klik tombol "Kirim Jawaban".</span>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pl-0 sm:pl-10">
          {question.options.map((option) => {
            const isSelected = question.type === 'pilihan-ganyak'
              ? multiSelection.includes(option.key)
              : selectedAnswer === option.key;

            const isOptionCorrect = question.type === 'pilihan-ganyak'
              ? Array.isArray(question.correctKey) && question.correctKey.includes(option.key)
              : question.correctKey === option.key;

            // Compute option styles
            let optionStyles = 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/40';
            let badgeStyles = 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500';

            if (isCorrect) {
              if (isOptionCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium pointer-events-none';
                badgeStyles = 'bg-emerald-600 text-white border-emerald-500 shadow-sm';
              } else if (isSelected) {
                optionStyles = 'border-red-200 bg-red-50 text-slate-500 opacity-60 pointer-events-none';
                badgeStyles = 'bg-red-500 text-white border-red-500';
              } else {
                optionStyles = 'border-slate-200 bg-slate-50 opacity-50 text-slate-400 pointer-events-none';
                badgeStyles = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            } else if (hasIncorrectAttempt) {
              if (isOptionCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-medium pointer-events-none';
                badgeStyles = 'bg-emerald-600 text-white border-emerald-500 shadow-sm';
              } else if (isSelected) {
                optionStyles = 'border-red-300 bg-red-50/80 text-red-950 font-medium pointer-events-none';
                badgeStyles = 'bg-red-650 text-white border-red-500 shadow-sm bg-red-600';
              } else {
                optionStyles = 'border-slate-200 bg-slate-50 opacity-40 text-slate-400 pointer-events-none';
                badgeStyles = 'bg-slate-100 text-slate-400 border-slate-250 opacity-60';
              }
            } else if (isSelected) {
              optionStyles = 'border-blue-500 bg-blue-50/40 text-blue-900';
              badgeStyles = 'bg-blue-600 text-white border-blue-600';
            }

            return (
              <div
                id={`option-container-${question.id}-${option.key}`}
                key={option.key}
                onClick={() => {
                  if (question.type === 'pilihan-ganyak') {
                    handleCheckboxToggle(option.key);
                  } else {
                    handleSingleClick(option.key);
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 text-left leading-snug group ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  {/* Bubble badge prefix (A, B, C...) */}
                  <div className={`h-8 w-8 rounded-lg font-bold font-mono text-sm flex items-center justify-center shrink-0 border transition-all ${badgeStyles}`}>
                    {option.key}
                  </div>
                  <span className={`${getTextClass()} text-slate-800`}>{option.text}</span>
                </div>

                {/* Status Indicator */}
                {question.type === 'pilihan-ganyak' ? (
                  <input
                    id={`checkbox-option-${question.id}-${option.key}`}
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 pointer-events-none"
                  />
                ) : (
                  (isCorrect || hasIncorrectAttempt) ? (
                    isOptionCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 pointer-events-none" />
                    ) : (
                      isSelected && <XCircle className="w-5 h-5 text-red-600 shrink-0 pointer-events-none" />
                    )
                  ) : null
                )}
              </div>
            );
          })}
        </div>

        {/* Multi Answer Submissions Banner */}
        {question.type === 'pilihan-ganyak' && !isCorrect && !hasIncorrectAttempt && (
          <div className="pl-0 sm:pl-10 mt-5">
            <button
              id={`btn-submit-${question.id}`}
              onClick={handleMultiSubmit}
              disabled={multiSelection.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all uppercase cursor-pointer flex items-center justify-center gap-2 ${
                multiSelection.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-400 border border-slate-250 cursor-not-allowed'
              }`}
            >
              Kirim Jawaban ({multiSelection.length} Terpilih)
            </button>
          </div>
        )}

        {/* Status Alerts and Materia Explanation Panel */}
        <div className="mt-6 space-y-4 pl-0 sm:pl-10">
          {isCorrect && (
            <div id={`correct-banner-${question.id}`} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-emerald-800">✅ Jawaban Anda Benar</p>
                <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                  Pertanyaan berhasil diselesaikan. Mengarahkan otomatis ke soal berikutnya...
                </p>
              </div>
            </div>
          )}

          {hasIncorrectAttempt && !isCorrect && (
            <div id={`incorrect-banner-${question.id}`} className="space-y-3">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 animate-shake">
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-red-800">❌ Jawaban Anda Salah</p>
                  <p className="text-xs text-red-700/90 mt-1 leading-relaxed">
                    Jawaban Anda telah disimpan. Sila telaah penjelasan materi di bawah ini. Mengarahkan otomatis ke soal berikutnya...
                  </p>
                </div>
              </div>

              {/* Live study guide / Corrective Material */}
              <div id={`explanation-box-${question.id}`} className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300 text-slate-800 shadow-sm">
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-amber-200/50">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-805 uppercase tracking-widest font-mono">Bahan Koreksi & Penjelasan</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                  {question.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Footer Navigation */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 gap-3">
        <button
          id="btn-prev-question"
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            isFirst 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 active:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> SEBELUMNYA
        </button>

        <span className="text-xs font-mono font-bold text-slate-500 tracking-widest sm:block hidden">
          AKIDAH AKHLAK VIII
        </span>

        <button
          id="btn-next-question"
          onClick={onNext}
          disabled={isLast}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            isLast 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' 
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 active:bg-slate-100'
          }`}
        >
          BERIKUTNYA <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
