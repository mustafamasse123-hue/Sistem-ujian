import React from 'react';
import { Question } from '../types';
import { Award, RefreshCcw, CheckCircle2, Bookmark, Flame, Calendar, Clock, RotateCcw, Download, Presentation } from 'lucide-react';
import pptxgen from 'pptxgenjs';

interface SummaryScreenProps {
  studentName: string;
  studentClass: string;
  studentId: string;
  questions: Question[];
  correctStatus: { [qId: number]: boolean };
  incorrectAttemptsCount: { [qId: number]: boolean }; // Indicates questions that had incorrect attempts before completion
  timeSpentSeconds: number;
  onReset: () => void;
  isKioskViolation?: boolean;
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
  isKioskViolation = false,
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
    // 1. Define safe rounded rectangle drawer with older browser fallback support
    const drawRoundRect = (ctx2d: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      if (ctx2d.roundRect) {
        ctx2d.roundRect(x, y, w, h, r);
      } else {
        ctx2d.moveTo(x + r, y);
        ctx2d.lineTo(x + w - r, y);
        ctx2d.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx2d.lineTo(x + w, y + h - r);
        ctx2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx2d.lineTo(x + r, y + h);
        ctx2d.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx2d.lineTo(x, y + r);
        ctx2d.quadraticCurveTo(x, y, x + r, y);
      }
    };

    const colWidth = 630;

    // 2. Measure Height dynamically based on wrapped text lengths
    const getCardHeight = (q: Question): number => {
      // Base padding/margin/static heights:
      // padding-top (20), pills (24), spacing after pills (38), checklist container padding/height (42 + 20),
      // line separator & spacing (40), bottom padding (20)
      let h = 20 + 24 + 38 + 62 + 40 + 20; 
      
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return 260; // fallback standard height
      
      const wrapHeight = (text: string, maxWidth: number, fontSize: number): number => {
        tempCtx.font = `bold ${fontSize}px sans-serif`;
        const words = text.split(' ');
        let line = '';
        let lineCount = 1;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = tempCtx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lineCount++;
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        return lineCount * (fontSize * 1.45);
      };

      const textMaxW = colWidth - 40;
      h += wrapHeight(q.questionText, textMaxW, 14.5);
      
      // Calculate Answer Key options text length
      let correctStr = '';
      if (Array.isArray(q.correctKey)) {
        const matchedOpts = q.options.filter(opt => (q.correctKey as string[]).includes(opt.key));
        correctStr = `Kunci: ${matchedOpts.map(o => `${o.key}. ${o.text}`).join(' & ')}`;
      } else {
        const matched = q.options.find(opt => opt.key === q.correctKey);
        correctStr = `Kunci: ${matched ? `${matched.key}. ${matched.text}` : q.correctKey}`;
      }
      // Note the text inside the option card is slightly padded on both sides (60px)
      h += wrapHeight(correctStr, textMaxW - 60, 13);
      h += wrapHeight(`Materi Esensial / Pembahasan: ${q.explanation}`, textMaxW, 11.5);

      return h;
    };

    // Partition column-wise with a reliably sorted list of questions (1 to 30 by original id)
    const sortedQuestionsForPng = [...questions].sort((a, b) => a.id - b.id);

    const leftHeights: number[] = [];
    let leftColumnTotalY = 320;
    sortedQuestionsForPng.slice(0, 15).forEach(q => {
      const h = getCardHeight(q);
      leftHeights.push(h);
      leftColumnTotalY += h + 24; // with gap spaces
    });

    const rightHeights: number[] = [];
    let rightColumnTotalY = 320;
    sortedQuestionsForPng.slice(15, 30).forEach(q => {
      const h = getCardHeight(q);
      rightHeights.push(h);
      rightColumnTotalY += h + 24; // with gap spaces
    });

    const maxColY = Math.max(leftColumnTotalY, rightColumnTotalY);
    const totalCanvasHeight = maxColY + 120; // 120 pixels extra space for gorgeous footer

