import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  BackgroundVariant,
} from "react-flow-renderer";
import { calculateTiers, Tier } from "./utils";
import { Major } from "@/types/major";

interface CurriculumGraphProps {
  major?: Major | null;
}

const CurriculumGraph: React.FC<CurriculumGraphProps> = ({ major }) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Define styles as JavaScript objects
  const graphContainerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative" as const,
    width: "100%",
  };

  const tabletContainerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "600px",
    margin: "0 auto",
    border: "2px solid #00b7ff",
    borderRadius: "15px",
    background: "linear-gradient(145deg, #0a1a2f, #1a2a4f)",
    boxShadow:
      "0 0 20px rgba(0, 183, 255, 0.5), inset 0 0 10px rgba(0, 183, 255, 0.3)",
    padding: "10px",
    overflow: "hidden" as const,
  };

  const subjectCardStyle = {
    backgroundColor: "#f9f9f9",
    border: "1px solid #00b7ff",
    borderRadius: "5px",
    padding: "10px",
    width: "100px",
    boxShadow: "0 0 10px rgba(0, 183, 255, 0.3)",
    textAlign: "center" as const,
    background: "linear-gradient(145deg, #ffffff, #e0e0e0)",
  };

  const subjectCardPStyle = {
    margin: "0",
    fontSize: "0.9em",
  };

  const subjectCardStrongStyle = {
    color: "#00b7ff",
  };

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
    code: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedSubject(selectedSubject === code ? null : code);
    }
  };

  const tierWidths = tiers.map(
    (tier) => tier.elements.filter((e) => e.type === "subject").length * 150
  );
  const maxWidth = Math.max(...tierWidths, 300);

  const nodes: Node[] = tiers.flatMap((tier, tierIndex) => {
    const subjectsInTier = tier.elements.filter((e) => e.type === "subject");
    const tierWidth = subjectsInTier.length * 150;
    const offsetX = (maxWidth - tierWidth) / 2;

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
                style={subjectCardStyle}
                role="button"
                tabIndex={0}
                onClick={() => handleNodeClick(subject.code!)}
                onKeyDown={(e) => handleKeyDown(e, subject.code!)}
              >
                <p style={subjectCardPStyle}>
                  <strong style={subjectCardStrongStyle}>
                    {subject.code || subject.genCode}
                  </strong>
                </p>
              </div>
            ),
          },
          position: {
            x: offsetX + elemIndex * 150,
            y: tierIndex * 200,
          },
          style: {
            width: 100,
            padding: 0,
          },
        };
      })
      .filter(Boolean) as Node[];
  });

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
                    e.subject.genCode === prereqCode)
              )
            );
            const sourceId = `${prereqCode}-${prereqTier?.level || 0}`;
            if (selectedSubject && !visibleSubjects.has(prereqCode))
              return null;

            const sourceNode = nodes.find((n) => n.id === sourceId);
            const targetNode = nodes.find((n) => n.id === targetId);
            if (!sourceNode || !targetNode) return null;

            const controlX =
              (sourceNode.position.x + targetNode.position.x) / 2;
            const controlY = sourceNode.position.y - 50;

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
                curvature: 0.5,
              },
            };
          })
          .filter(Boolean) as Edge[];
      })
      .flat();
  });

  if (!major) {
    return (
      <div style={graphContainerStyle}>
        <p>Loading curriculum data...</p>
      </div>
    );
  }

  return (
    <div style={graphContainerStyle}>
      <div style={tabletContainerStyle}>
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
        </ReactFlow>
      </div>
    </div>
  );
};

export default CurriculumGraph;
