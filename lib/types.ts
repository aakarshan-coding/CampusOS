export type Activity = {
  id: string;
  title: string;
  at: string; // ISO
  type: "assignment" | "class" | "study" | "note";
};

export type PlanSession = {
  title: string;
  start: string; // ISO
  end: string; // ISO
  rationale?: string;
  source?: string; // e.g., “CSCE Lab 5”
};

export type WeeklyReport = {
  kpis: {
    studyHours: number;
    assignmentsCompleted: number;
    streakDays: number;
  };
  timeByCourse: { course: string; hours: number }[];
  highlights: string[];
};