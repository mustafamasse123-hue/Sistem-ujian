import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

interface CheatingWarningProps {
  studentName: string;
  studentClass: string;
  onAcknowledge: () => void;
}

export default function CheatingWarning({ studentName, studentClass, onAcknowledge }: CheatingWarningProps) {
  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
      
      {/* Visual warning background blur */}
      <div className="absolute -top-40 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl"></div>
      <div className="absolute -bottom-40 w-96 h-96 rounded-full bg-yellow-600/10 blur-3xl"></div>

      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-300 transform scale-100">
        
        {/* Animated warning triangle */}
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-950 text-amber-500 border border-amber-500/30 flex items-center justify-center mb-6 animate-bounce">
          <AlertTriangle className="w-9 h-9" />
        </div>

        <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase px-3 py-1 rounded-full bg-amber-950/50 border border-amber-900/50">
          ⚠️ UTAMA • PERINGATAN INTEGRITAS
        </span>

        <h1 className="text-2xl font-black text-slate-100 font-display mt-4 tracking-tight leading-tight">
          TERDETEKSI BERPINDAH LAYAR / CETAK TABS!
        </h1>
        
        <p className="text-sm text-amber-400 mt-2 font-mono font-bold">
          Anda Berpindah Tab atau Menggunakan Shortcut / Cheat!
        </p>

        {/* Informative text box */}
        <div className="bg-slate-950/85 rounded-2xl border border-slate-800 p-5 mt-6 text-left space-y-3 text-xs leading-relaxed">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Nama Peserta:</span>
            <span className="font-bold text-amber-200">{studentName} ({studentClass})</span>
          </div>
          <p className="text-slate-300">
            Sistem mendeteksi aktivitas mencurigakan berupa perpindahan jendela browser, pembukaan aplikasi lain, screenshot, atau penutupan paksa modus Layar Penuh.
          </p>
          <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-red-200 text-[11px] font-medium leading-normal">
            <strong>PERINGATAN KERAS:</strong> Ini adalah peringatan pertama. Jika Anda mengulanginya kembali <span className="font-extrabold underline text-white">sekali lagi saja</span>, ujian akan otomatis dihentikan secara permanen, jawaban langsung disimpan, dan Anda dinyatakan selesai tanpa kesempatan menjawab ulang!
          </div>
        </div>

        {/* Interactive button to commit and full-screen back */}
        <div className="mt-8">
          <button
            onClick={onAcknowledge}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 px-6 py-4 rounded-2xl font-black text-xs tracking-wider uppercase shadow-xl hover:shadow-amber-500/10 active:scale-95 transition-all cursor-pointer border-t border-amber-300"
          >
            <CheckCircle className="w-4 h-4 text-slate-950" />
            <span>Saya Tidak Akan Mengulanginya Lagi</span>
          </button>
          
          <p className="text-[10px] text-slate-500 mt-3 italic">
            *Menekan tombol di atas akan mengaktifkan kembali Layar Penuh (Fullscreen).
          </p>
        </div>

      </div>

      <div className="text-[10px] text-slate-600 mt-8 font-mono">
        Sistem Deteksi Kecurangan CBT Terpadu
      </div>
    </div>
  );
}
