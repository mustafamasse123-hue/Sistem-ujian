import React, { useState, useEffect } from 'react';
import { Question, QuestionType, QuestionOption, WelcomeScreenConfig } from '../types';
import { parseQuestionsText } from '../utils/questionParser';
import { questionsData } from '../questionsData';
import { 
  ShieldAlert, Settings, FileText, Plus, Trash2, Edit3, Check, X, 
  RotateCcw, Save, AlertTriangle, Play, HelpCircle, Eye, LogOut,
  Sparkles, CheckSquare, Layers, AlignLeft, ListPlus
} from 'lucide-react';

interface AdminPanelProps {
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
  welcomeConfig: WelcomeScreenConfig;
  setWelcomeConfig: (cfg: WelcomeScreenConfig) => void;
  onExit: () => void;
}

export default function AdminPanel({
  questions,
  setQuestions,
  welcomeConfig,
  setWelcomeConfig,
  onExit
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'login-screen' | 'input-questions' | 'manage-bank'>('login-screen');

  // Input & Edit States
  const [bulkText, setBulkText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Question[]>([]);
  const [editQuestionItem, setEditQuestionItem] = useState<Question | null>(null);

  // Success/Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Live Login Config inputs
  const [headerInput, setHeaderInput] = useState(welcomeConfig.headerText);
  const [subheadInput, setSubheadInput] = useState(welcomeConfig.subheadText);
  const [titleInput, setTitleInput] = useState(welcomeConfig.titleText);
  const [descInput, setDescInput] = useState(welcomeConfig.descriptionText);
  const [footerInput, setFooterInput] = useState(welcomeConfig.footerText);
  const [classesInput, setClassesInput] = useState(welcomeConfig.classes.join(', '));
  const [rulesInput, setRulesInput] = useState(welcomeConfig.rules.join('\n'));

  // Notification Timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Login Admin Berhasil!', 'success');
    } else {
      setLoginError('Kredensial salah. Gunakan admin / admin.');
    }
  };

  // Process pasted bulk text
  const handleProcessBulk = () => {
    if (!bulkText.trim()) {
      showToast('Silakan masukkan teks soal terlebih dahulu.', 'error');
      return;
    }
    // New questions start from ID 1 because old questions will be overwritten
    const parsed = parseQuestionsText(bulkText, 1);
    
    if (parsed.length === 0) {
      showToast('Karakter format tidak terdeteksi. Silakan periksa kembali teks Anda.', 'error');
    } else {
      setParsedPreview(parsed);
      showToast(`Berhasil menstrukturkan ${parsed.length} soal secara otomatis!`, 'success');
    }
  };

  // Quick edit of parsed items in the temporary staging list
  const handleUpdateStagedItem = (index: number, updatedItem: Question) => {
    const list = [...parsedPreview];
    list[index] = updatedItem;
    setParsedPreview(list);
  };

  // Save the staged preview questions into our global question bank (replacing the old bank completely)
  const handleCommitStaged = () => {
    if (parsedPreview.length === 0) return;
    
    // Replace old questions completely with parsed preview questions
    setQuestions(parsedPreview);
    setBulkText('');
    setParsedPreview([]);
    showToast(`Berhasil mengganti bank soal dengan ${parsedPreview.length} soal baru (soal lama dihapus)!`, 'success');
    setActiveTab('manage-bank');
  };

  // Revert/Reset standard welcome config
  const handleResetWelcome = () => {
    const defaults = {
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
    setHeaderInput(defaults.headerText);
    setSubheadInput(defaults.subheadText);
    setTitleInput(defaults.titleText);
    setDescInput(defaults.descriptionText);
    setFooterInput(defaults.footerText);
    setClassesInput(defaults.classes.join(', '));
    setRulesInput(defaults.rules.join('\n'));
    setWelcomeConfig(defaults);
    showToast('Tampilan login disetel ulang ke default.', 'info');
  };

  // Save dynamic welcome configuration
  const handleSaveWelcome = () => {
    const refinedClasses = classesInput.split(',').map(c => c.trim()).filter(Boolean);
    const refinedRules = rulesInput.split('\n').map(r => r.trim()).filter(Boolean);

    const newConfig: WelcomeScreenConfig = {
      headerText: headerInput,
      subheadText: subheadInput,
      titleText: titleInput,
      descriptionText: descInput,
      classes: refinedClasses,
      rules: refinedRules,
      footerText: footerInput
    };

    setWelcomeConfig(newConfig);
    showToast('Halaman Login Siswa berhasil disimpan!', 'success');
  };

  // Delete question from exam bank
  const handleDeleteQuestion = (qId: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Soal No. ${qId}?`)) {
      const filtered = questions.filter(q => q.id !== qId);
      // Re-map IDs sequentially to avoid gap issues
      const remapped = filtered.map((q, idx) => ({ ...q, id: idx + 1 }));
      setQuestions(remapped);
      showToast(`Soal ${qId} berhasil dihapus.`, 'info');
    }
  };

  // Reset core questions list to default Akidah Akhlak questions
  const handleResetQuestionBank = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan bank soal ke kondisi awal (30 Soal Default)?\nPerubahan yang Anda masukkan akan tertimpa.')) {
      setQuestions(questionsData);
      showToast('Ujian disetel ulang ke 30 soal bawaaan.', 'info');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/60 p-8">
          
          <div className="text-center mb-6">
            <span className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400 mb-3">
              <ShieldAlert className="w-8 h-8" />
            </span>
            <h2 className="font-display font-black text-2xl text-slate-100 uppercase tracking-wider">CBT ADMINISTRATOR</h2>
            <p className="text-xs text-slate-400 mt-1.5">Masuk untuk mengkonfigurasi soal dan tampilan sistem login.</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-medium">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-user" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Username Admin
              </label>
              <input
                id="admin-user"
                type="text"
                required
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label htmlFor="admin-pw" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Password Admin
              </label>
              <input
                id="admin-pw"
                type="password"
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                id="btn-admin-submit"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all text-sm cursor-pointer"
              >
                Otorisasi Masuk
              </button>
            </div>
          </form>

          {/* Test Tips */}
          <div className="mt-6 border-t border-slate-700/60 pt-4 text-center">
            <span className="text-[10px] text-slate-500 tracking-wide font-mono uppercase">
              Petunjuk Otorisasi Pengembang: <span className="text-yellow-500 font-bold">admin / admin</span>
            </span>
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-semibold transition-colors cursor-pointer"
            >
              Kembali ke Halaman Utama Siswa
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div id="admin-toast" className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-md">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {/* Admin Header Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-white" />
            </span>
            <div>
              <h1 className="font-display font-black text-sm tracking-widest text-slate-50 uppercase">RUANG ADMINISTRATOR (CBT)</h1>
              <p className="text-[10px] text-blue-300 font-semibold tracking-wide">MTs Akidah Akhlak Ujian Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-slate-300 font-mono">
              BANK SOAL: {questions.length} ITEM
            </span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
            <button
              onClick={onExit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" /> Uji Coba Halaman Siswa
            </button>
          </div>
        </div>
      </header>

      <div className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Admin Navigation Menu */}
        <aside className="md:w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <h2 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3">Fungsionalitas Admin</h2>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('login-screen')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'login-screen'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border-r-4 border-blue-605'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                Edit Halaman Login Siswa
              </button>

              <button
                onClick={() => setActiveTab('input-questions')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'input-questions'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border-r-4 border-blue-605'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                Input Soal Bulk (Satu Kotak)
              </button>

              <button
                onClick={() => setActiveTab('manage-bank')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'manage-bank'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border-r-4 border-blue-605'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                Kelola Bank & Soal Aktif
              </button>
            </nav>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Metrik Bank Soal</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/40">
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Opsi Tunggal</p>
                <p className="text-lg font-black text-blue-400">{questions.filter(q => q.type === 'pilihan-ganda').length}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/40">
                <p className="text-[9px] text-slate-400 font-semibold uppercase font-sans">Benar/Salah</p>
                <p className="text-lg font-black text-emerald-400">{questions.filter(q => q.type === 'benar-salah').length}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/40">
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Ganda Komp.</p>
                <p className="text-lg font-black text-amber-400">{questions.filter(q => q.type === 'pilihan-ganyak').length}</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/40">
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Total Soal</p>
                <p className="text-lg font-black text-slate-250">{questions.length}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleResetQuestionBank}
                className="w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded-md border border-red-540 bg-red-950/20 text-red-400 hover:bg-red-950/40 text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                title="Selesaikan reset ujian bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Bank Soal
              </button>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="grow bg-white rounded-2xl border border-slate-250 p-6 md:p-8 shadow-xs flex flex-col">
          
          {/* TAB 1: EDIT WELCOME SCREEN CONFIGURATION */}
          {activeTab === 'login-screen' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-display font-bold text-lg text-slate-800 uppercase tracking-wide">Edit Full Halaman Login Siswa</h2>
                <p className="text-xs text-slate-500 mt-1">Sesuaikan seluruh teks, daftar kelas, aturan, serta footer halaman depan login siswa.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Inputs area */}
                <div className="lg:col-span-6 space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Header Singkat</label>
                      <input
                        type="text"
                        value={headerInput}
                        onChange={(e) => setHeaderInput(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="CBT MADRASAH"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Materi / Subhead</label>
                      <input
                        type="text"
                        value={subheadInput}
                        onChange={(e) => setSubheadInput(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Akidah Akhlak VIII"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Judul Utama Halaman</label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Asesmen Materi Akidah Akhlak"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Materi Deskripsi / Petunjuk</label>
                    <textarea
                      rows={3}
                      value={descInput}
                      onChange={(e) => setDescInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                      placeholder="Tulis penjelasan singkat ujian..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Pilihan Kelas Peserta <span className="text-slate-400 font-normal">(pisahkan dengan koma)</span>
                    </label>
                    <input
                      type="text"
                      value={classesInput}
                      onChange={(e) => setClassesInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Kelas VIII A, Kelas VIII B, Kelas VIII C..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Aturan & Petunjuk Ujian <span className="text-slate-400 font-normal">(Satu poin per baris baru)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={rulesInput}
                      onChange={(e) => setRulesInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
                      placeholder="Poin 1&#13;Poin 2&#13;Poin 3..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Footer / Hak Cipta</label>
                    <input
                      type="text"
                      value={footerInput}
                      onChange={(e) => setFooterInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleSaveWelcome}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all text-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Simpan Konfigurasi Halaman Login
                    </button>
                    <button
                      onClick={handleResetWelcome}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-lg border border-slate-300 transition-all text-xs cursor-pointer"
                    >
                      Setel Ulang Default
                    </button>
                  </div>

                </div>

                {/* Direct Simulation Preview area */}
                <div className="lg:col-span-6 bg-slate-50 border border-slate-250 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-2">SIMULATOR PREVIEW LIVE</span>
                    </div>

                    {/* Miniature WelcomeScreen card layout */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden text-slate-800">
                      
                      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="p-1.5 bg-blue-700/50 rounded-lg border border-blue-600 text-[10px] font-bold">
                            📖
                          </span>
                          <div>
                            <h4 className="font-extrabold text-[10px] uppercase tracking-wider">{headerInput || 'CBT MADRASAH'}</h4>
                            <p className="text-[8px] text-blue-200 uppercase tracking-wider font-mono">{subheadInput || 'Akidah Akhlak VIII'}</p>
                          </div>
                        </div>
                        <h3 className="font-bold text-xs text-blue-100 leading-tight mb-1">{titleInput || 'Asesmen CBT'}</h3>
                        <p className="text-[9px] text-blue-200/90 leading-tight line-clamp-2">{descInput}</p>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="bg-slate-50 rounded-lg border border-slate-100 p-2.5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Informasi Login Siswa</p>
                          <div className="space-y-1.5">
                            <div className="h-4 w-full bg-slate-200/60 rounded flex items-center pl-2 text-[8px] text-slate-400">Nama Lengkap Peserta Ujian</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="h-4 bg-slate-200/60 rounded flex items-center pl-2 text-[8px] text-slate-400">
                                {classesInput.split(',').map(c => c.trim())[0] || 'Opsi Kelas'}
                              </div>
                              <div className="h-4 bg-slate-200/60 rounded flex items-center pl-2 text-[8px] text-slate-400">Nomor Peserta (CBT ID)</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                            📋 ATURAN CBT UJIAN:
                          </p>
                          <ul className="text-[8.5px] text-slate-500 space-y-1 pl-3.5 list-disc">
                            {rulesInput.split('\n').filter(Boolean).map((r, index) => (
                              <li key={index} className="leading-normal">{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-400 text-center font-mono mt-4 border-t border-slate-200 pt-3">
                    {footerInput || 'Madrasah CBT System.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: INPUT QUESTIONS BULK (THE "SATU KOTAK" INPUT) */}
          {activeTab === 'input-questions' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800 uppercase tracking-wide">Penerimaan & Input Soal Otomatis</h2>
                  <p className="text-xs text-slate-500 mt-1">Gabung Soal, Opsi, Kunci, dan Penjelasan dalam satu kotak. Sistem cerdas kami akan otomatis merapikan semuanya.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 p-2 rounded-xl text-blue-800 text-[10px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-600" />
                  Pengekstrak Akurat dengan Kecerdasan Buatan (Offline Regex Engine)
                </div>
              </div>

              {/* Instructions on pasting */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-2">📋 Petunjuk / Rekomendasi Format Penulisan:</span>
                <p className="text-slate-550 mb-3 leading-relaxed">
                  Tulis atau tempel text materi ujian Anda di kotak di bawah. Pisahkan kelompok opsi pilihan dengan penanda huruf (A, B, C, D) dan berikan kunci beserta penjelasannya. Format pendeteksi mendukung spasi tidak beraturan dan deteksi multi-kunci secara cerdas!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/65">
                    <p className="font-bold text-blue-600 text-[10px] uppercase tracking-wider mb-1.5">Contoh 1. Pilihan Ganda Tunggal</p>
                    <pre className="text-[10px] text-slate-500 leading-normal font-mono">
{`1. Sifat Tawadhu artinya rendah hati. Apa antonimnya?
A. Qana'ah
B. Tasamuh
C. Takabur / Sombong
D. Ta'awun
Kunci: C
Penjelasan: Sombong (Takabur) adalah lawan dari rendah hati.`}
                    </pre>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/65">
                    <p className="font-bold text-amber-600 text-[10px] uppercase tracking-wider mb-1.5">Contoh 2. Ganda Kompleks (Multi Kunci)</p>
                    <pre className="text-[10px] text-slate-500 leading-normal font-mono">
{`2. Manakah sifat terpuji di bawah ini?
A. Sombong
B. Tasamuh (Toleransi)
C. Ta'awun (Tolong Menolong)
D. Egois
Kunci: B, C
Penjelasan: Tasamuh dan Ta'awun adalah perilaku terpuji.`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Main Textarea box */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  KOTAK INPUT SOAL GABUNGAN
                </label>
                <textarea
                  id="bulk-textarea"
                  rows={8}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Ketik atau tempelkan soal, opsi-opsi pilihan, kunci jawaban, serta pembahasan di sini..."
                  className="w-full border border-slate-300 rounded-xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed bg-slate-950 text-slate-100"
                />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] text-amber-600 font-bold">
                    ⚠️ Menyimpan soal baru akan otomatis menghapus semua soal lama dan menggantinya dari ID 1.
                  </span>
                  <div className="flex items-center gap-2">
                    {bulkText.trim() && (
                      <button
                        onClick={() => setBulkText('')}
                        className="text-xs text-red-540 hover:text-red-650 font-bold px-3 py-1 cursor-pointer"
                      >
                        Bersihkan Kotak
                      </button>
                    )}
                    <button
                      id="btn-process-bulk"
                      onClick={handleProcessBulk}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-5 py-2 rounded-lg text-xs leading-none flex items-center gap-1.5 shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Rapikan & Tampilkan Struktur Soal
                    </button>
                  </div>
                </div>
              </div>

              {/* Staged Parsed Questions list preview area */}
              {parsedPreview.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-display font-medium text-slate-800 text-sm tracking-wide">
                        🔍 HASIL STRUKTURISASI OTOMATIS ({parsedPreview.length} Soal Terdeteksi)
                      </h3>
                      <p className="text-[10.5px] text-slate-450">Silakan tinjau ulang kelengkapan dan edit detail di kartu sebelum menyimpannya ke Ujian CBT.</p>
                    </div>
                    <button
                      onClick={handleCommitStaged}
                      className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black px-6 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Masukkan ke Bank Soal Aktif ({parsedPreview.length} Soal)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {parsedPreview.map((item, index) => {
                      return (
                        <div key={index} className="p-4 rounded-xl border border-blue-200 bg-white shadow-xs flex flex-col md:flex-row gap-4 relative">
                          {/* Left Badge type classification */}
                          <div className="md:w-1/4 space-y-2">
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                              SOAL ID: #{item.id}
                            </span>
                            
                            {/* Question Type Choice dropdown */}
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-450 uppercase mb-0.5">Tipe Soal</label>
                              <select
                                value={item.type}
                                onChange={(e) => {
                                  const updated = { ...item, type: e.target.value as QuestionType };
                                  // Re-synthesize correct keys shape if toggle changes
                                  if (updated.type === 'pilihan-ganyak') {
                                    updated.correctKey = Array.isArray(updated.correctKey) ? updated.correctKey : [updated.correctKey];
                                  } else {
                                    updated.correctKey = Array.isArray(updated.correctKey) ? (updated.correctKey[0] || 'A') : updated.correctKey;
                                  }
                                  handleUpdateStagedItem(index, updated);
                                }}
                                className="w-full text-[11px] border border-slate-300 rounded-md px-2 py-1 bg-white font-bold"
                              >
                                <option value="pilihan-ganda">Pilihan Ganda Tunggal</option>
                                <option value="benar-salah">Benar / Salah</option>
                                <option value="pilihan-ganyak">Ganda Kompleks</option>
                              </select>
                            </div>

                            {/* Correct keys selection checklist/text */}
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-450 uppercase mb-0.5">Kunci Jawaban</label>
                              {item.type === 'pilihan-ganyak' ? (
                                <div className="space-y-0.5">
                                  {['A','B','C','D'].map(key => (
                                    <label key={key} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                                      <input
                                        type="checkbox"
                                        checked={Array.isArray(item.correctKey) && item.correctKey.includes(key)}
                                        onChange={(e) => {
                                          let currentKeys = Array.isArray(item.correctKey) ? [...item.correctKey] : [];
                                          if (e.target.checked) {
                                            currentKeys.push(key);
                                          } else {
                                            currentKeys = currentKeys.filter(k => k !== key);
                                          }
                                          handleUpdateStagedItem(index, { ...item, correctKey: currentKeys.sort() });
                                        }}
                                        className="rounded border-slate-350"
                                      /> {key}
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <select
                                  value={Array.isArray(item.correctKey) ? (item.correctKey[0] || 'A') : item.correctKey}
                                  onChange={(e) => {
                                    handleUpdateStagedItem(index, { ...item, correctKey: e.target.value });
                                  }}
                                  className="w-full text-[11px] border border-slate-300 rounded-md px-2 py-1 bg-white font-mono"
                                >
                                  {item.type === 'benar-salah' ? (
                                    <>
                                      <option value="A">A (Benar / Bukti Pertama)</option>
                                      <option value="B">B (Salah / Bukti Kedua)</option>
                                    </>
                                  ) : (
                                    ['A','B','C','D','E'].map(k => (
                                      <option key={k} value={k}>Opsi {k}</option>
                                    ))
                                  )}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Right fields for question body edit */}
                          <div className="grow space-y-3">
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-450 uppercase">Teks Soal</label>
                              <input
                                type="text"
                                value={item.questionText}
                                onChange={(e) => handleUpdateStagedItem(index, { ...item, questionText: e.target.value })}
                                className="w-full text-xs font-semibold border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none pb-1"
                              />
                            </div>

                            {/* Options fields */}
                            <div className="space-y-1.5">
                              <label className="block text-[9px] font-semibold text-slate-455 uppercase">Pilihan Opsi Jawaban</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 select-none">
                                      {opt.key}
                                    </span>
                                    <input
                                      type="text"
                                      value={opt.text}
                                      onChange={(e) => {
                                        const updatedOpts = [...item.options];
                                        updatedOpts[oIdx] = { ...opt, text: e.target.value };
                                        handleUpdateStagedItem(index, { ...item, options: updatedOpts });
                                      }}
                                      className="w-full text-[11px] border border-slate-200 rounded px-2 py-0.5 focus:outline-none"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Pembahasan / Penjelasan */}
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-450 uppercase">Pembahasan & Penjelasan Soal</label>
                              <textarea
                                rows={2}
                                value={item.explanation}
                                onChange={(e) => handleUpdateStagedItem(index, { ...item, explanation: e.target.value })}
                                className="w-full text-[10.5px] border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-400 font-sans"
                              />
                            </div>
                          </div>

                          {/* Individual staging delete button */}
                          <button
                            onClick={() => {
                              const remaining = parsedPreview.filter((_, idx) => idx !== index);
                              setParsedPreview(remaining);
                              showToast('Item staging dibatalkan.', 'info');
                            }}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-540 p-1.5 transition-colors cursor-pointer"
                            title="Batalkan impor soal ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={handleCommitStaged}
                      className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold px-8 py-3 rounded-xl text-xs transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Masukkan & Simpan Semua {parsedPreview.length} Soal ke Bank CBT
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE CORE QUESTION BANK */}
          {activeTab === 'manage-bank' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800 uppercase tracking-wide">Daftar & Pengelolaan Soal Aktif</h2>
                  <p className="text-xs text-slate-500 mt-1">Ubah atau hapus butir soal tertentu yang kini aktif di server CBT Madrasah.</p>
                </div>
                <button
                  onClick={() => {
                    // Instantly append a blank question
                    const maxId = questions.reduce((max, q) => q.id > max ? q.id : max, 0);
                    const newBlank: Question = {
                      id: maxId + 1,
                      type: 'pilihan-ganda',
                      questionText: 'Masukkan pertanyaan Anda di sini...',
                      options: [
                        { key: 'A', text: 'Opsi Pilihan Utama' },
                        { key: 'B', text: 'Opsi Pilihan Kedua' },
                        { key: 'C', text: 'Opsi Pilihan Ketiga' },
                        { key: 'D', text: 'Opsi Pilihan Keempat' }
                      ],
                      correctKey: 'A',
                      explanation: 'Masukkan Pembahasan/Penjelasan teoretis di sini.'
                    };
                    setQuestions([...questions, newBlank]);
                    setEditQuestionItem(newBlank);
                    showToast('Soal kosong ditambahkan. Silakan edit soal baru di panel modal editor.', 'success');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold leading-none flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Buat Satu Soal Manual
                </button>
              </div>

              {/* Active list table */}
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 no-scrollbar">
                {questions.map((q, idx) => {
                  const labelType = q.type === 'pilihan-ganda' ? 'Opsi Tunggal' : q.type === 'benar-salah' ? 'Benar/Salah' : 'Pilihan Banyak (Kompleks)';
                  const colorBadge = q.type === 'pilihan-ganda' ? 'bg-blue-50 text-blue-700 border-blue-100' : q.type === 'benar-salah' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100';

                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/40 shadow-xs transition-all flex flex-col md:flex-row gap-4 items-start justify-between">
                      <div className="space-y-1.5 grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-white text-[9px] font-mono font-bold rounded-md">
                            NO. {q.id}
                          </span>
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md ${colorBadge}`}>
                            {labelType}
                          </span>
                          <span className="text-[10px] text-slate-450 font-mono">
                            Kunci: <span className="font-bold text-slate-700">{Array.isArray(q.correctKey) ? q.correctKey.join(', ') : q.correctKey}</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 tracking-wide line-clamp-2 md:line-clamp-none">
                          {q.questionText}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">
                          <span className="font-bold">Pembahasan:</span> {q.explanation}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                        <button
                          onClick={() => setEditQuestionItem(q)}
                          className="p-1 px-2.5 rounded-lg border border-slate-205 text-slate-500 hover:text-blue-700 hover:bg-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 px-2 text-slate-400 hover:text-red-540 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Edit Modal popup layer for single item */}
              {editQuestionItem && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-350 p-6 space-y-4">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="font-display font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                        🖊️ EDITOR BUTIR SOAL NO. {editQuestionItem.id}
                      </h3>
                      <button
                        onClick={() => setEditQuestionItem(null)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      <div className="md:col-span-8 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Pertanyaan Soal</label>
                          <textarea
                            rows={3}
                            value={editQuestionItem.questionText}
                            onChange={(e) => setEditQuestionItem({ ...editQuestionItem, questionText: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                          />
                        </div>

                        {/* Options Editor fields */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Input Alternatif Opsi</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {editQuestionItem.options.map((opt, oIdx) => (
                              <div key={opt.key} className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                  {opt.key}
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const opts = [...editQuestionItem.options];
                                    opts[oIdx] = { ...opt, text: e.target.value };
                                    setEditQuestionItem({ ...editQuestionItem, options: opts });
                                  }}
                                  className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Pembahasan</label>
                          <textarea
                            rows={2}
                            value={editQuestionItem.explanation}
                            onChange={(e) => setEditQuestionItem({ ...editQuestionItem, explanation: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Klasifikasi Type</label>
                          <select
                            value={editQuestionItem.type}
                            onChange={(e) => {
                              const t = e.target.value as QuestionType;
                              let keyVal = editQuestionItem.correctKey;
                              if (t === 'pilihan-ganyak') {
                                keyVal = Array.isArray(keyVal) ? keyVal : [keyVal];
                              } else {
                                keyVal = Array.isArray(keyVal) ? (keyVal[0] || 'A') : keyVal;
                              }
                              setEditQuestionItem({ ...editQuestionItem, type: t, correctKey: keyVal });
                            }}
                            className="w-full text-xs border border-slate-305 rounded-lg p-2 bg-white font-bold"
                          >
                            <option value="pilihan-ganda">Pilihan Ganda Tunggal</option>
                            <option value="benar-salah">Benar / Salah</option>
                            <option value="pilihan-ganyak">Ganda Kompleks</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kunci Jawaban Benar</label>
                          {editQuestionItem.type === 'pilihan-ganyak' ? (
                            <div className="space-y-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                              {['A','B','C','D'].map(letter => (
                                <label key={letter} className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(editQuestionItem.correctKey) && editQuestionItem.correctKey.includes(letter)}
                                    onChange={(e) => {
                                      let curr = Array.isArray(editQuestionItem.correctKey) ? [...editQuestionItem.correctKey] : [];
                                      if (e.target.checked) {
                                        curr.push(letter);
                                      } else {
                                        curr = curr.filter(x => x !== letter);
                                      }
                                      setEditQuestionItem({ ...editQuestionItem, correctKey: curr.sort() });
                                    }}
                                  /> Opsi {letter}
                                </label>
                              ))}
                            </div>
                          ) : (
                            <select
                              value={Array.isArray(editQuestionItem.correctKey) ? (editQuestionItem.correctKey[0] || 'A') : editQuestionItem.correctKey}
                              onChange={(e) => {
                                setEditQuestionItem({ ...editQuestionItem, correctKey: e.target.value });
                              }}
                              className="w-full text-xs border border-slate-305 rounded-lg p-2 bg-white font-mono"
                            >
                              {editQuestionItem.type === 'benar-salah' ? (
                                <>
                                  <option value="A">A (Benar)</option>
                                  <option value="B">B (Salah)</option>
                                </>
                              ) : (
                                ['A','B','C','D','E'].map(k => (
                                  <option key={k} value={k}>Opsi {k}</option>
                                ))
                              )}
                            </select>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditQuestionItem(null)}
                        className="p-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-205 text-slate-600 text-xs font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => {
                          // Commit modified item back to our main questions list
                          const list = questions.map(q => q.id === editQuestionItem.id ? editQuestionItem : q);
                          setQuestions(list);
                          setEditQuestionItem(null);
                          showToast(`Soal No. ${editQuestionItem.id} berhasil diperbarui!`, 'success');
                        }}
                        className="p-2 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Simpan Pembaruan Soal
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
