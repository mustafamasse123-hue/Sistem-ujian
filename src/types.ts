/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'pilihan-ganda' | 'benar-salah' | 'pilihan-ganyak';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  questionText: string;
  options: QuestionOption[];
  correctKey: string | string[]; // string for 'pilihan-ganda'/'benar-salah', string[] for 'pilihan-ganyak'
  explanation: string;
}

export interface ExamState {
  currentQuestionIndex: number;
  answeredKeys: { [questionId: number]: string | string[] };
  incorrectAttempts: { [questionId: number]: boolean };
  correctStatus: { [questionId: number]: boolean }; // Track which ones are correctly answered
  timeLeftSeconds: number;
  isExamFinished: boolean;
  score: number;
  startTime: number;
  endTime: number | null;
}

export interface WelcomeScreenConfig {
  headerText: string;
  subheadText: string;
  titleText: string;
  descriptionText: string;
  classes: string[];
  rules: string[];
  footerText: string;
}

