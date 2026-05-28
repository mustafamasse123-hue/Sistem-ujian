import React from 'react';
import { Question } from '../types';
import { Award, RefreshCcw, CheckCircle2, Bookmark, Flame, Calendar, Clock, RotateCcw, Download } from 'lucide-react';

interface SummaryScreenProps {
  studentName: string;
  studentClass: string;
  studentId: string;
  questions: Question[];
  correctStatus: { [qId: number]: boolean };
  incorrectAttemptsCount: { [qId: number]: boolean }; // Indicates questions that had incorrect attempts before completion
  timeSpentSeconds: number;
  onReset: () => void;
}

export default function SummaryScreen({
  studentName,
  studentClass,
  studentId,
  questions,
  correctStatus,
  incorrectAttemptsCount,
  timeSpentSeconds,
  onReset,
}: SummaryScreenProps) {
  
  // Calculate correct on first try
  let firstTryCorrectCount = 0;
  questions.forEach(q => {
    // A question was answered correctly on the first try if correctStatus layout registers it as correct, and no incorrect attempt is logged.
    if (correctStatus[q.id] === true && !incorrectAttemptsCount[q.id]) {
      firstTryCorrectCount++;
    }
  });

  const finalScore = Math.round((firstTryCorrectCount / questions.length) * 100);

  // Group questions by Material Topic
  // 1. Tawadhu (Questions 1-4, 21, 26) - 6 questions
  // 2. Tasamuh (Questions 5-7, 22, 27) - 5 questions
  // 3. Ta'awun (Questions 8-10, 23, 28) - 5 questions
  // 4. Adab Medsos (Questions 11-13, 24, 29) - 5 questions
  // 5. Kisah Abu Bakar As-Siddiq (Questions 14-20, 25, 30) - 9 questions
  const topicsData = [
    {
      name: 'Tawadhu (Rendah Hati)',
      questionIds: [1, 2, 3, 4, 21, 26],
      description: 'Pemahaman materi bersikap rendah hati, menjauhi sombong di hadapan Allah & manusia.'
    },
    {
      name: 'Tasamuh (Toleransi)',
      questionIds: [5, 6, 7, 22, 27],
      description: 'Menjunjung toleransi, menghargai keberagaman dalam muamalah dan sosial.'
    },
    {
      name: 'Ta\'awun (Tolong Menolong)',
      questionIds: [8, 9, 10, 23, 28],
      description: 'Sikap saling menolong dalam lingkup kebaikan dan ketakwaan, bukan permusuhan.'
    },
    {
      name: 'Adab Media Sosial',
      questionIds: [11, 12, 13, 24, 29],
      description: 'Prinsip kesantunan bermedsos, penyaringan fitnah, menjauhi ghibah/hoaks.'
    },
    {
      name: 'Keteladanan Abu Bakar As-Siddiq',
      questionIds: [14, 15, 16, 17, 18, 19, 20, 25, 30],
      description: 'Meneladani kesetiaan, kezuhudan, kejujuran (As-Siddiq), dan perjuangan khalifah pertama.'
    }
  ];

  const topicsStats = topicsData.map(topic => {
    const total = topic.questionIds.length;
    let correctOnFirstTry = 0;
    
    topic.questionIds.forEach(id => {
      if (correctStatus[id] === true && !incorrectAttemptsCount[id]) {
        correctOnFirstTry++;
      }
    });

    const percent = Math.round((correctOnFirstTry / total) * 100);
    return {
      ...topic,
      total,
      correctOnFirstTry,
      percent
    };
  });

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins > 0) {
      return `${mins} menit ${remainingSecs} detik`;
    }
    return `${remainingSecs} detik`;
  };

  const getPredicate = (score: number) => {
    if (score >= 90) return { label: 'Istimewa (Mumtaz)', color: 'text-emerald-600', note: 'Alhamdulillah! Penguasaan materi Anda luar biasa matang dan terpuji.' };
    if (score >= 75) return { label: 'Sangat Baik (Jayyid Jiddan)', color: 'text-teal-600', note: 'MasyaAllah! Anda menguasai dengan sangat baik adab dan akidah ini.' };
    if (score >= 60) return { label: 'Baik (Jayyid)', color: 'text-amber-600', note: 'Baik sekali, terus pertahankan dan biasakan adab terpuji dalam kehidupan.' };
    return { label: 'Perlu Bimbingan (Maqbul)', color: 'text-red-500', note: 'Mari pelajari kembali bab Akhlak agar mendapatkan pemahaman yang mutlak.' };
  };

  const predicate = getPredicate(finalScore);

  // List of questions that had incorrect attempts to show evaluation / study guide
  const recoveryQuestions = questions.filter(q => incorrectAttemptsCount[q.id]);

  const downloadSyllabusAndKey = () => {
    let content = `========================================================================\n`;
    content += `KISI-KISI, BUTIR SOAL & KUNCI JAWABAN AKIDAH AKHLAK KELAS VIII MTs\n`;
    content += `========================================================================\n\n`;
    
    content += `I. IDENTITAS SISWA / PESERTA CBT:\n`;
    content += `------------------------------------------------------------\n`;
    content += `Nama Lengkap      : ${studentName}\n`;
    content += `Kelas             : ${studentClass}\n`;
    content += `No. CBT / Token   : ${studentId}\n`;
    content += `Skor Hasil Ujian  : ${finalScore} / 100\n`;
    content += `Durasi Pengerjaan : ${formatDuration(timeSpentSeconds)}\n`;
    content += `Predikat Kelulusan: ${predicate.label}\n`;
    content += `Catatan Penting   : ${predicate.note}\n\n`;

    content += `II. KISI-KISI KOMPETENSI DASAR & CAPAIAN BELAJAR:\n`;
    content += `------------------------------------------------------------\n`;
    topicsStats.forEach((topic, i) => {
      content += `${i + 1}. Pokok Pembahasan : ${topic.name}\n`;
      content += `   Deskripsi Materi: ${topic.description}\n`;
      content += `   Daftar No. Soal : No. ${topic.questionIds.join(', ')}\n`;
      content += `   Hasil Akurasi   : ${topic.percent}% (${topic.correctOnFirstTry} dari ${topic.total} benar pada jawab pertama)\n\n`;
    });

    content += `III. DAFTAR SOAL, OPSI JAWABAN & BOBOT ANALISIS:\n`;
    content += `============================================================\n\n`;

    questions.forEach((q) => {
      let catLabel = '';
      if (q.id <= 4 || q.id === 21 || q.id === 26) catLabel = 'Akhlak Terpuji: Tawadhu';
      else if (q.id <= 7 || q.id === 22 || q.id === 27) catLabel = 'Akhlak Terpuji: Tasamuh';
      else if (q.id <= 10 || q.id === 23 || q.id === 28) catLabel = 'Akhlak Terpuji: Ta\'awun';
      else if (q.id <= 13 || q.id === 24 || q.id === 29) catLabel = 'Adab Media Sosial';
      else catLabel = 'Keteladanan Abu Bakar As-Siddiq R.A.';

      content += `SOAL NO. ${q.id} (Ref ID: UJI-${q.id.toString().padStart(2, '0')})\n`;
      content += `------------------------------------------------------------\n`;
      content += `Materi Pokok: ${catLabel}\n`;
      content += `Format Soal : ${
        q.type === 'pilihan-ganda' ? 'Pilihan Ganda (Satu Pilihan Utama)' :
        q.type === 'benar-salah' ? 'Benar / Salah (Pernyataan)' :
        'Pilihan Banyak (Pilihan ganda dengan beberapa jawaban benar)'
      }\n\n`;
      
      content += `Pertanyaan:\n${q.questionText}\n\n`;
      
      content += `Pilihan Opsi:\n`;
      q.options.forEach(opt => {
        let isCorrectOpt = false;
        if (Array.isArray(q.correctKey)) {
          isCorrectOpt = q.correctKey.includes(opt.key);
        } else {
          isCorrectOpt = q.correctKey === opt.key;
        }
        content += `  [${isCorrectOpt ? 'V' : ' '}] Opsi ${opt.key} : ${opt.text}\n`;
      });
      content += `\n`;

      if (Array.isArray(q.correctKey)) {
        content += `Kunci Jawaban Tepat : Opsi [ ${q.correctKey.join(', ')} ]\n`;
      } else {
        content += `Kunci Jawaban Tepat : Opsi [ ${q.correctKey} ]\n`;
      }
      content += `\nPenjelasan Pembahasan Ilmiah:\n>>> ${q.explanation}\n\n`;
      
      const incorrectAttempt = incorrectAttemptsCount[q.id];
      const isCorrectValue = correctStatus[q.id] === true;
      let analysisLabel = '';
      if (isCorrectValue && !incorrectAttempt) {
        analysisLabel = '✅ Dijawab BENAR (Skor: Sesuai)';
      } else if (incorrectAttempt) {
        analysisLabel = '❌ Dijawab SALAH (Skor: 0)';
      } else {
        analysisLabel = '⚪ TIDAK DIJAWAB / DILEWATI (Skor: 0)';
      }
      content += `Analisis Hasil Ujian Anda: ${analysisLabel}\n`;
      content += `============================================================\n\n`;
    });

    content += `Dicetak oleh: Aplikasi CBT Madrasah Interaktif - MTs Kelas VIII\n`;
    content += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} pada pukul ${new Date().toLocaleTimeString('id-ID')} WIB.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kisi_Kisi_dan_Kunci_Jawaban_Akidah_Akhlak_Kelas_8_${studentName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-slate-100 relative overflow-hidden flex flex-col items-center">
      
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl"></div>

      {/* Main dashboard cert card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative z-10">
        
        {/* Certificate Style Cap Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-950 text-white p-8 text-center relative">
          <div className="h-14 w-14 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 mx-auto mb-4 border-2 border-white shadow-md">
            <Award className="w-8 h-8 text-indigo-950" />
          </div>
          <h2 className="font-display font-bold text-2xl tracking-wide">HASIL UJIAN AKHIR CBT</h2>
          <p className="text-blue-200 text-xs uppercase tracking-widest mt-1 font-mono">MADRASAH TSANAWIYAH - AKIDAH AKHLAK VIII</p>
          
          <div className="absolute bottom-0 right-0 h-16 w-16 opacity-10 bg-white rounded-tl-full"></div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Candidate Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identitas Siswa</span>
              <p className="font-semibold text-slate-800 text-base">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tingkatan / Kelas</span>
              <p className="font-semibold text-slate-700 text-sm">{studentClass}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nomor Ujian</span>
              <p className="font-mono text-xs font-bold text-slate-700 bg-white p-1 px-2.5 rounded-md border border-slate-200 inline-block mt-0.5">
                {studentId}
              </p>
            </div>
          </div>

          {/* Section 2: Large score display */}
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
            
            {/* Score Ring */}
            <div className="text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2">Nilai Pertama Uji</span>
              <div className="inline-flex flex-col items-center justify-center h-36 w-36 rounded-full border-8 border-blue-100 bg-blue-50 shadow-inner">
                <span className="text-5xl font-black text-blue-700 font-display leading-tight">{finalScore}</span>
                <span className="text-[10px] text-blue-500 font-bold leading-none tracking-widest uppercase">Skor Ke-1</span>
              </div>
            </div>

            {/* Predicate detail */}
            <div className="max-w-md text-center md:text-left space-y-2">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Predikat Kelulusan</span>
                <p id="predicate-label" className={`text-2xl font-black ${predicate.color}`}>
                  {predicate.label}
                </p>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {predicate.note}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs text-slate-500 justify-center md:justify-start">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Durasi: {formatDuration(timeSpentSeconds)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 text-emerald-500" />
                  <span>Selesai: 30 / 30 Soal Terjawab</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Topics Diagnostics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
              <Bookmark className="w-5 h-5 text-blue-700" />
              <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide">Pencapaian Kompetensi per Pokok Pembahasan</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicsStats.map((topic, index) => (
                <div id={`topic-card-${index}`} key={index} className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-800 font-display leading-snug">{topic.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{topic.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
                      {topic.correctOnFirstTry}/{topic.total} Jwb
                    </span>
                  </div>

                  {/* Horizontal Bar indicator */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.percent >= 90 ? 'bg-blue-600' :
                          topic.percent >= 70 ? 'bg-indigo-505 bg-indigo-500' :
                          topic.percent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${topic.percent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Akurasi Pertama</span>
                      <span className={
                        topic.percent >= 90 ? 'text-blue-700' :
                        topic.percent >= 70 ? 'text-indigo-700 font-medium' :
                        topic.percent >= 50 ? 'text-amber-700' : 'text-red-750 text-red-700'
                      }>{topic.percent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Study Evaluations based on Incorrect answers */}
          {recoveryQuestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide text-amber-805">
                  Buku Catatan Pembenahan Materi ({recoveryQuestions.length} Soal)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Di bawah ini adalah ringkasan ringkas untuk butir soal yang sempat Anda jawab salah di awal. Manfaatkan kunci penjelasan materi ini untuk mengulang pemahaman:
              </p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {recoveryQuestions.map((q) => (
                  <div id={`recovery-panel-${q.id}`} key={q.id} className="p-4 rounded-lg bg-orange-50/40 border-l-4 border-amber-400 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        SOAL {q.id}
                      </span>
                      <p className="text-xs font-bold text-slate-700 line-clamp-1">{q.questionText}</p>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white/80 p-2.5 rounded border border-slate-150">
                      <strong>Penjelasan Solusi:</strong> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <h3 className="font-display font-bold text-emerald-800 text-sm uppercase tracking-wide">🏆 Sempurna! Tanpa Kegagalan</h3>
              <p className="text-xs text-emerald-700 leading-relaxed max-w-lg mx-auto">
                Luar biasa! Anda menjawab seluruh 30 soal dengan benar pada kesempatan pertama. Anda memiliki pemahaman yang murni mengenai akidah akhlak.
              </p>
            </div>
          )}

          {/* Selesai / Mulai Ulang Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <button
              id="btn-restart-exam"
              onClick={onReset}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-w-[185px] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Ujian (Reset)
            </button>
            <button
              id="btn-download-syllabus"
              onClick={downloadSyllabusAndKey}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-w-[185px] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh Kisi-kisi & Kunci
            </button>
            <button
              id="btn-print-certificate"
              onClick={() => window.print()}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-w-[185px] cursor-pointer"
            >
              Cetak Kartu Hasil Ujian
            </button>
          </div>

        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-6 pb-10">
        Hasil ujian ini terdaftar secara resmi pada Bank Soal CBT Akidah Akhlak MTs Kelas VIII.
      </p>
    </div>
  );
}
