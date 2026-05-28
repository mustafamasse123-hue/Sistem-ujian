import React, { useState, useEffect } from 'react';
import { Question, WelcomeScreenConfig } from './types';
import { questionsData } from './questionsData';
import { soundSynth } from './utils/audio';

import WelcomeScreen from './components/WelcomeScreen';
import CbtHeader from './components/CbtHeader';
import QuestionArea from './components/QuestionArea';
import QuestionNav from './components/QuestionNav';
import SummaryScreen from './components/SummaryScreen';
import AdminPanel from './components/AdminPanel';
import KioskLockdown from './components/KioskLockdown';
import CheatingWarning from './components/CheatingWarning';
import PowerButton from './components/PowerButton';

import { BookOpen, PanelRight, PanelRightClose } from 'lucide-react';

// Helper to shuffle a single question's options and map correct keys
function shuffleQuestion(q: Question): Question {
  if (q.type === 'benar-salah') {
    return { ...q };
  }

  // 1. Memorize which prompt/texts are correct
  const correctOptionTexts: string[] = [];
  if (Array.isArray(q.correctKey)) {
    q.correctKey.forEach(k => {
      const opt = q.options.find(o => o.key === k);
      if (opt) correctOptionTexts.push(opt.text);
    });
  } else {
    const opt = q.options.find(o => o.key === q.correctKey);
    if (opt) correctOptionTexts.push(opt.text);
  }

  // 2. Shuffle the options array using Fisher-Yates
  const shuffledOptionsCopy = [...q.options];
  for (let i = shuffledOptionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptionsCopy[i], shuffledOptionsCopy[j]] = [shuffledOptionsCopy[j], shuffledOptionsCopy[i]];
  }

  // 3. Re-assign keys sequentially (A, B, C, D, E)
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const finalOptions = shuffledOptionsCopy.map((opt, idx) => ({
    key: alphabet[idx] || String.fromCharCode(65 + idx),
    text: opt.text
  }));

  // 4. Identify the new keys for correct options
  const newCorrectKeys: string[] = [];
  finalOptions.forEach(opt => {
    if (correctOptionTexts.includes(opt.text)) {
      newCorrectKeys.push(opt.key);
    }
  });

  // 5. Update correctKey
  let finalCorrectKey: string | string[];
  if (q.type === 'pilihan-ganyak') {
    finalCorrectKey = newCorrectKeys.sort();
  } else {
    finalCorrectKey = newCorrectKeys[0] || 'A';
  }

  return {
    ...q,
    options: finalOptions,
    correctKey: finalCorrectKey
  };
}

// Helper to shuffle the entire question bank and their options
function shuffleQuestionsAndOptions(questionsList: Question[]): Question[] {
  // First shuffle the options of each question
  const qsCopy = questionsList.map(q => shuffleQuestion(q));

  // Then shuffle the order of the questions list using Fisher-Yates
  for (let i = qsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qsCopy[i], qsCopy[j]] = [qsCopy[j], qsCopy[i]];
  }
  return qsCopy;
}

