import React from 'react';
import { ShieldAlert, RefreshCw, Smartphone, Key } from 'lucide-react';
import PowerButton from './PowerButton';

interface KioskLockdownProps {
  studentName: string;
  studentClass: string;
  onUnlock: () => void;
}

export default function KioskLockdown({ studentName, studentClass, onUnlock }: KioskLockdownProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
      
      {/* Visual warning halo */}
      <div className="absolute -top-40 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl"></div>
      <div className="absolute -bottom-40 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl"></div>

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Lock Animation Indicator */}
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-950 text-rose-500 border border-rose-500/30 flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase px-3 py-1 rounded-full bg-rose-950/50 border border-rose-900/50">
          KEAMANAN CBT AKTIF
        </span>

        <h1 className="text-2xl font-black text-slate-100 font-display mt-4 tracking-tight leading-tight">
          SISTEM UJIAN TERKUNCI
        </h1>
        
        <p className="text-xs text-rose-400 mt-2 font-mono flex items-center justify-center gap-1">
          <span>🚨 Kiosk Mode Terganggu / Keluar Layar Penuh</span>
        </p>

        {/* Dynamic Context Card */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 mt-6 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-500">Nama Peserta:</span>
            <span className="font-bold text-slate-200">{studentName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
            <span className="text-slate-500">Kelas:</span>
            <span className="font-bold text-slate-200">{studentClass}</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed pt-1.5">
            Sistem mendeteksi Anda keluar dari modus **Layar Penuh (Fullscreen)** atau berpindah ke aplikasi/tab browser lain. Kejadian ini dicatat sebagai tindakan mencurigakan.
          </p>
        </div>

        {/* Interactive bypass guide */}
        <div className="mt-8 space-y-6">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-left">
            <h3 className="text-xs font-extrabold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Cara Membuka Kunci:
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Sesuai instruksi konfigurasi, Anda harus <span className="font-extrabold text-white underline">Double-Click (Klik 2 Kali Cepat)</span> tombol daya simulasi di bawah untuk mengaktifkan kembali layar penuh dan melanjutkan ujian.
            </p>
          </div>

          <div className="py-2 flex flex-col items-center justify-center gap-3">
            <PowerButton onDoublePress={onUnlock} variant="inline" />
            <p className="text-[10px] text-slate-500 italic">
              *Membuka kunci otomatis akan menegakkan kembali visual Fullscreen.
            </p>
          </div>
        </div>

      </div>

      <div className="text-[10px] text-slate-600 mt-8 font-mono">
        Sistem CBT Interaktif Madrasah • v2.4 Kemenag
      </div>
    </div>
  );
}
