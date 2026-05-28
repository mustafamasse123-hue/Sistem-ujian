import React, { useState, useEffect, useRef } from 'react';
import { Power } from 'lucide-react';

interface PowerButtonProps {
  onDoublePress: () => void;
  variant?: 'floating' | 'inline';
}

export default function PowerButton({ onDoublePress, variant = 'floating' }: PowerButtonProps) {
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
        <div className="mb-2 px-3 py-1.5 bg-rose-950 text-rose-100 text-[10px] font-extrabold rounded-lg shadow-xl border border-rose-500/40 text-center max-w-[180px] animate-bounce">
          ⚡ Tekan tombol daya 1 kali lagi untuk keluar/kembali!
        </div>
      )}
      
      <button
        onClick={handleClick}
        type="button"
        className={`group relative flex items-center justify-center p-3.5 rounded-full bg-gradient-to-tr from-rose-700 to-red-500 hover:from-rose-600 hover:to-red-400 text-white shadow-2xl active:scale-95 transition-all cursor-pointer border-2 border-rose-300 hover:border-rose-100 ring-4 ${
          clickCount === 1 ? 'ring-rose-400/80 scale-105 animate-pulse' : 'ring-rose-500/20'
        }`}
        title="Simulasi Tombol Daya (Double-Click untuk mereset dan keluar dari aplikasi)"
      >
        <Power className={`w-5 h-5 ${clickCount === 1 ? 'animate-spin' : ''}`} />
        
        {/* Hover label */}
        <span className="absolute right-full mr-3 px-2 py-1 bg-slate-900/90 text-white text-[9px] font-bold tracking-wider rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700/50">
          Tombol Daya (Klik 2x)
        </span>
      </button>
    </div>
  );
}
