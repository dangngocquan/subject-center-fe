import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  // MiniMap,
  Node,
  Edge,
  BackgroundVariant,
} from "react-flow-renderer";

import styles from "./index.module.css";
import { calculateTiers, Tier } from "./utils";

import { Major } from "@/types/major";

interface CurriculumGraphProps {
  major?: Major | null;
}

const CurriculumGraph: React.FC<CurriculumGraphProps> = ({ major }) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    if (major && major.items) {
      const calculatedTiers = calculateTiers(major.items);
      setTiers(calculatedTiers);
    } else {
      setTiers([]);
    }
  }, [major]);

  const getVisibleSubjects = (selectedCode: string | null): Set<string> => {
    const visibleSubjects = new Set<string>();
    if (!selectedCode || !major) return visibleSubjects;

    const selected = major.items.find((item) => item.code === selectedCode);
    if (!selected) return visibleSubjects;

    visibleSubjects.add(selectedCode);

    if (selected.prerequisites) {
      selected.prerequisites.forEach((prereqCode) => {
        visibleSubjects.add(prereqCode);
      });
    }

    major.items.forEach((item) => {
      if (item.prerequisites?.includes(selectedCode) && item.code) {
        visibleSubjects.add(item.code);
      }
    });

    return visibleSubjects;
  };

  const visibleSubjects = getVisibleSubjects(selectedSubject);

  const handleNodeClick = (code: string) => {
    setSelectedSubject(selectedSubject === code ? null : code);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    code: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Ngăn cuộn trang khi nhấn Space
      setSelectedSubject(selectedSubject === code ? null : code);
    }
  };

  const nodes: Node[] = tiers.flatMap(
    (tier, tierIndex) =>
      tier.elements
        .map((element: Tier["elements"][number], elemIndex: number) => {
          if (element?.type !== "subject") return null;
          if (element.type !== "subject") return null;
          const subject = element.subject;
          const nodeId = `${subject.code || subject.genCode}-${tier.level}`;
          if (selectedSubject && !visibleSubjects.has(subject.code!))
            return null;
          return {
            id: nodeId,
            data: {
              label: (
                <div
                  className={styles.subjectCard}
                  role="button" // Thêm role để tuân thủ a11y
                  tabIndex={0} // Cho phép focus bằng bàn phím
                  onClick={() => handleNodeClick(subject.code!)}
                  onKeyDown={(e) => handleKeyDown(e, subject.code!)}
                >
                  <p>
                    <strong>{subject.code || subject.genCode}</strong>
                  </p>
                </div>
              ),
            },
            position: { x: elemIndex * 120, y: tierIndex * 150 },
            style: {
              width: 100,
              padding: 0,
            },
          };
        })
        .filter(Boolean) as Node[],
  );

  const edges: Edge[] = tiers.flatMap((tier) =>
    tier.elements
      .filter((e) => e.type === "subject" && e.subject.prerequisites)
      .flatMap((element: Tier["elements"][number]) => {
        if (element.type !== "subject") return null;
        const subject = element.subject;
        const targetId = `${subject.code || subject.genCode}-${tier.level}`;
        if (selectedSubject && !visibleSubjects.has(subject.code!)) return [];
        return (subject.prerequisites || [])
          .map((prereqCode: string, index: number) => {
            const prereqTier = tiers.find((t) =>
              t.elements.some(
                (e) =>
                  e.type === "subject" &&
                  (e.subject.code === prereqCode ||
                    e.subject.genCode === prereqCode),
              ),
            );
            const sourceId = `${prereqCode}-${prereqTier?.level || 0}`;
            if (selectedSubject && !visibleSubjects.has(prereqCode))
              return null;
            return {
              id: `${sourceId}-${targetId}-${index}`,
              source: sourceId,
              target: targetId,
              type: "smoothstep",
              animated: true,
              style: {
                stroke: "#00b7ff",
                strokeWidth: 2,
              },
              arrowHeadType: "arrowclosed",
              markerEnd: {
                type: "arrowclosed",
                color: "#00b7ff",
              },
            };
          })
          .filter(Boolean) as Edge[];
      })
      .flat()
      .filter((edge): edge is Edge => edge !== null),
  );

  if (!major) {
    return (
      <div className={styles.graphContainer}>
        <p>Loading curriculum data...</p>
      </div>
    );
  }

  return (
    <div className={styles.graphContainer}>
      <h2>{major.name}</h2>
      <div className={styles.tabletContainer}>
        <ReactFlow
          defaultZoom={1}
          edges={edges}
          maxZoom={5}
          minZoom={0.2}
          nodes={nodes}
          nodesDraggable={false}
          panOnDrag={true}
          preventScrolling={false}
          style={{ width: "100%", height: "100%" }}
          zoomOnScroll={false}
        >
          <Background
            color="#00b7ff"
            gap={50}
            variant={BackgroundVariant.Dots}
          />
          {/* <Controls showZoom={true} showInteractive={false} /> */}
          {/* <MiniMap nodeColor={(node) => "#00b7ff"} nodeStrokeWidth={3} /> */}
        </ReactFlow>
      </div>
    </div>
  );
};

export default CurriculumGraph;
