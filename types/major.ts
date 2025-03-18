interface MajorItem {
  genCode: string;
  parentGenCode?: string | null;
  stt?: string;
  courseCode?: string | null;
  nameVn: string;
  credits?: number | null;
  prerequisiteCodes?: string | null;
  level: number;
  selectionRule?: "ALL" | "ONE" | "MULTI" | null;
  minCredits?: number | null;
  minChildren?: number | null;
  isLeaf: boolean;
}

interface Major {
  items: MajorItem[];
}