    // 3. Setup real high-definition canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = totalCanvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Global off-white background
    ctx.fillStyle = '#f8fafc'; // light slate-50
    ctx.fillRect(0, 0, 1400, totalCanvasHeight);

    // 4. Header Background Gradient
    const headerGrad = ctx.createLinearGradient(0, 0, 1400, 0);
    headerGrad.addColorStop(0, '#1e3a8a'); // dark blue-900
    headerGrad.addColorStop(0.5, '#1e40af'); // blue-800
    headerGrad.addColorStop(1, '#312e81'); // indigo-950
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, 1400, 260);

    // Gold ribbon line
    ctx.fillStyle = '#f59e0b'; // amber-500 helper ribbon
    ctx.fillRect(0, 250, 1400, 10);

    // Header Content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('KISI-KISI & KUNCI JAWABAN AKIDAH AKHLAK VIII', 180, 95);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('ASESMEN AKHIR SEMESTER • MADRASAH TSANAWIYAH (CBT COMPUTER-BASED TEST)', 180, 138);

    // Draw circular CBT Emblem badge
    ctx.beginPath();
    ctx.arc(95, 115, 52, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(95, 115, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#1e3a8a';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('CBT', 95, 102);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px sans-serif';
    ctx.fillText('MTs-VIII', 95, 126);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Info cards (badges) for student metadata in header
    const studentInfoY = 175;
    const badges = [
      { label: 'Siswa / Peserta', value: studentName },
      { label: 'Kelas', value: studentClass },
      { label: 'ID CBT', value: studentId },
      { label: 'Skor Ujian', value: `${finalScore} / 100` },
      { label: 'Kualifikasi', value: predicate.label }
    ];

    let badgeX = 180;
    badges.forEach((b, i) => {
      const bWidth = i === 4 ? 260 : i === 0 ? 250 : 160;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      drawRoundRect(ctx, badgeX, studentInfoY, bWidth, 54, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(b.label.toUpperCase(), badgeX + 14, studentInfoY + 20);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(b.value, badgeX + 14, studentInfoY + 42);

      badgeX += bWidth + 15;
    });

    // 5. Wrap Text helper for live painting
    const drawTextWrapped = (text: string, x: number, y: number, maxWidth: number, fontSize: number, fontWeight: string, color: string, isItalic: boolean = false): number => {
      ctx.fillStyle = color;
      ctx.font = `${isItalic ? 'italic ' : ''}${fontWeight} ${fontSize}px sans-serif`;
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      const lineHeight = fontSize * 1.45;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY + lineHeight;
    };

    let pLeftY = 320;
    let pRightY = 320;

    // Draw all 30 questions
    sortedQuestionsForPng.forEach((q, idx) => {
      const isLeftCol = q.id <= 15;
      const xCoord = isLeftCol ? 50 : 720;
      let yCoord = isLeftCol ? pLeftY : pRightY;
      const currentHeight = isLeftCol ? leftHeights[idx] : rightHeights[idx - 15];

      // Draw custom card drop shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.beginPath();
      drawRoundRect(ctx, xCoord + 2, yCoord + 2, colWidth, currentHeight, 14);
      ctx.fill();

      // Draw elegant white rounded rect card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      drawRoundRect(ctx, xCoord, yCoord, colWidth, currentHeight, 14);
      ctx.fill();
      ctx.stroke();

      // Position pointers inside Card
      let innerPointerY = yCoord + 20;

      // Card header tags/pills
      let catLabel = '';
      let catColor = '#2563eb';
      if (q.id <= 4 || q.id === 21 || q.id === 26) {
        catLabel = 'Tawadhu';
        catColor = '#2563eb'; // blue
      } else if (q.id <= 7 || q.id === 22 || q.id === 27) {
        catLabel = 'Tasamuh';
        catColor = '#4f46e5'; // indigo
      } else if (q.id <= 10 || q.id === 23 || q.id === 28) {
        catLabel = "Ta'awun";
        catColor = '#d97706'; // orange/amber
      } else if (q.id <= 13 || q.id === 24 || q.id === 29) {
        catLabel = 'Medsos Adab';
        catColor = '#0369a1'; // Sky-blue
      } else {
        catLabel = 'Abu Bakar R.A.';
        catColor = '#7c3aed'; // purple
      }

      // No. Soal blue pill
      ctx.fillStyle = '#eff6ff'; // Light sky blue
      ctx.beginPath();
      drawRoundRect(ctx, xCoord + 20, innerPointerY, 82, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`SOAL No. ${q.id.toString().padStart(2, '0')}`, xCoord + 27, innerPointerY + 16);

      // Topic pill with its corresponding thematic color
      ctx.fillStyle = `${catColor}12`; // 12% opacity color fill
      ctx.beginPath();
      drawRoundRect(ctx, xCoord + 110, innerPointerY, 138, 24, 6);
      ctx.fill();

      ctx.fillStyle = catColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(catLabel.toUpperCase(), xCoord + 120, innerPointerY + 16);

      // Question Type metadata badge
      const styleLabel = q.type === 'pilihan-ganda' ? 'Opsi Tunggal' : q.type === 'benar-salah' ? 'Benar / Salah' : 'Pilihan Banyak';
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      drawRoundRect(ctx, xCoord + 256, innerPointerY, 115, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11.5px sans-serif';
      ctx.fillText(styleLabel, xCoord + 266, innerPointerY + 16);

      innerPointerY += 38;

      // Draw Wrapped Question Text
      innerPointerY = drawTextWrapped(q.questionText, xCoord + 20, innerPointerY, colWidth - 40, 14.5, 'bold', '#0f172a');
      innerPointerY += 12;

      // Format correct answer text
      let correctStr = '';
      if (Array.isArray(q.correctKey)) {
        const matchedOpts = q.options.filter(opt => (q.correctKey as string[]).includes(opt.key));
        correctStr = `Kunci: ${matchedOpts.map(o => `${o.key}. ${o.text}`).join(' & ')}`;
      } else {
        const matched = q.options.find(opt => opt.key === q.correctKey);
        correctStr = `Kunci: ${matched ? `${matched.key}. ${matched.text}` : q.correctKey}`;
      }

      // Draw answer ribbon box
      ctx.fillStyle = '#ecfdf5'; // light emerald-50
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      drawRoundRect(ctx, xCoord + 20, innerPointerY, colWidth - 40, 42, 8);
      ctx.fill();
      ctx.stroke();

      // Emerald Circle with checkmark Icon
      ctx.beginPath();
      ctx.arc(xCoord + 38, innerPointerY + 21, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xCoord + 34, innerPointerY + 21);
      ctx.lineTo(xCoord + 37, innerPointerY + 24);
      ctx.lineTo(xCoord + 42, innerPointerY + 18);
      ctx.stroke();

      // Write key text inside emerald ribbon
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(correctStr, xCoord + 58, innerPointerY + 25);

      innerPointerY += 56;

      // Clean divider line
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xCoord + 20, innerPointerY);
      ctx.lineTo(xCoord + colWidth - 20, innerPointerY);
      ctx.stroke();

      innerPointerY += 16;

      // Write Material Explanation details
      innerPointerY = drawTextWrapped(`Materi Esensial: ${q.explanation}`, xCoord + 20, innerPointerY, colWidth - 40, 11.5, 'normal', '#475569', true);

      // Increment tracking Y coordinates
      if (isLeftCol) {
        pLeftY += currentHeight + 24;
      } else {
        pRightY += currentHeight + 24;
      }
    });

    // 6. Draw Footer Section
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, totalCanvasHeight - 100, 1400, 100);

    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('OFFICIAL CBT INFOGRAPHICS • MTs KELAS VIII MATA PELAJARAN AKIDAH AKHLAK', 50, totalCanvasHeight - 55);

    const timeStampLog = `Siswa/i: ${studentName} - Kelas ${studentClass} (Token: ${studentId}) • Dicetak pada: ${new Date().toLocaleDateString('id-ID')} Pukul ${new Date().toLocaleTimeString('id-ID')} WIB`;
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 12.5px sans-serif';
    ctx.fillText(timeStampLog, 50, totalCanvasHeight - 33);

    // Official seal watermark text
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('✓ CBT VERIFIED DIGITAL SHEET', 1180, totalCanvasHeight - 44);

    // Run trigger download of graphic file
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.href = dataUrl;
      dlLink.setAttribute('download', `Kisi_Kisi_dan_Kunci_Jawaban_Akidah_Akhlak_8_${studentName.replace(/\s+/g, '_')}.png`);
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    } catch (e) {
      console.error("Canvas toDataURL failed, attempting blob fallback", e);
    }
  };

  const downloadPPTX = () => {
    const pptx = new pptxgen();
    
    // Set 16:9 widescreen presentation layout
    pptx.layout = 'LAYOUT_16x9';

    // 1. COVER SLIDE
    const coverSlide = pptx.addSlide();
    coverSlide.background = { fill: '1E3A8A' }; // Dark indigo blue

    // Slide 1 Decorative amber/gold strip on the left side
    coverSlide.addText("", {
      x: 0.0,
      y: 0.0,
      w: 0.25,
      h: 5.625,
      fill: { color: 'F59E0B' }
    });

    // Main Title
    coverSlide.addText("KISI-KISI & KUNCI JAWABAN AKIDAH AKHLAK", {
      x: 0.8,
      y: 0.8,
      w: 8.4,
      h: 0.9,
      fontSize: 24,
      bold: true,
      color: 'FFFFFF',
      fontFace: 'Arial',
      align: 'left'
    });

    // Subtitle
    coverSlide.addText("Asesmen Akhir Semester Berbasis CBT (Computer-Based Test)\nMTs Kelas VIII (Kelas 8 A - D)", {
      x: 0.8,
      y: 1.7,
      w: 8.4,
      h: 0.8,
      fontSize: 13,
      bold: true,
      color: '93C5FD',
      fontFace: 'Arial',
      align: 'left'
    });

    // Student identity info card background
    coverSlide.addText("", {
      x: 0.8,
      y: 2.7,
      w: 8.4,
      h: 1.8,
      fill: { color: '1E40AF' },
      line: { color: '3B82F6', width: 1.5 }
    });

    // Student identity info text inside card
    const metaRuns = [
      { text: `NAMA LENGKAP      : `, options: { bold: true, color: '94A3B8' } },
      { text: `${studentName}\n`, options: { bold: true, color: 'FFFFFF' } },
      { text: `KELAS             : `, options: { bold: true, color: '94A3B8' } },
      { text: `${studentClass}\n`, options: { bold: true, color: 'FFFFFF' } },
      { text: `ID CBT / TOKEN    : `, options: { bold: true, color: '94A3B8' } },
      { text: `${studentId}\n`, options: { bold: true, color: 'FFFFFF' } },
      { text: `SKOR HASIL UJIAN  : `, options: { bold: true, color: 'FEF08A' } },
      { text: `${finalScore} / 100\n`, options: { bold: true, color: 'FEF08A' } },
      { text: `PREDIKAT KELULUSAN: `, options: { bold: true, color: 'FEF08A' } },
      { text: `${predicate.label}\n`, options: { bold: true, color: 'FEF08A' } },
      { text: `DURASI PENGERJAAN : `, options: { bold: true, color: 'CBD5E1' } },
      { text: `${formatDuration(timeSpentSeconds)}`, options: { color: 'CBD5E1' } }
    ];

    coverSlide.addText(metaRuns, {
      x: 1.1,
      y: 2.85,
      w: 7.8,
      h: 1.5,
      fontSize: 11,
      fontFace: 'Arial'
    });

    // Cover page footer
    coverSlide.addText("Dicetak resmi oleh Aplikasi CBT Akidah Akhlak Madrasah Interaktif", {
      x: 0.8,
      y: 4.8,
      w: 8.4,
      h: 0.4,
      fontSize: 10,
      color: '60A5FA',
      align: 'center'
    });

    // Sort questions for PPTX generation so that Pilihan Ganda (Opsi Tunggal) comes first, and Benar-Salah + Pilihan Banyak at the bottom.
    // Each group is sorted by their original question ID.
    const pptxQuestions = [
      ...questions.filter(q => q.type === 'pilihan-ganda').sort((a, b) => a.id - b.id),
      ...questions.filter(q => q.type === 'benar-salah').sort((a, b) => a.id - b.id),
      ...questions.filter(q => q.type === 'pilihan-ganyak').sort((a, b) => a.id - b.id),
    ];

    // 2. DETAILED EXPLANATION PAGES (1 SLIDE PER QUESTION)
    pptxQuestions.forEach((q, qIndex) => {
      const qSlide = pptx.addSlide();
      qSlide.background = { fill: 'F8FAFC' };

      // Theme logic for color badges
      let catLabel = '';
      let catColor = '2563EB';
      if (q.id <= 4 || q.id === 21 || q.id === 26) {
        catLabel = 'Tawadhu (Rendah Hati)';
        catColor = '2563EB';
      } else if (q.id <= 7 || q.id === 22 || q.id === 27) {
        catLabel = 'Tasamuh (Toleransi)';
        catColor = '4F46E5';
      } else if (q.id <= 10 || q.id === 23 || q.id === 28) {
        catLabel = "Ta'awun (Tolong Menolong)";
        catColor = 'D97706';
      } else if (q.id <= 13 || q.id === 24 || q.id === 29) {
        catLabel = 'Adab Media Sosial';
        catColor = '0369A1';
      } else {
        catLabel = 'Kisah Abu Bakar As-Siddiq R.A.';
        catColor = '7C3AED';
      }

      // No. Soal badging row at top (Numbered 1-30 sequentially based on the new ordered array)
      qSlide.addText(`SOAL No. ${(qIndex + 1).toString().padStart(2, '0')}`, {
        x: 0.5,
        y: 0.3,
        w: 1.4,
        h: 0.35,
        fontSize: 12,
        bold: true,
        color: '2563EB',
        fill: { color: 'EFF6FF' },
        align: 'center',
        valign: 'middle'
      });

      qSlide.addText(`Materi: ${catLabel}`, {
        x: 2.05,
        y: 0.3,
        w: 4.3,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: catColor,
        fill: { color: 'F1F5F9' },
        align: 'left',
        valign: 'middle'
      });

      const typeLabel = q.type === 'pilihan-ganda' ? 'Opsi Tunggal' : q.type === 'benar-salah' ? 'Benar / Salah' : 'Pilihan Banyak';
      qSlide.addText(`Tipe Soal: ${typeLabel}`, {
        x: 6.5,
        y: 0.3,
        w: 3.0,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: '475569',
        fill: { color: 'F1F5F9' },
        align: 'center',
        valign: 'middle'
      });

      // Question Text
      qSlide.addText(q.questionText, {
        x: 0.5,
        y: 0.85,
        w: 9.0,
        h: 1.3,
        fontSize: 13.5,
        bold: true,
        color: '0F172A',
        valign: 'middle',
        align: 'left'
      });

      // Format correct answer text
      let correctStr = '';
      if (Array.isArray(q.correctKey)) {
        const matchedOpts = q.options.filter(opt => (q.correctKey as string[]).includes(opt.key));
        correctStr = `Kunci: ${matchedOpts.map(o => `[${o.key}] ${o.text}`).join(' & ')}`;
      } else {
        const matched = q.options.find(opt => opt.key === q.correctKey);
        correctStr = `Kunci: [${q.correctKey}] ${matched ? matched.text : q.correctKey}`;
      }

      // Emerald Correct Answer Ribbon Box
      qSlide.addText(`✓ JAWABAN YANG BENAR:\n${correctStr}`, {
        x: 0.5,
        y: 2.3,
        w: 9.0,
        h: 0.9,
        fontSize: 12,
        bold: true,
        color: '065F46',
        fill: { color: 'ECFDF5' },
        line: { color: 'A7F3D0', width: 1 },
        valign: 'middle',
        align: 'left'
      });

      // Explanation Box
      qSlide.addText(`📖 Pembahasan Ilmiah & Kunci Pembelajaran:\n\n${q.explanation}`, {
        x: 0.5,
        y: 3.4,
        w: 9.0,
        h: 1.5,
        fontSize: 11,
        color: '475569',
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
        valign: 'top',
        align: 'left'
      });

      // Feedback Status Bar (uses actual original question ID to resolve candidate response statistics)
      const wasCorrect = correctStatus[q.id] === true;
      const hadFailures = incorrectAttemptsCount[q.id] === true;
      let statusText = '';
      let statusColor = 'EF4444';
      if (wasCorrect && !hadFailures) {
        statusText = 'Hasil Analisis Anda: BENAR (Sesuai Kunci - Peluang Pertama)';
        statusColor = '10B981';
      } else if (hadFailures) {
        statusText = 'Hasil Analisis Anda: BENAR (Melalui Percobaan Lanjutan)';
        statusColor = 'F59E0B';
      } else {
        statusText = 'Hasil Analisis Anda: SALAH / BELUM KONSISTEN';
        statusColor = 'EF4444';
      }

      qSlide.addText(statusText, {
        x: 0.5,
        y: 5.0,
        w: 5.5,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: statusColor,
        align: 'left'
      });

      // Footer Slide Counter
      qSlide.addText(`Slide ${qIndex + 2} dari ${questions.length + 1} | Madrasah Interaktif VIII`, {
        x: 6.0,
        y: 5.0,
        w: 3.5,
        h: 0.3,
        fontSize: 9.5,
        color: '94A3B8',
        align: 'right'
      });
    });

    pptx.writeFile({ fileName: `Kisi_Kisi_dan_Kunci_Jawaban_Akidah_Akhlak_8_${studentName.replace(/\s+/g, '_')}.pptx` });
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
          
          {isKioskViolation && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-rose-900 space-y-2 shadow-sm animate-pulse">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                  Sistem Lockout
                </span>
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-rose-950">
                  Ujian Dihentikan & Disimpan Otomatis
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-rose-700 font-medium">
                Sistem mendeteksi tindakan keluar dari modus **Layar Penuh (Kiosk Mode)** atau perpindahan jendela/aplikasi tanpa melalui Tombol Daya yang sah. Sesuai prosedur proktor CBT, seluruh sisa jawaban telah disimpan, akses lembar soal dihentikan, dan Anda tidak diizinkan melanjutkan menjawab.
              </p>
            </div>
          )}

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
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-w-[170px] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Ujian (Reset)
            </button>
            <button
              id="btn-download-syllabus"
              onClick={downloadSyllabusAndKey}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-w-[170px] cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh Infografis (PNG)
            </button>
            <button
              id="btn-download-pptx"
              onClick={downloadPPTX}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-w-[170px] cursor-pointer"
            >
              <Presentation className="w-4 h-4" /> Unduh Slides (PPTX)
            </button>
            <button
              id="btn-print-certificate"
              onClick={() => window.print()}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-w-[170px] cursor-pointer"
            >
              Cetak Kartu Hasil
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
