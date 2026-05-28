import React, { useState, useEffect, useRef } from 'react';
import { Power, ShieldAlert } from 'lucide-react';

interface PowerButtonProps {
  onDoublePress: () => void;
  variant?: 'floating' | 'inline';
  isDisabled?: boolean;
}

export default function PowerButton({ onDoublePress, variant = 'floating', isDisabled = false }: PowerButtonProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDisabled) {
      setClickCount(0);
      setShowTooltip(true);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return;
    }
    
    if (clickCount === 0) {
      setClickCount(1);
      setShowTooltip(true);
      
      // Reset after 1000ms if not double clicked
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setShowTooltip(false);
      }, 1000);
    } else {
      // Double click registered!
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      setClickCount(0);
      setShowTooltip(false);
      onDoublePress();
    }
  };

  if (variant === 'inline') {
    if (isDisabled) {
      return (
        <div className="relative inline-block">
          <button
            onClick={handleClick}
            type="button"
            className="flex items-center gap-2 bg-slate-700 text-slate-400 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md border border-slate-600 cursor-not-allowed"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Tombol Daya Dinonaktifkan Admin</span>
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-rose-950 text-rose-200 text-[10px] font-bold rounded-lg shadow-lg border border-rose-500/30 z-50 text-center animate-pulse">
              Tombol daya tidak aktif! Silakan hubungi proktor/admin.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          type="button"
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-rose-900/25 active:scale-95 transition-all cursor-pointer border border-rose-500 animate-pulse"
        >
          <Power className="w-4 h-4 text-rose-100" />
          <span>Double-Click Tombol Daya</span>
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-rose-950 text-rose-100 text-[10px] font-bold rounded-lg shadow-lg border border-rose-500/30 z-50 text-center animate-bounce">
            Tekan 1 Kali Lagi!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {showTooltip && (
        <div className={`mb-2 px-3 py-1.5 text-[10px] font-extrabold rounded-lg shadow-xl border text-center max-w-[200px] animate-bounce ${
          isDisabled 
            ? 'bg-slate-900 text-slate-300 border-slate-700'
            : 'bg-rose-950 text-rose-100 border-rose-500/40'
        }`}>
          {isDisabled 
            ? '❌ Tombol Daya ini sedang dinonaktifkan oleh Administrator!' 
            : '⚡ Tekan tombol daya 1 kali lagi untuk keluar/kembali!'}
        </div>
      )}
      
      <button
        onClick={handleClick}
        type="button"
        className={`group relative flex items-center justify-center p-3.5 rounded-full shadow-2xl transition-all cursor-pointer border-2 ring-4 ${
          isDisabled 
            ? 'bg-slate-800 text-slate-500 border-slate-700 ring-slate-800/10 hover:border-slate-600'
            : `bg-gradient-to-tr from-rose-700 to-red-500 hover:from-rose-600 hover:to-red-400 text-white border-rose-300 hover:border-rose-100 ${
                clickCount === 1 ? 'ring-rose-400/80 scale-105 animate-pulse' : 'ring-rose-500/20'
              }`
        }`}
        title={isDisabled ? "Tombol Daya Dinonaktifkan Administrasi" : "Simulasi Tombol Daya (Double-Click untuk mereset dan keluar dari aplikasi)"}
      >
        {isDisabled ? (
          <ShieldAlert className="w-5 h-5 text-slate-400" />
        ) : (
          <Power className={`w-5 h-5 ${clickCount === 1 ? 'animate-spin' : ''}`} />
        )}
        
        {/* Hover label */}
        <span className="absolute right-full mr-3 px-2 py-1 bg-slate-900/90 text-white text-[9px] font-bold tracking-wider rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700/50">
          {isDisabled ? 'Tombol Daya (Dinonaktifkan)' : 'Tombol Daya (Klik 2x)'}
        </span>
      </button>
    </div>
  );
}
