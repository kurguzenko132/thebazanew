export type QuizQuestionType = "single_choice" | "multiple_choice" | "limited_multiple_choice" | "scale" | "text" | "date_preference" | "time_preference";
export type MatchingMode = "hard_filter" | "soft_score" | "availability" | "informational";

export type QuizTagWeight = {
  tagKey: string;
  weight: number;
};

export type QuizOption = {
  id: string;
  title: string;
  description?: string;
  tagWeights: QuizTagWeight[];
};

export type QuizQuestion = {
  id: string;
  title: string;
  description?: string;
  questionType: QuizQuestionType;
  matchingMode: MatchingMode;
  category: string;
  isRequired: boolean;
  maxSelections?: number;
  weight: number;
  options: QuizOption[];
};

export type QuizSettings = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  resultLimit: number;
  minimumMatchPercent: number;
  includeRatingBonus: boolean;
  includeAvailabilityBonus: boolean;
  isActive: boolean;
  categoryWeights: Record<string, number>;
};

export type QuizMaster = {
  id: string;
  name: string;
  role: string;
  rating: number;
  experienceYears: number;
  isActive: boolean;
  acceptsNewClients: boolean;
  services: string[];
  tagWeights: Record<string, number>;
  availability: string[];
  bookingUrl?: string;
};

export type QuizConfig = {
  settings: QuizSettings;
  questions: QuizQuestion[];
  masters: QuizMaster[];
};

export type SelectedAnswers = Record<string, string[]>;

export type QuizRecommendation = {
  masterId: string;
  name: string;
  role: string;
  matchPercent: number;
  rating: number;
  experienceYears: number;
  nearestAvailability: string;
  bookingUrl?: string;
  hasPreferredAvailability: boolean;
  reasons: string[];
  categoryScores: Record<string, { score: number; max: number }>;
};

export type QuizResult = {
  topScore: number;
  recommendations: QuizRecommendation[];
  tieCount: number;
};
