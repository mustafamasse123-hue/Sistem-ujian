import React, { useState } from 'react';
import { BookOpen, User, CreditCard, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string, examId: string, className: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [examId, setExamId] = useState('');
  const [className, setClassName] = useState('Kelas VIII A');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Silakan masukkan Nama Lengkap Anda.');
      return;
    }
    setError('');
    const finalExamId = examId.trim() || `CBT-${Math.floor(100000 + Math.random() * 900000)}`;
    onStart(name.trim(), finalExamId, className);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl"></div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-250 overflow-hidden relative z-10 flex flex-col md:flex-row">
        {/* Left Side Info Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-800 to-indigo-950 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 bg-blue-700/50 rounded-xl border border-blue-600">
                <BookOpen className="w-6 h-6 text-blue-300" />
              </span>
              <div>
                <h2 className="font-display font-bold text-lg leading-tight tracking-wider">CBT MADRASAH</h2>
                <p className="text-xs text-blue-200 uppercase tracking-widest font-mono">Akidah Akhlak VIII</p>
              </div>
            </div>

            <h1 className="font-display font-bold text-2xl text-blue-100 leading-tight mb-4">
              Asesmen Materi Akidah Akhlak
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed mb-6">
              Ujian CBT interaktif mencakup pokok pembahasan Akidah Akhlak Kelas VIII MTs: Tawadhu, Tasamuh, Ta'awun, Adab Media Sosial, dan Kisah Keteladanan Abu Bakar As-Siddiq R.A.
            </p>
          </div>

          <div className="border-t border-blue-700/60 pt-6">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Aturan CBT Interaktif:
            </div>
            <ul className="text-xs text-blue-200/90 space-y-2 list-disc list-inside">
              <li>Pilihan Ganda: Langsung memilih satu opsi terbaik.</li>
              <li>Benar / Salah: Menilai kebenaran pernyataan.</li>
              <li>Pilihan Banyak: Memilih kombinasi jawaban yang benar.</li>
              <li>Sistem Koreksi Aktif: Anda harus dapat menjawab benar untuk lanjut ke soal berikutnya.</li>
            </ul>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-800">Kartu Login Peserta</h2>
            <p className="text-sm text-slate-500 mt-1">Masukkan informasi administrasi Anda untuk memulai sesi ujian.</p>
          </div>

          {error && (
            <div id="login-error" className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Nama Lengkap Peserta <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="student-name"
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzi Siregar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="student-class" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Tingkat / Kelas
                </label>
                <select
                  id="student-class"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 bg-white transition-colors"
                >
                  <option value="Kelas VIII A">Kelas VIII A</option>
                  <option value="Kelas VIII B">Kelas VIII B</option>
                  <option value="Kelas VIII C">Kelas VIII C</option>
                  <option value="Kelas VIII D">Kelas VIII D</option>
                </select>
              </div>

              <div>
                <label htmlFor="student-exam-id" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Nomor Peserta (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    id="student-exam-id"
                    type="text"
                    placeholder="Contoh: CBT-2026-081"
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                id="btn-start-exam"
                type="submit"
                className="w-full bg-blue-605 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer bg-blue-600"
              >
                Mulai Ujian Sekarang
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            Sistem Ujian Computer Based Test (CBT) Akidah Akhlak MTs v2.4. © 2026 Kementerian Agama RI.
          </p>
        </div>
      </div>
    </div>
  );
}
