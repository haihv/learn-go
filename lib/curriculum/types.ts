export type ModuleType = "lesson" | "workshop" | "lab";

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type WorkshopStep = {
  instruction: string;
  hint: string;
  starterCode: string;
  validate: (code: string) => boolean;
  successMessage: string;
};

export type LabTest = {
  name: string;
  description: string;
  validate: (code: string, stdout: string) => boolean;
};

export type LessonModule = {
  type: "lesson";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  content: string;
  quiz: QuizQuestion[];
};

export type WorkshopModule = {
  type: "workshop";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  description: string;
  steps: WorkshopStep[];
};

export type LabModule = {
  type: "lab";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  description: string;
  instructions: string;
  starterCode: string;
  tests: LabTest[];
  solutionCode: string;
};

export type CourseModule = LessonModule | WorkshopModule | LabModule;
