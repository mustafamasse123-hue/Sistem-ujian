import { Question, QuestionType, QuestionOption } from '../types';

/**
 * Smart natural-language question parser that processes raw text blocks
 * pasted by an admin. Automatically detects questions, options, correct answers,
 * and explanations.
 */
export function parseQuestionsText(text: string, startId: number = 1): Question[] {
  if (!text.trim()) return [];

  // Split raw text into individual question blocks
  // Try to split on double newlines or lines starting with numeric markers (e.g., "1.", "2)")
  const lines = text.split('\n').map(line => line.trim());
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') {
      continue;
    }

    // A block start is often a line starting with numeric markers like "Soal 1.", "1.", "1)", "[1]"
    const isNewQuestionStart = /^(?:soal\s+)?\[?\d+[\.\)\]]/.test(line.toLowerCase());
    
    // If we detect a new question start and the current block already has some content,
    // let's wrap up the current block and start a new one.
    if (isNewQuestionStart && currentBlock.length > 0) {
      blocks.push(currentBlock);
      currentBlock = [];
    }

    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  // If we couldn't split by numeric markers, split by double newlines as blocks
  if (blocks.length <= 1) {
    const doubleNewlineBlocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    if (doubleNewlineBlocks.length > 1) {
      blocks.length = 0; // reset
      for (const b of doubleNewlineBlocks) {
        blocks.push(b.split('\n').map(l => l.trim()).filter(Boolean));
      }
    }
  }

  const parsedQuestions: Question[] = [];
  let currentId = startId;

  for (const block of blocks) {
    let questionText = '';
    const options: QuestionOption[] = [];
    let correctKey: string | string[] = '';
    let explanation = '';
    
    // Parsing state trackers
    let findingQuestionText = true;

    for (let i = 0; i < block.length; i++) {
      const line = block[i];
      
      // Detect Option patterns like "A. Rendah Hati", "b) Sombong", "[C] Baik"
      const optionMatch = line.match(/^([A-Ea-e])[\.\)\]]\s*(.*)$/);
      // Detect Answer key patterns like "Kunci: B", "Jawaban: A, B", "Kunci jawaban: B", "Key: A"
      const keyMatch = line.match(/^(?:kunci|jawaban|key|ans|correct)(?:\s*jawaban)?\s*[:\-=]\s*(.*)$/i);
      // Detect Explanation patterns like "Pembahasan: ...", "Penjelasan: ..."
      const explanationMatch = line.match(/^(?:pembahasan|penjelasan|explanation|info)\s*[:\-=]\s*(.*)$/i);

      if (keyMatch) {
        findingQuestionText = false;
        // Parse key
        const rawKey = keyMatch[1].trim().toUpperCase();
        // Extract all chars including A,B,C,D,E or words "BENAR", "SALAH"
        if (rawKey.includes('BENAR')) {
          correctKey = 'A'; // Usually Option A in true/false
        } else if (rawKey.includes('SALAH')) {
          correctKey = 'B'; // Usually Option B in true/false
        } else {
          // Extract options using regex
          const keysJoined = rawKey.match(/[A-E]/g);
          if (keysJoined && keysJoined.length > 0) {
            if (keysJoined.length === 1) {
              correctKey = keysJoined[0];
            } else {
              correctKey = keysJoined; // string[] for ganda kompleks
            }
          } else {
            correctKey = rawKey; // Fallback
          }
        }
      } else if (explanationMatch) {
        findingQuestionText = false;
        explanation = explanationMatch[1].trim();
        // Accumulate remaining lines of the block into the explanation
        for (let j = i + 1; j < block.length; j++) {
          explanation += ' ' + block[j].trim();
        }
        break; // explanation is typically the last element
      } else if (optionMatch) {
        findingQuestionText = false;
        const key = optionMatch[1].toUpperCase();
        const optionContent = optionMatch[2].trim();
        options.push({ key, text: optionContent });
      } else {
        if (findingQuestionText) {
          if (questionText) {
            questionText += ' ' + line;
          } else {
            questionText = line;
          }
        }
      }
    }

    // Clean question formatting (remove "1.", "Soal 1.", etc. from start)
    questionText = questionText.replace(/^(?:soal\s+)?\[?\d+[\.\)\]]\s*/i, '').trim();

    // Skip empty blocks
    if (!questionText) continue;

    // Post-processing missing elements and determining type
    let questionType: QuestionType = 'pilihan-ganda';

    // 1. Detect Benar-Salah
    const optionsLower = options.map(o => o.text.toLowerCase());
    const isTrueFalse = options.length === 2 && (
      (optionsLower[0] === 'benar' && optionsLower[1] === 'salah') ||
      (optionsLower[0] === 'salah' && optionsLower[1] === 'benar') ||
      (optionsLower[0] === 'true' && optionsLower[1] === 'false')
    );

    if (isTrueFalse) {
      questionType = 'benar-salah';
    } else if (Array.isArray(correctKey) && correctKey.length > 1) {
      questionType = 'pilihan-ganyak';
    } else {
      questionType = 'pilihan-ganda';
    }

    // Synthesize default options if empty
    if (options.length === 0) {
      if (questionType === 'benar-salah') {
        options.push({ key: 'A', text: 'Benar' });
        options.push({ key: 'B', text: 'Salah' });
      } else {
        // Fallback placeholder options
        options.push({ key: 'A', text: 'Opsi A' });
        options.push({ key: 'B', text: 'Opsi B' });
        options.push({ key: 'C', text: 'Opsi C' });
        options.push({ key: 'D', text: 'Opsi D' });
      }
    }

    // Synthesize correct key if empty
    if (!correctKey) {
      correctKey = options[0]?.key || 'A';
    }

    // Synthesize explanation if empty
    if (!explanation) {
      explanation = 'Kunci jawaban yang benar adalah ' + (Array.isArray(correctKey) ? correctKey.join(', ') : correctKey) + '.';
    }

    parsedQuestions.push({
      id: currentId++,
      type: questionType,
      questionText,
      options,
      correctKey,
      explanation
    });
  }

  return parsedQuestions;
}
