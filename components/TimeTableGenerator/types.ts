// components/TimeTable/types.ts
export interface CourseItem {
  courseCode: string;
  courseName: string;
  classCode: string;
  dayOfWeek: number;
  period: number[];
  credits: number;
}

export interface TimeTable {
  courses: CourseItem[];
  totalCredits: number;
}
