import { MajorItem } from "@/types/major";

export interface Tier {
  level: number;
  elements: Array<
    | { type: "subject"; subject: MajorItem }
    | { type: "spacer"; id: string }
    | { type: "groupSpacer"; id: string }
  >;
}

interface Group {
  subjects: MajorItem[];
}

export const calculateTiers = (items: MajorItem[]): Tier[] => {
  const subjectMap = new Map<string, MajorItem>();
  const tierMap = new Map<number, MajorItem[]>();

  items.forEach((item) => {
    if (item.code) subjectMap.set(item.code, item);
  });

  let currentLevel = -1;
  const levelAssignments = new Map<string, number>();

  items.forEach((item) => {
    if (item.parentGenCode === null && !item.isLeaf) {
      currentLevel += 1;
    }
    if (item.isLeaf && item.code) {
      levelAssignments.set(item.code, currentLevel);
    }
  });

  const groups: Group[] = [];
  const isGrouped = new Map<string, boolean>();

  items.forEach((item) => {
    if (item.code) isGrouped.set(item.code, false);
  });

  const getRelatedSubjects = (subject: MajorItem): MajorItem[] => {
    const related: MajorItem[] = [];
    if (subject.prerequisites) {
      subject.prerequisites.forEach((prereqCode) => {
        const prereq = subjectMap.get(prereqCode);
        if (prereq) related.push(prereq);
      });
    }
    items.forEach((item) => {
      if (item.prerequisites?.includes(subject.code!)) {
        related.push(item);
      }
    });
    return related;
  };

  items.forEach((item) => {
    if (!item.isLeaf || !item.code || isGrouped.get(item.code)) return;

    const group: Group = { subjects: [] };
    const queue: MajorItem[] = [item];
    isGrouped.set(item.code, true);
    group.subjects.push(item);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const related = getRelatedSubjects(current);
      related.forEach((relatedSubject) => {
        if (
          relatedSubject.isLeaf &&
          relatedSubject.code &&
          !isGrouped.get(relatedSubject.code)
        ) {
          queue.push(relatedSubject);
          isGrouped.set(relatedSubject.code, true);
          group.subjects.push(relatedSubject);
        }
      });
    }
    groups.push(group);
  });

  const assignLevels = (
    item: MajorItem,
    visited: Set<string> = new Set(),
  ): number => {
    if (!item.code || !item.isLeaf)
      return levelAssignments.get(item.code!) || 0;
    if (visited.has(item.code)) return levelAssignments.get(item.code!) || 0;
    visited.add(item.code);

    let maxPrerequisiteLevel = levelAssignments.get(item.code!) || 0;
    if (item.prerequisites?.length) {
      item.prerequisites.forEach((prereqCode) => {
        const prereq = subjectMap.get(prereqCode);
        if (prereq) {
          const prereqLevel = assignLevels(prereq, visited);
          maxPrerequisiteLevel = Math.max(
            maxPrerequisiteLevel,
            prereqLevel + 1,
          );
        }
      });
    }
    levelAssignments.set(item.code, maxPrerequisiteLevel);
    return maxPrerequisiteLevel;
  };

  groups.forEach((group) => {
    group.subjects.forEach((subject) => assignLevels(subject));
  });

  groups.forEach((group) => {
    group.subjects.forEach((subject) => {
      if (subject.isLeaf && subject.code) {
        const level = levelAssignments.get(subject.code) || 0;
        if (!tierMap.has(level)) tierMap.set(level, []);
        tierMap.get(level)!.push(subject);
      }
    });
  });

  const sortedTiers: Tier[] = Array.from(tierMap.entries())
    .map(([level, subjects]) => ({
      level,
      elements: [] as Tier["elements"],
    }))
    .sort((a, b) => a.level - b.level);

  sortedTiers.forEach((tier) => {
    const groupedElements: Tier["elements"] = [];
    const groupIndices: { group: Group; subjectsInTier: MajorItem[] }[] = [];

    groups.forEach((group) => {
      const subjectsInTier = group.subjects.filter(
        (subject) => (levelAssignments.get(subject.code!) || 0) === tier.level,
      );
      if (subjectsInTier.length > 0) {
        subjectsInTier.sort((a, b) => {
          const aPrereqs = a.prerequisites || [];
          const bPrereqs = b.prerequisites || [];
          if (bPrereqs.includes(a.code!)) return -1;
          if (aPrereqs.includes(b.code!)) return 1;
          return (a.code || a.genCode).localeCompare(b.code || b.genCode);
        });
        groupIndices.push({ group, subjectsInTier });
      }
    });

    groupIndices.forEach(({ subjectsInTier }, groupIndex) => {
      subjectsInTier.forEach((subject) => {
        groupedElements.push({ type: "subject", subject });
      });
      if (groupIndex < groupIndices.length - 1) {
        groupedElements.push({
          type: "groupSpacer",
          id: `group-spacer-${tier.level}-${groupIndex}`,
        });
      }
    });

    tier.elements = groupedElements;
  });

  const maxSubjectsInTier = Math.max(
    ...sortedTiers.map(
      (tier) => tier.elements.filter((e) => e.type === "subject").length,
    ),
  );
  sortedTiers.forEach((tier) => {
    const numSubjects = tier.elements.filter(
      (e) => e.type === "subject",
    ).length;
    const paddingCount = Math.max(0, (maxSubjectsInTier - numSubjects) / 2);

    for (let i = 0; i < Math.floor(paddingCount); i++) {
      tier.elements.unshift({
        type: "spacer",
        id: `left-spacer-${tier.level}-${i}`,
      });
    }
    for (let i = 0; i < Math.ceil(paddingCount); i++) {
      tier.elements.push({
        type: "spacer",
        id: `right-spacer-${tier.level}-${i}`,
      });
    }
  });

  return sortedTiers;
};
