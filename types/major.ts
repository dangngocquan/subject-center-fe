export interface MajorItem {
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

export interface Major {
  id?: number;
  name: string;
  items: MajorItem[];
  updatedAt?: string | Date | number;
}

export interface MajorItemWithChildren extends MajorItem {
  children: MajorItemWithChildren[]; // Danh sách các mục con
}
