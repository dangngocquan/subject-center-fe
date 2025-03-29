import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
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
      event.preventDefault();
      setSelectedSubject(selectedSubject === code ? null : code);
    }
  };

  // Tính toán chiều rộng tối đa của mỗi tier
  const tierWidths = tiers.map(
    (tier) => tier.elements.filter((e) => e.type === "subject").length * 150, // 150px mỗi node + khoảng cách
  );
  const maxWidth = Math.max(...tierWidths, 300); // Đảm bảo chiều rộng tối thiểu

  // Tạo nodes với vị trí thông minh
  const nodes: Node[] = tiers.flatMap((tier, tierIndex) => {
    const subjectsInTier = tier.elements.filter((e) => e.type === "subject");
    const tierWidth = subjectsInTier.length * 150;
    const offsetX = (maxWidth - tierWidth) / 2; // Căn giữa tier

    return subjectsInTier
      .map((element, elemIndex) => {
        const subject = element.subject;
        const nodeId = `${subject.code || subject.genCode}-${tier.level}`;
        if (selectedSubject && !visibleSubjects.has(subject.code!)) return null;
        return {
          id: nodeId,
          data: {
            label: (
              <div
                className={styles.subjectCard}
                role="button"
                tabIndex={0}
                onClick={() => handleNodeClick(subject.code!)}
                onKeyDown={(e) => handleKeyDown(e, subject.code!)}
              >
                <p>
                  <strong>{subject.code || subject.genCode}</strong>
                </p>
              </div>
            ),
          },
          position: {
            x: offsetX + elemIndex * 150, // Khoảng cách lớn hơn giữa node
            y: tierIndex * 200, // Tăng khoảng cách giữa tier
          },
          style: {
            width: 100,
            padding: 0,
          },
        };
      })
      .filter(Boolean) as Node[];
  });

  // Tạo edges với đường cong tránh node
  const edges: Edge[] = tiers.flatMap((tier) => {
    return tier.elements
      .filter((e) => e.type === "subject" && e.subject.prerequisites)
      .flatMap((element: Tier["elements"][number]) => {
        const subject = element.subject;
        const targetId = `${subject?.code || subject?.genCode}-${tier.level}`;
        if (selectedSubject && !visibleSubjects.has(subject?.code!)) return [];
        return (subject?.prerequisites || [])
          .map((prereqCode, index) => {
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

            // Tìm vị trí của source và target node
            const sourceNode = nodes.find((n) => n.id === sourceId);
            const targetNode = nodes.find((n) => n.id === targetId);
            if (!sourceNode || !targetNode) return null;

            // Tính điểm điều khiển để đường cong tránh node
            const controlX =
              (sourceNode.position.x + targetNode.position.x) / 2;
            const controlY = sourceNode.position.y - 50; // Điểm điều khiển nằm trên source

            return {
              id: `${sourceId}-${targetId}-${index}`,
              source: sourceId,
              target: targetId,
              type: "bezier",
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
              pathOptions: {
                curvature: 0.5, // Độ cong của đường
              },
            };
          })
          .filter(Boolean) as Edge[];
      })
      .flat();
  });

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
        </ReactFlow>
      </div>
    </div>
  );
};

export default CurriculumGraph;
