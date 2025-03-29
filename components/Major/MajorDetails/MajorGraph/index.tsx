// components/CurriculumGraph.tsx
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import styles from "./index.module.css";
import { Major, MajorItem } from "@/types/major";

interface Tier {
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

interface CurriculumGraphProps {
  major?: Major | null;
}

const CurriculumGraph: React.FC<CurriculumGraphProps> = ({ major }) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const subjectRefs = useRef<Map<string, DOMRect>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [initialScale, setInitialScale] = useState(1);

  const calculateTiers = (items: MajorItem[]): Tier[] => {
    const subjectMap = new Map<string, MajorItem>();
    const tierMap = new Map<number, MajorItem[]>();

    // Populate subject map for prerequisite lookup
    items.forEach((item) => {
      if (item.code) subjectMap.set(item.code, item);
    });

    // Step 1: Assign initial tiers based on "khởi đầu" (parentGenCode = null, isLeaf = false)
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

    // Step 2: Group related subjects (similar to GroupSubject in sortMap4)
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
        if (item.prerequisites && item.prerequisites.includes(subject.code!)) {
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

    // Step 3: Adjust levels based on prerequisites within each group
    const assignLevels = (
      item: MajorItem,
      visited: Set<string> = new Set()
    ): number => {
      if (!item.code || !item.isLeaf)
        return levelAssignments.get(item.code!) || 0;
      if (visited.has(item.code)) return levelAssignments.get(item.code!) || 0;
      visited.add(item.code);

      let maxPrerequisiteLevel = levelAssignments.get(item.code!) || 0;
      if (item.prerequisites && item.prerequisites.length > 0) {
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

    groups.forEach((group) => {
      group.subjects.forEach((subject) => {
        assignLevels(subject);
      });
    });

    // Step 4: Group subjects by level and preserve group clustering
    groups.forEach((group) => {
      group.subjects.forEach((subject) => {
        if (subject.isLeaf && subject.code) {
          const level = levelAssignments.get(subject.code) || 0;
          if (!tierMap.has(level)) tierMap.set(level, []);
          tierMap.get(level)!.push(subject);
        }
      });
    });

    // Step 5: Create sorted tiers
    const sortedTiers: Tier[] = Array.from(tierMap.entries())
      .map(([level, subjects]) => ({
        level,
        elements: [] as Array<
          | { type: "subject"; subject: MajorItem }
          | { type: "spacer"; id: string }
          | { type: "groupSpacer"; id: string }
        >,
      }))
      .sort((a, b) => a.level - b.level);

    // Step 6: Sort subjects within each tier to maintain group clustering
    sortedTiers.forEach((tier) => {
      const groupedElements: Array<
        | { type: "subject"; subject: MajorItem }
        | { type: "spacer"; id: string }
        | { type: "groupSpacer"; id: string }
      > = [];
      const groupIndices: { group: Group; subjectsInTier: MajorItem[] }[] = [];

      // Collect subjects in this tier for each group
      groups.forEach((group) => {
        const subjectsInTier = group.subjects.filter((subject) => {
          const level = levelAssignments.get(subject.code!) || 0;
          return level === tier.level;
        });
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

      // Add subjects from each group, with group spacers between groups
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

    // Step 7: Add padding spacers to center each tier
    const maxSubjectsInTier = Math.max(
      ...sortedTiers.map(
        (tier) => tier.elements.filter((e) => e.type === "subject").length
      )
    );
    sortedTiers.forEach((tier) => {
      const numSubjects = tier.elements.filter(
        (e) => e.type === "subject"
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

  // Step 8: Determine visible subjects when hovering
  const getVisibleSubjects = (hoveredCode: string | null): Set<string> => {
    const visibleSubjects = new Set<string>();
    if (!hoveredCode) return visibleSubjects;

    const hovered = major?.items.find((item) => item.code === hoveredCode);
    if (!hovered) return visibleSubjects;

    visibleSubjects.add(hoveredCode);

    if (hovered.prerequisites) {
      hovered.prerequisites.forEach((prereqCode) => {
        visibleSubjects.add(prereqCode);
      });
    }

    major?.items.forEach((item) => {
      if (item.prerequisites && item.prerequisites.includes(hoveredCode)) {
        if (item.code) visibleSubjects.add(item.code);
      }
    });

    return visibleSubjects;
  };

  const visibleSubjects = getVisibleSubjects(hoveredSubject);

  // Calculate dimensions of the diagram
  const diagramWidth =
    tiers.length > 0
      ? Math.max(...tiers.map((tier) => tier.elements.length * 120))
      : 1200;
  const diagramHeight = tiers.length * 150;

  // Calculate initial scale to fit the diagram width within the parent container
  useEffect(() => {
    if (graphContainerRef.current) {
      const parentWidth = graphContainerRef.current.clientWidth - 40; // Subtract padding (20px on each side)
      const initialScaleValue = Math.min(1, parentWidth / diagramWidth);
      setInitialScale(initialScaleValue);
      setScale(initialScaleValue);
    }
  }, [diagramWidth, tiers]);

  useLayoutEffect(() => {
    const updatePositions = () => {
      subjectRefs.current.clear();
      tiers.forEach((tier) => {
        tier.elements.forEach((element) => {
          if (element.type !== "subject") return;
          const subject = element.subject;
          const elementDom = document.getElementById(
            `${subject.code || subject.genCode}-${tier.level}`
          );
          if (elementDom) {
            const tabletRect = tabletRef.current?.getBoundingClientRect();
            const rect = elementDom.getBoundingClientRect();
            // Adjust position relative to the tablet container, scale, and translate
            const adjustedLeft =
              (rect.left - (tabletRect?.left || 0)) / scale - translate.x;
            const adjustedTop =
              (rect.top - (tabletRect?.top || 0)) / scale - translate.y;
            subjectRefs.current.set(subject.code || subject.genCode, {
              ...rect,
              left: adjustedLeft,
              top: adjustedTop,
              bottom: adjustedTop + rect.height / scale,
              right: adjustedLeft + rect.width / scale,
              x: adjustedLeft,
              y: adjustedTop,
              width: rect.width / scale,
              height: rect.height / scale,
            } as DOMRect);
          }
        });
      });
      setForceRender((prev) => prev + 1);
    };

    updatePositions();

    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [tiers, hoveredSubject, scale, translate]);

  const renderArrows = () => {
    const arrows: JSX.Element[] = [];
    const containerRect = svgRef.current?.getBoundingClientRect();

    if (!containerRect) return arrows;

    tiers.forEach((tier) => {
      tier.elements.forEach((element) => {
        if (element.type !== "subject") return;
        const subject = element.subject;
        if (hoveredSubject && !visibleSubjects.has(subject.code!)) return;

        if (subject.prerequisites && subject.prerequisites.length > 0) {
          const targetRect = subjectRefs.current.get(
            subject.code || subject.genCode
          );
          if (!targetRect) return;

          subject.prerequisites.forEach((prereqCode, prereqIndex) => {
            if (hoveredSubject && !visibleSubjects.has(prereqCode)) return;

            const sourceRect = subjectRefs.current.get(prereqCode);
            if (!sourceRect) return;

            const startX = sourceRect.left + sourceRect.width / 2;
            const startY = sourceRect.bottom;
            const endX = targetRect.left + targetRect.width / 2;
            const endY = targetRect.top;

            arrows.push(
              <path
                key={`${prereqCode}-${subject.code || subject.genCode}-${prereqIndex}`}
                d={`M${startX},${startY} L${endX},${endY}`}
                stroke="#00b7ff"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          });
        }
      });
    });

    return arrows;
  };

  useEffect(() => {
    if (major && major.items) {
      const calculatedTiers = calculateTiers(major.items);
      setTiers(calculatedTiers);
    } else {
      setTiers([]);
    }
  }, [major]);

  if (!major) {
    return (
      <div className={styles.graphContainer}>
        <p>Loading curriculum data...</p>
      </div>
    );
  }

  return (
    <div className={styles.graphContainer} ref={graphContainerRef}>
      <h2>{major.name}</h2>
      <div className={styles.tabletContainer} ref={tabletRef}>
        <svg
          ref={svgRef}
          className={styles.svgOverlay}
          style={{
            width: `${diagramWidth}px`,
            height: `${diagramHeight}px`,
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#00b7ff" />
            </marker>
          </defs>
          {renderArrows()}
        </svg>
        <div
          className={styles.graphContent}
          style={{
            width: `${diagramWidth}px`,
            height: `${diagramHeight}px`,
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          {tiers.length > 0 ? (
            tiers.map((tier) => (
              <div key={tier.level} className={styles.tier}>
                <h3>Tier {tier.level}</h3>
                <div className={styles.subjectRow}>
                  {tier.elements.map((element, index) => {
                    if (element.type === "spacer") {
                      return <div key={element.id} className={styles.spacer} />;
                    }
                    if (element.type === "groupSpacer") {
                      return (
                        <div key={element.id} className={styles.groupSpacer} />
                      );
                    }

                    const subject = element.subject;
                    const isVisible =
                      !hoveredSubject || visibleSubjects.has(subject.code!);

                    return (
                      <div
                        id={`${subject.code || subject.genCode}-${tier.level}`}
                        key={`${subject.code || subject.genCode}-${index}`}
                        className={`${styles.subjectCard} ${!isVisible ? styles.hidden : ""}`}
                        onMouseEnter={() => setHoveredSubject(subject.code!)}
                        onMouseLeave={() => setHoveredSubject(null)}
                      >
                        <p>
                          <strong>{subject.code || subject.genCode}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p>No subjects available to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumGraph;
