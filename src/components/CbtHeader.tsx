import { Timer, Volume2, VolumeX, LogOut } from 'lucide-react';

interface CbtHeaderProps {
  studentName: string;
  studentClass: string;
  studentId: string;
  timeLeftSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onFinishExam: () => void;
  totalCorrect: number;
  totalQuestions: number;
}

export default function CbtHeader({
  studentName,
  studentClass,
  studentId,
  timeLeftSeconds,
  soundEnabled,
  onToggleSound,
  onFinishExam,
  totalCorrect,
  totalQuestions,
}: CbtHeaderProps) {
  // Format remaining time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeUrgent = timeLeftSeconds < 5 * 60;

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subject */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-450 flex items-center justify-center font-display font-black text-blue-950 shadow-sm border border-yellow-300 bg-yellow-500">
              CBT
            </div>
            <div>
              <h1 className="font-display font-bold text-base leading-tight tracking-wide text-white uppercase sm:text-lg">
                Ujian CBT Akidah Akhlak VIII
              </h1>
              <div className="flex items-center gap-2 mt-px text-[11px] text-blue-200">
                <span className="font-mono">{studentId}</span>
                <span>•</span>
                <span className="font-medium">{studentClass}</span>
              </div>
            </div>
          </div>

          {/* Student Status, Action Panels & Timer */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4 md:flex-nowrap">
            
            {/* Student Info Card */}
            <div className="bg-blue-805/60 border border-blue-600/40 rounded-lg px-3 py-1.5 min-w-[140px] text-xs bg-blue-900/40">
              <p className="text-[10px] text-blue-300 font-medium">Nama Peserta</p>
              <p className="font-semibold text-white truncate max-w-[160px]" title={studentName}>
                {studentName}
              </p>
            </div>

            {/* Progress Info */}
            <div className="bg-blue-805/60 border border-blue-600/40 rounded-lg px-3 py-1.5 text-center text-xs bg-blue-900/40">
              <p className="text-[10px] text-blue-300 font-medium">Selesai</p>
              <p className="font-semibold text-yellow-400">
                {totalCorrect} / {totalQuestions} Soal
              </p>
            </div>

            {/* Countdown Clock */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm ${
              isTimeUrgent 
                ? 'bg-red-500/20 border-red-400 text-red-200 animate-pulse' 
                : 'bg-blue-900/80 border-blue-600 text-blue-100'
            }`}>
              <Timer className={`w-4 h-4 ${isTimeUrgent ? 'text-red-400' : 'text-blue-300'}`} />
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-blue-300 font-sans tracking-wider leading-none uppercase">Sisa Waktu</span>
                <span className="text-base font-bold leading-none mt-0.5">{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Utility buttons */}
            <div className="flex items-center gap-2">
              {/* Sound toggle button */}
              <button
                id="btn-toggle-sound"
                onClick={onToggleSound}
                title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled 
                    ? 'bg-blue-700/50 border-blue-600/80 hover:bg-blue-600 text-white' 
                    : 'bg-slate-800/40 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Selesai Ujian Action button */}
              <button
                id="btn-finish-exam"
                onClick={onFinishExam}
                className="bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-yellow-400"
              >
                <LogOut className="w-3.5 h-3.5" /> Selesai
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