export default function App() {
  // Admin Portal State
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Dynamic question bank state loaded from local storage
  const [questions, setQuestions] = useState<Question[]>(() => {
    const stored = localStorage.getItem('cbt_questions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored questions', e);
      }
    }
    return questionsData;
  });

  // Save questions when bank changes
  useEffect(() => {
    localStorage.setItem('cbt_questions', JSON.stringify(questions));
  }, [questions]);

  // Dynamic Welcome Screen layout config loaded from local storage
  const defaultWelcomeConfig: WelcomeScreenConfig = {
    headerText: 'CBT MADRASAH',
    subheadText: 'Akidah Akhlak VIII',
    titleText: 'Asesmen Materi Akidah Akhlak',
    descriptionText: 'Ujian CBT interaktif mencakup pokok pembahasan Akidah Akhlak Kelas VIII MTs: Tawadhu, Tasamuh, Ta\'awun, Adab Media Sosial, dan Kisah Keteladanan Abu Bakar As-Siddiq R.A.',
    classes: ['Kelas VIII A', 'Kelas VIII B', 'Kelas VIII C', 'Kelas VIII D'],
    rules: [
      'Pilihan Ganda: Langsung memilih satu opsi terbaik.',
      'Benar / Salah: Menilai kebenaran pernyataan.',
      'Pilihan Banyak: Memilih kombinasi jawaban yang benar.',
      'Sistem Koreksi Aktif: Anda harus dapat menjawab benar untuk lanjut ke soal berikutnya.'
    ],
    footerText: 'Sistem Ujian Computer Based Test (CBT) Akidah Akhlak MTs v2.4. © 2026 Kementerian Agama RI.'
  };

  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeScreenConfig>(() => {
    const stored = localStorage.getItem('cbt_welcome_config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse welcome config', e);
      }
    }
    return defaultWelcomeConfig;
  });

  // Save Welcome Config on change
  useEffect(() => {
    localStorage.setItem('cbt_welcome_config', JSON.stringify(welcomeConfig));
  }, [welcomeConfig]);

  // Candidate info
  const [isWelcomed, setIsWelcomed] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentId, setStudentId] = useState('');

  // Active shuffled questions for the current exam session
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  // CBT Exam States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredKeys, setAnsweredKeys] = useState<{ [qId: number]: string | string[] }>({});
  const [correctStatus, setCorrectStatus] = useState<{ [qId: number]: boolean }>({});
  const [incorrectAttempts, setIncorrectAttempts] = useState<{ [qId: number]: boolean }>({});
  
  // Timer & controls
  const TIMER_INITIAL_SECONDS = 45 * 60; // 45 Minutes
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(TIMER_INITIAL_SECONDS);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // UI scaling
  const [textScale, setTextScale] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  // Handle sound synthesizer initialization
  useEffect(() => {
    soundSynth.enabled = soundEnabled;
  }, [soundEnabled]);

  // Exam Countdown clock effect
  useEffect(() => {
    if (!isWelcomed || isExamFinished || isAdminMode) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWelcomed, isExamFinished, isAdminMode]);

  const [isPowerButtonDisabled, setIsPowerButtonDisabled] = useState<boolean>(() => {
    return localStorage.getItem('cbt_power_button_disabled') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('cbt_power_button_disabled', String(isPowerButtonDisabled));
  }, [isPowerButtonDisabled]);

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isKioskViolation, setIsKioskViolation] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [hasCheatingWarning, setHasCheatingWarning] = useState(false);
  const isPowerButtonBypassRef = React.useRef(false);

  // Security Kiosk State
  const [isKioskLocked, setIsKioskLocked] = useState(false);

  // Auto-fullscreen request helper
  const enterFullscreen = () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch((err) => console.warn("Fullscreen request rejected or blocked by browser:", err));
      } else if ((docEl as any).webkitRequestFullscreen) {
        (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).mozRequestFullScreen) {
        (docEl as any).mozRequestFullScreen();
      } else if ((docEl as any).msRequestFullscreen) {
        (docEl as any).msRequestFullscreen();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exitFullscreen = () => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn("Fullscreen exit rejected:", err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Listen for Kiosk exit/blur and enforce locking
  useEffect(() => {
    if (!isWelcomed || isExamFinished || isAdminMode) return;

    const triggerKioskViolation = () => {
      if (isPowerButtonBypassRef.current || isKioskViolation || hasCheatingWarning) return;

      if (violationCount === 0) {
        setHasCheatingWarning(true);
        setViolationCount(1);
        try {
          soundSynth.playError();
        } catch (_) {}
      } else {
        setHasCheatingWarning(false);
        setIsKioskViolation(true);
        setIsExamFinished(true);
        try {
          soundSynth.playError();
        } catch (_) {}
      }
    };

    const handleFullscreenChange = () => {
      if (isPowerButtonBypassRef.current) return;
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen) {
        triggerKioskViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (isPowerButtonBypassRef.current) return;
      if (document.visibilityState === 'hidden') {
        triggerKioskViolation();
      }
    };

    const handleWindowBlur = () => {
      if (isPowerButtonBypassRef.current) return;
      triggerKioskViolation();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isWelcomed, isExamFinished, isAdminMode, violationCount, isKioskViolation, hasCheatingWarning]);

  // Transition helper when entering examination
  const handleStartExam = (name: string, examId: string, className: string) => {
    setStudentName(name);
    setStudentClass(className);
    setStudentId(examId);
    
    // Generate randomized questions and options specifically for this student session
    const shuffled = shuffleQuestionsAndOptions(questions);
    setExamQuestions(shuffled);
    
    setIsKioskLocked(false);
    setIsKioskViolation(false);
    setViolationCount(0);
    setHasCheatingWarning(false);
    setIsWelcomed(true);

    // Enter fullscreen right after user gesture starts the exam
    setTimeout(() => {
      enterFullscreen();
    }, 100);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleFinishExam = () => {
    setIsExamFinished(true);
  };

  const handleResetExam = () => {
    setCurrentQuestionIndex(0);
    setAnsweredKeys({});
    setCorrectStatus({});
    setIncorrectAttempts({});
    setTimeLeftSeconds(TIMER_INITIAL_SECONDS);
    setIsExamFinished(false);
    setIsWelcomed(false);
    setExamQuestions([]);
    setIsKioskLocked(false);
    setIsKioskViolation(false);
    setViolationCount(0);
    setHasCheatingWarning(false);
  };

  const handleAcknowledgeWarning = () => {
    setHasCheatingWarning(false);
    enterFullscreen();
    try {
      soundSynth.playSuccess();
    } catch (_) {}
  };

  const handlePowerDoublePress = () => {
    if (isPowerButtonDisabled) {
      try {
        soundSynth.playError();
      } catch (_) {}
      return;
    }

    if (isKioskLocked) {
      enterFullscreen();
      setIsKioskLocked(false);
      try {
        soundSynth.playSuccess();
      } catch (_) {}
    } else if (isWelcomed) {
      isPowerButtonBypassRef.current = true;
      exitFullscreen();
      handleResetExam();
      setTimeout(() => {
        isPowerButtonBypassRef.current = false;
      }, 1000);
    }
  };

  // Evaluation response checker
  const handleAnswerSubmit = (selection: string | string[]) => {
    if (examQuestions.length === 0) return;
    const activeQuestion = examQuestions[currentQuestionIndex];
    if (!activeQuestion) return;
    
    // Evaluate answer matching correctKey
    let isCorrectAnswer = false;
    
    if (activeQuestion.type === 'pilihan-ganyak') {
      if (Array.isArray(selection) && Array.isArray(activeQuestion.correctKey)) {
        isCorrectAnswer = 
          selection.length === activeQuestion.correctKey.length &&
          selection.every(val => (activeQuestion.correctKey as string[]).includes(val));
      }
    } else {
      isCorrectAnswer = selection === activeQuestion.correctKey;
    }

    // Save Selection Choice Key representation
    setAnsweredKeys(prev => ({
      ...prev,
      [activeQuestion.id]: selection
    }));

    if (isCorrectAnswer) {
      // 1. Mark correct Status
      setCorrectStatus(prev => ({
        ...prev,
        [activeQuestion.id]: true
      }));

      // 2. Play dynamic success sound
      soundSynth.playSuccess();

      // 3. Increment index with small beautiful transition timeout (1.2 seconds) to let student read the feedback banner
      setTimeout(() => {
        setCurrentQuestionIndex(prev => {
          if (prev < examQuestions.length - 1) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 1200);

    } else {
      // 1. Mark incorrect failure attempts
      setIncorrectAttempts(prev => ({
        ...prev,
        [activeQuestion.id]: true
      }));

      setCorrectStatus(prev => ({
        ...prev,
        [activeQuestion.id]: false
      }));

      // 2. Play error feedback synth chime
      soundSynth.playError();

      // 3. Increment index with transition timeout (2.2 seconds) to let student read explanations & study corrective details
      setTimeout(() => {
        setCurrentQuestionIndex(prev => {
          if (prev < examQuestions.length - 1) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 2200);
    }
  };

  // Navigation handlers
  const handleGoPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleGoNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Compute total correct answers currently checked
  const totalCorrect = Object.values(correctStatus).filter(Boolean).length;

  // Render screens conditionally based on state
  if (isAdminMode) {
    return (
      <AdminPanel
        questions={questions}
        setQuestions={(qs) => {
          setQuestions(qs);
          // If index becomes out of bounds due to deletion, reset index to last element or 0
          if (currentQuestionIndex >= qs.length) {
            setCurrentQuestionIndex(Math.max(0, qs.length - 1));
          }
        }}
        welcomeConfig={welcomeConfig}
        setWelcomeConfig={setWelcomeConfig}
        onExit={() => setIsAdminMode(false)}
        isPowerButtonDisabled={isPowerButtonDisabled}
        setIsPowerButtonDisabled={setIsPowerButtonDisabled}
      />
    );
  }

  if (!isWelcomed) {
    return (
      <WelcomeScreen
        onStart={handleStartExam}
        config={welcomeConfig}
        onAdminClick={() => setIsAdminMode(true)}
      />
    );
  }

  if (isExamFinished) {
    return (
      <>
        <SummaryScreen
          studentName={studentName}
          studentClass={studentClass}
          studentId={studentId}
          questions={examQuestions}
          correctStatus={correctStatus}
          incorrectAttemptsCount={incorrectAttempts}
          timeSpentSeconds={TIMER_INITIAL_SECONDS - timeLeftSeconds}
          onReset={handleResetExam}
          isKioskViolation={isKioskViolation}
        />
        <PowerButton onDoublePress={handlePowerDoublePress} isDisabled={isPowerButtonDisabled} />
      </>
    );
  }

  if (isWelcomed && hasCheatingWarning) {
    return (
      <CheatingWarning
        studentName={studentName}
        studentClass={studentClass}
        onAcknowledge={handleAcknowledgeWarning}
      />
    );
  }

  if (isWelcomed && isKioskLocked) {
    return (
      <KioskLockdown
        studentName={studentName}
        studentClass={studentClass}
        onUnlock={handlePowerDoublePress}
      />
    );
  }

  const activeQuestion = examQuestions[currentQuestionIndex];
  
  // Guard for empty questions bank
  if (!activeQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Bank Soal Kosong</h2>
        <p className="text-sm text-slate-500 mb-4">Silakan masuk ke portal administrator untuk mengimpor atau menambahkan butir soal.</p>
        <button
          onClick={() => setIsAdminMode(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-md cursor-pointer"
        >
          Masuk Portal Admin
        </button>
      </div>
    );
  }

  const isSelectedAnswerCorrect = correctStatus[activeQuestion.id] === true;
  const hasActiveIncorrectAttempt = incorrectAttempts[activeQuestion.id] === true;
  const currentSelection = answeredKeys[activeQuestion.id] || (activeQuestion.type === 'pilihan-ganyak' ? [] : '');

  return (
    <div className="min-h-screen bg-slate-55 bg-slate-50 flex flex-col font-sans mb-10">
      
      {/* Top Bar Candidate Header & Stats */}
      <CbtHeader
        studentName={studentName}
        studentClass={studentClass}
        studentId={studentId}
        timeLeftSeconds={timeLeftSeconds}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onFinishExam={handleFinishExam}
        totalCorrect={totalCorrect}
        totalQuestions={examQuestions.length}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Topic Title card */}
        <div className="mb-4 bg-blue-50 border border-blue-200/60 p-3 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 mt-0.5">
            <BookOpen className="w-4 h-4 text-blue-700 font-medium shrink-0" />
            <span className="text-[10.5px] font-extrabold text-slate-700 uppercase tracking-wide">
              {welcomeConfig.headerText} — {welcomeConfig.subheadText}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800">
              <span>Progress: {totalCorrect} dari {examQuestions.length} Selesai</span>
              <div className="h-2 w-24 bg-blue-100 rounded-full overflow-hidden ml-1.5 sm:block hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all" 
                  style={{ width: `${examQuestions.length > 0 ? (totalCorrect / examQuestions.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarHidden(prev => !prev)}
              type="button"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-blue-200"
              title={isSidebarHidden ? "Tampilkan nomor navigasi soal" : "Sembunyikan nomor navigasi soal"}
            >
              {isSidebarHidden ? (
                <>
                  <PanelRight className="w-3.5 h-3.5" />
                  <span className="sm:inline hidden">Tampilkan Navigasi</span>
                </>
              ) : (
                <>
                  <PanelRightClose className="w-3.5 h-3.5" />
                  <span className="sm:inline hidden">Sembunyikan Navigasi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic 2-column workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Exam Panel */}
          <div className={isSidebarHidden ? "lg:col-span-12" : "lg:col-span-8"}>
            <QuestionArea
              question={activeQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={currentSelection}
              isCorrect={isSelectedAnswerCorrect}
              hasIncorrectAttempt={hasActiveIncorrectAttempt}
              onAnswerSubmit={handleAnswerSubmit}
              onPrev={handleGoPrev}
              onNext={handleGoNext}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === examQuestions.length - 1}
              textScale={textScale}
              onTextScaleChange={setTextScale}
            />
          </div>

          {/* Right Column: CBT Legend & Square Nave grid */}
          {!isSidebarHidden && (
            <div className="lg:col-span-4">
              <QuestionNav
                questions={examQuestions}
                totalQuestions={examQuestions.length}
                currentIndex={currentQuestionIndex}
                correctStatus={correctStatus}
                incorrectAttempts={incorrectAttempts}
                onNavigate={handleJumpToQuestion}
              />
            </div>
          )}

        </div>

      </main>

      <PowerButton onDoublePress={handlePowerDoublePress} isDisabled={isPowerButtonDisabled} />

    </div>
  );
}
