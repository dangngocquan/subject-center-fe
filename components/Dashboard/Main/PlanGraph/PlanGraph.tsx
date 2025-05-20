import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  BackgroundVariant,
} from "react-flow-renderer";

import { calculateTiers, Tier } from "./utils";

import { PlanItem } from "@/types/plan";

interface PlanGraphProps {
  items: PlanItem[];
  planId: string | null;
  onDataChange?: () => void;
}

const PlanGraph: React.FC<PlanGraphProps> = React.memo(
  ({ items, planId, onDataChange }) => {
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
      border: "2px solid rgb(0, 0, 0)",
      borderRadius: "15px",
      background:
        "linear-gradient(145deg,rgb(255, 255, 255),rgb(255, 255, 255))",
      boxShadow:
        "0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.3)",
      padding: "10px",
      overflow: "hidden" as const,
    };

    const baseSubjectCardStyle = {
      borderRadius: "2px",
      padding: "12px",
      width: "200px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center" as const,
      transition: "all 0.2s ease",
      wordBreak: "break-word" as const,
      overflow: "hidden" as const,
      position: "relative" as const,
    };

    const subjectCardPStyle = { margin: "0", fontSize: "0.9em" };
    const subjectCardStrongStyle = {
      color: "#000000",
      fontWeight: "bold" as const,
    };
    const actionContainerStyle = {
      position: "absolute" as const,
      top: "4px",
      right: "4px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "2px",
    };

    const getGradeColor = (gradeLatin: string | null): string => {
      switch (gradeLatin) {
        case "A+":
          return "#00FF00";
        case "A":
          return "#66FF66";
        case "B+":
          return "#99FF99";
        case "B":
          return "#CCFF99";
        case "C+":
          return "#FFFF99";
        case "C":
          return "#FFCC66";
        case "D+":
          return "#FF9933";
        case "D":
          return "#FF6600";
        case "F":
          return "#FF0000";
        default:
          return "#FFFFFF";
      }
    };

    useEffect(() => {
      console.log("PlanGraph items:", items);
      if (items && items.length > 0) {
        const calculatedTiers = calculateTiers(items);
        setTiers(calculatedTiers);
      } else {
        setTiers([]);
      }
    }, [items]);

    useEffect(() => {
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          setIsFullscreen(false);
        } else {
          setIsFullscreen(true);
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
      };
    }, []);

    const toggleFullscreen = useCallback(() => {
      const container = document.getElementById("plan-graph-container");
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
      if (!selectedCode) {
        items.forEach((item) => item.code && visibleSubjects.add(item.code));
        return visibleSubjects;
      }
      const selected = items.find((item) => item.code === selectedCode);
      if (!selected || !selected.code) return visibleSubjects;

      visibleSubjects.add(selected.code);
      selected.prerequisites?.forEach((prereqCode) => {
        const prereqItem = items.find((item) => item.code === prereqCode);
        if (prereqItem?.code) visibleSubjects.add(prereqItem.code);
      });
      items.forEach((item) => {
        if (item.prerequisites?.includes(String(selected.code)) && item.code) {
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

    const nodes: Node[] = useMemo(() => {
      const tierWidths = tiers.map((tier) => tier.elements.length * 220);
      const maxWidth = Math.max(...tierWidths, 300);

      return tiers.flatMap((tier, tierIndex) => {
        const subjectsInTier = tier.elements;
        const tierWidth = subjectsInTier.length * 220;
        const offsetX = (maxWidth - tierWidth) / 2;

        return subjectsInTier
          .map((element, elemIndex) => {
            const subject = element.subject;
            const nodeId = `${subject.code}-${tier.level}`;
            const code = subject.code;

            if (!code || (selectedSubject && !visibleSubjects.has(code)))
              return null;

            const subjectCardStyle = {
              ...baseSubjectCardStyle,
              backgroundColor: getGradeColor(String(subject.gradeLatin)),
              border: "1px solid rgb(0, 0, 0)",
            };

            return {
              id: nodeId,
              data: {
                label: (
                  <div style={subjectCardStyle}>
                    <div
                      role="button"
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                      onClick={() => handleNodeClick(code)}
                      onKeyDown={(e) => handleKeyDown(e, code)}
                    >
                      <p
                        style={{
                          ...subjectCardPStyle,
                          ...subjectCardStrongStyle,
                          marginBottom: "6px",
                        }}
                      >
                        {subject.code}
                      </p>
                      <p
                        style={{
                          ...subjectCardPStyle,
                          fontSize: "0.85em",
                          color: "#000000",
                          marginBottom: "4px",
                          lineHeight: "1.2",
                        }}
                      >
                        {subject.name || "Không có tên"}
                      </p>
                      <p
                        style={{
                          ...subjectCardPStyle,
                          fontSize: "0.8em",
                          color: "#000000",
                        }}
                      >
                        {subject.credit !== undefined
                          ? `${subject.credit} tín chỉ`
                          : "N/A"}
                      </p>
                    </div>
                    <div style={actionContainerStyle}>
                      {subject.gradeLatin ? (
                        <button
                          className="p-0 w-10 h-10 flex items-center justify-center text-xs"
                          style={{ background: "none", border: "none" }}
                        >
                          <span
                            style={{ fontSize: "0.75em", fontWeight: "bold" }}
                          >
                            {subject.gradeLatin}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ),
              },
              position: { x: offsetX + elemIndex * 220, y: tierIndex * 200 },
              style: { width: 200, padding: 0 },
            };
          })
          .filter(Boolean) as Node[];
      });
    }, [tiers, selectedSubject, visibleSubjects]);

    const edges: Edge[] = useMemo(() => {
      return tiers.flatMap((tier) => {
        return tier.elements
          .filter((e) => e.subject.prerequisites?.length)
          .flatMap((element) => {
            const subject = element.subject;
            const targetId = `${subject.code}-${tier.level}`;

            return (subject.prerequisites || [])
              .map((prereqCode, index) => {
                const prereqItem = items.find(
                  (item) => item.code === prereqCode,
                );
                if (!prereqItem?.code) return null;

                const prereqCodeVal = prereqItem.code;
                const prereqTier = tiers.find((t) =>
                  t.elements.some((e) => e.subject.code === prereqCodeVal),
                );
                const sourceId = `${prereqCodeVal}-${prereqTier?.level || 0}`;

                const sourceNode = nodes.find((n) => n.id === sourceId);
                const targetNode = nodes.find((n) => n.id === targetId);

                if (!sourceNode || !targetNode) return null;

                if (
                  selectedSubject &&
                  !visibleSubjects.has(prereqCodeVal) &&
                  !visibleSubjects.has(subject.code!)
                ) {
                  return null;
                }

                return {
                  id: `${sourceId}-${targetId}-${index}`,
                  source: sourceId,
                  target: targetId,
                  type: "bezier",
                  animated: true,
                  style: { stroke: "#000000", strokeWidth: 2 },
                  arrowHeadType: "arrowclosed",
                  markerEnd: { type: "arrowclosed", color: "#000000" },
                  pathOptions: { curvature: 0.5 },
                };
              })
              .filter(Boolean) as Edge[];
          });
      });
    }, [tiers, items, selectedSubject, visibleSubjects]);

    if (!items || items.length === 0) {
      return (
        <div style={graphContainerStyle}>
          <p>Đang tải dữ liệu kế hoạch...</p>
        </div>
      );
    }

    return (
      <div style={graphContainerStyle}>
        <div id="plan-graph-container" style={tabletContainerStyle}>
          <ReactFlow
            defaultZoom={0.4}
            edges={edges}
            maxZoom={5}
            minZoom={0.2}
            nodes={nodes}
            nodesDraggable={false}
            panOnDrag={true}
            preventScrolling={true}
            style={{ width: "100%", height: "100%", cursor: "move" }}
            zoomOnScroll={true}
          >
            <Background
              color="#00b7ff"
              gap={50}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
          <button
            style={{
              position: "absolute",
              bottom: "9px",
              right: "9px",
              padding: "8px 16px",
              background: "#000000",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              zIndex: 1000,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>
    );
  },
);

PlanGraph.displayName = "PlanGraph";

export default PlanGraph;
