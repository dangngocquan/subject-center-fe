import React, { useEffect, useState, useCallback } from "react";
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
  selected: Set<string> | undefined;
  onHandleSelection: (genCode: string, isChecked: boolean) => void;
  isEditMode: boolean;
}

const CurriculumGraph: React.FC<CurriculumGraphProps> = ({
  major,
  selected,
  onHandleSelection,
  isEditMode,
}) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    marginLeft: "auto",
    marginRight: "auto",
    border: "2px solid #00b7ff",
    borderRadius: "15px",
    background: "linear-gradient(145deg, #0a1a2f, #1a2a4f)",
    boxShadow:
      "0 0 20px rgba(0, 183, 255, 0.5), inset 0 0 10px rgba(0, 183, 255, 0.3)",
    padding: "10px",
    overflow: "hidden" as const,
  };

  const baseSubjectCardStyle = {
    backgroundColor: "#fff",
    borderRadius: "2px",
    padding: "12px",
    width: "200px",
    boxShadow: "0 2px 8px rgba(34, 255, 0, 0.2)",
    textAlign: "center" as const,
    transition: "all 0.2s ease",
    wordBreak: "break-word" as const,
    overflow: "hidden" as const,
  };

  const subjectCardPStyle = {
    marginTop: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    marginRight: "0px",
    fontSize: "0.9em",
  };

  const subjectCardStrongStyle = {
    color: "#007bff",
    fontWeight: "bold" as const,
  };

  useEffect(() => {
    if (major && major.items) {
      const calculatedTiers = calculateTiers(major.items);
      setTiers(calculatedTiers);
    } else {
      setTiers([]);
    }
  }, [major]);

  const toggleFullscreen = useCallback(() => {
    const container = document.getElementById("curriculum-graph-container");
    if (!container) return;

    if (!isFullscreen) {
      container
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Failed to enter fullscreen:", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Failed to exit fullscreen:", err));
    }
  }, [isFullscreen]);

  const getVisibleSubjects = (selectedCode: string | null): Set<string> => {
    const visibleSubjects = new Set<string>();
    if (!selectedCode || !major) {
      major?.items.forEach((item) => {
        if (item.genCode) visibleSubjects.add(item.genCode);
      });
      return visibleSubjects;
    }

    const selected = major.items.find(
      (item) => item.code === selectedCode || item.genCode === selectedCode
    );
    if (!selected) return visibleSubjects;

    if (selected.genCode) visibleSubjects.add(selected.genCode);

    if (selected.prerequisites) {
      selected.prerequisites.forEach((prereqCode) => {
        const prereqItem = major.items.find(
          (item) => item.code === prereqCode || item.genCode === prereqCode
        );
        if (prereqItem?.genCode) visibleSubjects.add(prereqItem.genCode);
      });
    }

    major.items.forEach((item) => {
      if (
        item.prerequisites?.some(
          (prereq) => prereq === selected.code || prereq === selected.genCode
        ) &&
        item.genCode
      ) {
        visibleSubjects.add(item.genCode);
      }
    });

    return visibleSubjects;
  };

  const visibleSubjects = getVisibleSubjects(selectedSubject);

  const handleNodeClick = (genCode: string) => {
    setSelectedSubject(selectedSubject === genCode ? null : genCode);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    genCode: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedSubject(selectedSubject === genCode ? null : genCode);
    }
  };

  const tierWidths = tiers.map(
    (tier) => tier.elements.filter((e) => e.type === "subject").length * 220
  );
  const maxWidth = Math.max(...tierWidths, 300);

  const nodes: Node[] = tiers.flatMap((tier, tierIndex) => {
    const subjectsInTier = tier.elements.filter((e) => e.type === "subject");
    const tierWidth = subjectsInTier.length * 220;
    const offsetX = (maxWidth - tierWidth) / 2;

    return subjectsInTier
      .map((element, elemIndex) => {
        const subject = element.subject;
        const nodeId = `${subject.genCode}-${tier.level}`;
        const genCode = subject.genCode;

        if (selectedSubject && !visibleSubjects.has(genCode)) return null;

        const subjectCardStyle = {
          ...baseSubjectCardStyle,
          background: selected?.has(genCode)
            ? "rgba(144, 238, 144, 0.6)"
            : "#fff",
        };

        return {
          id: nodeId,
          data: {
            label: (
              <div
                style={{
                  ...subjectCardStyle,
                  border: selected?.has(genCode)
                    ? "2px solid #28a745"
                    : "1px solid #00b7ff",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {isEditMode && (
                    <input
                      className="form-check-input"
                      checked={selected?.has(genCode) || false}
                      style={{ marginRight: "8px", marginTop: "4px" }}
                      type="checkbox"
                      onChange={(e) => {
                        e.stopPropagation();
                        onHandleSelection(genCode, e.target.checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div
                    role="button"
                    style={{ flexGrow: 1, cursor: "pointer" }}
                    tabIndex={0}
                    onClick={() => handleNodeClick(genCode)}
                    onKeyDown={(e) => handleKeyDown(e, genCode)}
                  >
                    <p
                      style={{
                        ...subjectCardPStyle,
                        ...subjectCardStrongStyle,
                        marginBottom: "6px",
                      }}
                    >
                      {subject.code || subject.genCode}
                    </p>
                    <p
                      style={{
                        ...subjectCardPStyle,
                        fontSize: "0.85em",
                        color: "#555",
                        marginBottom: "4px",
                        lineHeight: "1.2",
                      }}
                    >
                      {subject.name || "No name available"}
                    </p>
                    <p
                      style={{
                        ...subjectCardPStyle,
                        fontSize: "0.8em",
                        color: "#00b7ff",
                        marginBottom: "0px",
                      }}
                    >
                      {subject.credit !== undefined
                        ? `${subject.credit} credits`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          position: {
            x: offsetX + elemIndex * 220,
            y: tierIndex * 200,
          },
          style: { width: 200, padding: 0 },
        };
      })
      .filter(Boolean) as Node[];
  });

  const edges: Edge[] = tiers.flatMap((tier) => {
    return tier.elements
      .filter((e) => e.type === "subject" && e.subject.prerequisites)
      .flatMap((element: Tier["elements"][number]) => {
        const subject = element.subject;
        const targetId = `${String(subject?.genCode)}-${tier.level}`;

        return (subject?.prerequisites || [])
          .map((prereqCode, index) => {
            const prereqItem = major?.items.find(
              (item) => item.code === prereqCode || item.genCode === prereqCode
            );
            if (!prereqItem) return null;

            const prereqGenCode = prereqItem.genCode;
            const prereqTier = tiers.find((t) =>
              t.elements.some(
                (e) =>
                  e.type === "subject" && e.subject.genCode === prereqGenCode
              )
            );
            const sourceId = `${prereqGenCode}-${prereqTier?.level || 0}`;

            const sourceNode = nodes.find((n) => n.id === sourceId);
            const targetNode = nodes.find((n) => n.id === targetId);

            if (!sourceNode || !targetNode) return null;

            if (
              selectedSubject &&
              !visibleSubjects.has(prereqGenCode) &&
              !visibleSubjects.has(String(subject?.genCode))
            ) {
              return null;
            }

            const controlX =
              (sourceNode.position.x + targetNode.position.x) / 2;
            const controlY = sourceNode.position.y - 50;

            return {
              id: `${sourceId}-${targetId}-${index}`,
              source: sourceId,
              target: targetId,
              type: "bezier",
              animated: true,
              style: { stroke: "#00b7ff", strokeWidth: 2 },
              arrowHeadType: "arrowclosed",
              markerEnd: { type: "arrowclosed", color: "#00b7ff" },
              pathOptions: { curvature: 0.5 },
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
      <div id="curriculum-graph-container" style={tabletContainerStyle}>
        <ReactFlow
          defaultZoom={0.4}
          edges={edges}
          maxZoom={5}
          minZoom={0.2}
          nodes={nodes}
          nodesDraggable={false}
          panOnDrag={true}
          preventScrolling={true}
          style={{ width: "100%", height: "100%" }}
          zoomOnScroll={true}
        >
          <Background
            color="#00b7ff"
            gap={50}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
        <button
          onClick={toggleFullscreen}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            padding: "8px 16px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );
};

export default CurriculumGraph;
