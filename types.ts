export interface AnalysisResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tailoredResumeText: string;
  jobTitle: string;
}

export interface FullAnalysis extends AnalysisResult {
    originalResume: string;
    timestamp: string;
    id: string;
    coverLetterText?: string;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error';
}

export type Page = 'dashboard' | 'history' | 'profile';