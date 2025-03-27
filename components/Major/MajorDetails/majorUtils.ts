import { MajorItem } from "@/types/major";

interface MajorItemWithChildren extends MajorItem {
  children: MajorItemWithChildren[];
}

export const buildTree = (items: MajorItem[]): MajorItemWithChildren[] => {
  const itemMap = new Map<string, MajorItemWithChildren>();
  const roots: MajorItemWithChildren[] = [];

  items.forEach((item) => {
    itemMap.set(item.genCode, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = itemMap.get(item.genCode)!;
    if (item.parentGenCode === null) {
      roots.push(node);
    } else {
      const parent = itemMap.get(item.parentGenCode ?? "");
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};

export const flattenTree = (
  nodes: MajorItemWithChildren[],
  expanded: Set<string>,
  seen = new Set<string>()
): MajorItemWithChildren[] => {
  let result: MajorItemWithChildren[] = [];
  nodes.forEach((node) => {
    if (!seen.has(node.genCode)) {
      seen.add(node.genCode);
      result.push({ ...node, level: node.level });
      if (expanded.has(node.genCode) && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, expanded, seen));
      }
    }
  });
  return result;
};

export const calculateTotalCreditsAndCount = (
  node: MajorItemWithChildren,
  selected: Set<string>
): { totalCredits: number; totalCount: number } => {
  let totalCredits = 0;
  let totalCount = 0;

  if (node.isLeaf && selected.has(node.genCode) && node.credit !== null) {
    totalCredits += node.credit ?? 0;
    totalCount += 1;
  }

  node.children.forEach((child) => {
    const { totalCredits: childCredits, totalCount: childCount } =
      calculateTotalCreditsAndCount(child, selected);
    totalCredits += childCredits;
    totalCount += childCount;
  });

  return { totalCredits, totalCount };
};

export const findRequiredSubjects = (
  nodes: MajorItemWithChildren[],
  data: MajorItem[]
): Set<string> => {
  const requiredSubjects = new Set<string>();

  nodes.forEach((node) => {
    const children = node.children;
    const directLeaves = children.filter((child) => child.isLeaf);
    const subGroups = children.filter((child) => !child.isLeaf);

    let effectiveMinCredits = node.minCredits ?? null;
    if (effectiveMinCredits === null && node.minChildren !== null) {
      const leafCredits = directLeaves
        .map((leaf) => leaf.credit ?? 0)
        .filter((credits) => credits > 0)
        .sort((a, b) => a - b);
      const minChildCredits = leafCredits
        .slice(0, node.minChildren)
        .reduce((sum, cred) => sum + cred, 0);
      effectiveMinCredits = minChildCredits;
    }

    const totalDirectLeafCredits = directLeaves.reduce(
      (sum, leaf) => sum + (leaf.credit ?? 0),
      0
    );

    if (effectiveMinCredits !== null) {
      if (subGroups.length === 0 && directLeaves.length > 0) {
        if (effectiveMinCredits === totalDirectLeafCredits) {
          directLeaves.forEach((leaf) => requiredSubjects.add(leaf.genCode));
        }
      }

      if (subGroups.length > 0 && directLeaves.length > 0) {
        const sumSubGroupMinCredits = subGroups.reduce(
          (sum, group) => sum + (group.minCredits ?? 0),
          0
        );
        const remainingCredits = effectiveMinCredits - sumSubGroupMinCredits;
        if (remainingCredits === totalDirectLeafCredits) {
          directLeaves.forEach((leaf) => requiredSubjects.add(leaf.genCode));
        }
      }
    }

    if (subGroups.length > 0 && directLeaves.length === 0) {
      const subRequired = findRequiredSubjects(subGroups, data);
      subRequired.forEach((genCode) => requiredSubjects.add(genCode));
    }
  });

  return requiredSubjects;
};
