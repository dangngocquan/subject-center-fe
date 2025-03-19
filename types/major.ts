interface MajorItem {
  genCode: string;
  parentGenCode?: string | null;
  stt?: string;
  code?: string | null;
  name: string;
  credit?: number | null;
  prerequisites?: string[];
  level: number;
  selectionRule?: "ALL" | "ONE" | "MULTI" | null;
  minCredits?: number | null;
  minChildren?: number | null;
  isLeaf: boolean;
  majorId?: number;
}

interface Major {
  id?: number;
  name: string;
  items: MajorItem[];
  updatedAt?: string | Date | number;
}
