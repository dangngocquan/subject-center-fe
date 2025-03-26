export interface Plan {
  id?: string | undefined;
  name?: string;
  accountId?: string;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
  items?: PlanItem[];
  summary?: Credits;
}

export interface PlanItem {
  id?: number | string;
  planId?: string;
  name?: string;
  code?: string;
  credit?: number;
  grade4?: number | null;
  gradeLatin?: string | null;
  prerequisites?: string[];
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Credits {
  items: PlanItem[];
  totalCredits: number;
  totalSubjects: number;
  totalSubjectsCompleted: number;
  totalCreditsCompleted: number;
  totalSubjectsIncomplete: number;
  totalCreditsIncomplete: number;
  totalSubjectsCanImprovement: number;
  totalCreditsCanImprovement: number;
  currentCPA: number;
  grades: Record<string, any>;
  totalGradeCompleted: number;
  totalGradeCanImprovement: number;
}

export interface Mark {
  grade4: number;
  type: string;
  details: {
    content?: string;
    isPossibly?: boolean;
    cases?: {
      grades?: { gradeLatin?: string; credits?: number }[];
    }[];
  };
}

export interface PlanDetails {
  credits: Credits;
  cpa: {
    withoutImprovements: { marks: Mark[] };
    withImprovements: { marks: Mark[] };
  };
}

export interface PlanResultUpsert {
  plan: Plan;
  result: {
    name: string;
    code: string;
    status: "SUCCEEDED" | "FAILED";
    message: string;
  }[];
}

export interface ResponseImportUpdateGradePlan {
  id?: number;
  name?: string;
  items?: PlanItem[];
  accountId?: number;
  createdAt?: string;
  updatedAt?: string;
  result: {
    name?: string;
    code?: string;
    gradeLatin?: string;
    status?: "UPDATED" | "FAILED" | "NEW";
    message?: string;
  }[];
}

export interface ResponsePlanBulkUpsertResult {
  name: string;
  code: string;
  gradeLatin: string;
  status: "UPDATED" | "FAILED" | "NEW";
  message: string;
}

export interface ResponsePlanUpsert {
  id: number;
  name: string;
  items: PlanItem[];
  accountId: number;
  createdAt: string;
  updatedAt: string;
  result?: ResponsePlanBulkUpsertResult[];
  plan: Plan;
}
