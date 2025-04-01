// PlanGraph/utils.ts
import { PlanItem } from "@/types/plan";

export interface Tier {
  level: number;
  elements: Array<{ type: "subject"; subject: PlanItem }>;
}

export const calculateTiers = (items: PlanItem[]): Tier[] => {
  const subjectMap = new Map<string, PlanItem>();
  const tierMap = new Map<number, PlanItem[]>();

  // Tạo map cho các môn học dựa trên code
  items.forEach((item) => {
    if (item.code) {
      subjectMap.set(item.code, item);
    }
  });

  // Gán cấp độ (tier) dựa trên prerequisites
  const levelAssignments = new Map<string, number>();

  const assignLevels = (
    item: PlanItem,
    visited: Set<string> = new Set()
  ): number => {
    if (!item.code || visited.has(item.code)) {
      return levelAssignments.get(String(item?.code)) || 0;
    }
    visited.add(item.code);

    let maxPrerequisiteLevel = 0;
    if (item.prerequisites?.length) {
      item.prerequisites.forEach((prereqCode) => {
        const prereq = subjectMap.get(prereqCode);
        if (prereq) {
          const prereqLevel = assignLevels(prereq, visited);
          maxPrerequisiteLevel = Math.max(
            maxPrerequisiteLevel,
            prereqLevel + 1
          );
        }
      });
    }
    levelAssignments.set(item.code, maxPrerequisiteLevel);
    return maxPrerequisiteLevel;
  };

  // Gán cấp độ cho tất cả các môn học
  items.forEach((item) => assignLevels(item));

  // Phân loại các môn học vào tierMap dựa trên cấp độ
  items.forEach((item) => {
    if (item.code) {
      const level = levelAssignments.get(item.code) || 0;
      if (!tierMap.has(level)) {
        tierMap.set(level, []);
      }
      tierMap.get(level)!.push(item);
    }
  });

  // Tạo danh sách tiers đã sắp xếp
  const sortedTiers: Tier[] = Array.from(tierMap.entries())
    .map(([level, subjects]) => ({
      level,
      elements: subjects.map((subject) => ({
        type: "subject" as const,
        subject,
      })),
    }))
    .sort((a, b) => a.level - b.level);

  return sortedTiers;
};
