import React, { useState, useEffect } from 'react';
import { Question } from './types';
import { questionsData } from './questionsData';
import { soundSynth } from './utils/audio';

import WelcomeScreen from './components/WelcomeScreen';
import CbtHeader from './components/CbtHeader';
import QuestionArea from './components/QuestionArea';
import QuestionNav from './components/QuestionNav';
import SummaryScreen from './components/SummaryScreen';

import { BookOpen, Award, CheckCircle, HelpCircle } from 'lucide-react';

export default function App() {
  // Candidate info
  const [isWelcomed, setIsWelcomed] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentId, setStudentId] = useState('');

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
    if (!isWelcomed || isExamFinished) return;

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
  }, [isWelcomed, isExamFinished]);

  const handleStartExam = (name: string, examId: string, className: string) => {
    setStudentName(name);
    setStudentId(examId);
    setStudentClass(className);
    setIsWelcomed(true);
    setTimeLeftSeconds(TIMER_INITIAL_SECONDS);
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
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
  };

  // Evaluation response checker
  const handleAnswerSubmit = (selection: string | string[]) => {
    const activeQuestion = questionsData[currentQuestionIndex];
    
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
          if (prev < questionsData.length - 1) {
            return prev + 1;
          } else {
            // Reached last question, check if all 30 questions are resolved successfully
            // If they are, auto finish handles it nicely
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
          if (prev < questionsData.length - 1) {
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
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < questionsData.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Compute total correct answers currently checked
  const totalCorrect = Object.values(correctStatus).filter(Boolean).length;

  // Render screens conditionally based on state
  if (!isWelcomed) {
    return <WelcomeScreen onStart={handleStartExam} />;
  }

  if (isExamFinished) {
    return (
      <SummaryScreen
        studentName={studentName}
        studentClass={studentClass}
        studentId={studentId}
        questions={questionsData}
        correctStatus={correctStatus}
        incorrectAttemptsCount={incorrectAttempts}
        timeSpentSeconds={TIMER_INITIAL_SECONDS - timeLeftSeconds}
        onReset={handleResetExam}
      />
    );
  }

  const activeQuestion = questionsData[currentQuestionIndex];
  const isSelectedAnswerCorrect = correctStatus[activeQuestion.id] === true;
  const hasActiveIncorrectAttempt = incorrectAttempts[activeQuestion.id] === true;
  const currentSelection = answeredKeys[activeQuestion.id] || (activeQuestion.type === 'pilihan-ganyak' ? [] : '');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans mb-10">
      
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
        totalQuestions={questionsData.length}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Topic Title card */}
        <div className="mb-4 bg-blue-50 border border-blue-200/60 p-3 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700 font-medium" />
            <span className="text-xs font-bold text-slate-700">UJIAN AKHIR MADRASAH TSANAWIYAH (CBT) AKIDAH AKHLAK KELAS 8</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-800">
            <span>Progress: {totalCorrect} dari {questionsData.length} Selesai</span>
            <div className="h-2 w-24 bg-blue-100 rounded-full overflow-hidden ml-1.5 sm:block hidden">
              <div 
                className="bg-blue-605 bg-blue-600 h-full rounded-full transition-all" 
                style={{ width: `${(totalCorrect / questionsData.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic 2-column workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Exam Panel */}
          <div className="lg:col-span-8">
            <QuestionArea
              question={activeQuestion}
              selectedAnswer={currentSelection}
              isCorrect={isSelectedAnswerCorrect}
              hasIncorrectAttempt={hasActiveIncorrectAttempt}
              onAnswerSubmit={handleAnswerSubmit}
              onPrev={handleGoPrev}
              onNext={handleGoNext}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questionsData.length - 1}
              textScale={textScale}
              onTextScaleChange={setTextScale}
            />
          </div>

          {/* Right Column: CBT Legend & Square Nave grid */}
          <div className="lg:col-span-4">
            <QuestionNav
              totalQuestions={questionsData.length}
              currentIndex={currentQuestionIndex}
              correctStatus={correctStatus}
              incorrectAttempts={incorrectAttempts}
              onNavigate={handleJumpToQuestion}
            />
          </div>

        </div>

      </main>

    </div>
  );
}
