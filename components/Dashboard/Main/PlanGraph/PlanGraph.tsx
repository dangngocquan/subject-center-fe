import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Node,
  Edge,
  BackgroundVariant,
} from "react-flow-renderer";
import { Tooltip } from "react-tooltip";

import EditSubjectModal from "../modals/EditSubjectModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

import { calculateTiers, Tier } from "./utils";

import { PlanItem } from "@/types/plan";
import { updatePlanItem, deletePlanItem } from "@/service/plan.api";
import GenericButton from "@/components/Common/GenericButton";

interface PlanGraphProps {
  items: PlanItem[];
  planId: string | null;
  onDataChange?: () => void;
}

const PlanGraph: React.FC<PlanGraphProps> = ({
  items,
  planId,
  onDataChange,
}) => {
  console.log("Items received:", items);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<PlanItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{
    id: number | null | undefined;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    isOpen: boolean;
    message: string;
    isError: boolean;
  }>({ isOpen: false, message: "", isError: false });

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
    borderRadius: "2px",
    padding: "12px",
    width: "200px",
    boxShadow: "0 2px 8px rgba(34, 255, 0, 0.2)",
    textAlign: "center" as const,
    transition: "all 0.2s ease",
    wordBreak: "break-word" as const,
    overflow: "hidden" as const,
    position: "relative" as const,
  };

  const subjectCardPStyle = {
    margin: "0",
    fontSize: "0.9em",
  };

  const subjectCardStrongStyle = {
    color: "#007bff",
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

  const customButtonStyle = {
    padding: "4px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
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
    if (items && items.length > 0) {
      const calculatedTiers = calculateTiers(items);
      console.log("Calculated tiers:", calculatedTiers);
      setTiers(calculatedTiers);
    } else {
      setTiers([]);
    }
  }, [items]);

  const toggleFullscreen = useCallback(() => {
    const container = document.getElementById("plan-graph-container");
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
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

  const handleEditClick = (subject: PlanItem) => {
    setEditSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (subject: PlanItem) => {
    setSubjectToDelete({
      id: Number(subject.id),
      name: subject.name ?? "Unknown",
    });
    setIsConfirmDeleteOpen(true);
  };

  const handleModalSubmit = async (updatedSubject: PlanItem) => {
    if (!planId || updatedSubject.id == null) {
      setResultMessage({
        isOpen: true,
        message: "Cannot update subject: Missing plan ID or subject ID.",
        isError: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePlanItem(Number(planId), {
        id: updatedSubject.id,
        name: updatedSubject.name ?? "",
        code: updatedSubject.code ?? "",
        credit: updatedSubject.credit ?? 0,
        prerequisites: updatedSubject.prerequisites ?? [],
        gradeLatin: updatedSubject.gradeLatin ?? null,
      });
      if (!result.isBadRequest) {
        const updatedItems = items.map((item) =>
          item.id === updatedSubject.id ? { ...item, ...result.data } : item,
        );
        setTiers(calculateTiers(updatedItems));
        setResultMessage({
          isOpen: true,
          message: "Subject updated successfully!",
          isError: false,
        });
        onDataChange?.();
      } else {
        setResultMessage({
          isOpen: true,
          message: `Failed to update subject: ${result.message}`,
          isError: true,
        });
      }
    } catch (error) {
      setResultMessage({
        isOpen: true,
        message: "An error occurred while updating the subject.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
      setEditSubject(null);
    }
  };

  const confirmDelete = async () => {
    if (!subjectToDelete || subjectToDelete.id == null || !planId) {
      setResultMessage({
        isOpen: true,
        message:
          "Cannot delete subject: Invalid subject ID or missing Plan ID.",
        isError: true,
      });
      setIsConfirmDeleteOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePlanItem(Number(planId), subjectToDelete.id);
      if (!response.isBadRequest) {
        const updatedItems = items.filter(
          (item) => item.id !== subjectToDelete.id,
        );
        setTiers(calculateTiers(updatedItems));
        setResultMessage({
          isOpen: true,
          message: "Subject deleted successfully!",
          isError: false,
        });
        onDataChange?.();
      } else {
        setResultMessage({
          isOpen: true,
          message: `Failed to delete subject: ${response.message}`,
          isError: true,
        });
      }
    } catch (error) {
      setResultMessage({
        isOpen: true,
        message: "An error occurred while deleting the subject.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDeleteOpen(false);
      setSubjectToDelete(null);
    }
  };

  const tierWidths = tiers.map((tier) => tier.elements.length * 220);
  const maxWidth = Math.max(...tierWidths, 300);

  const nodes: Node[] = tiers.flatMap((tier, tierIndex) => {
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
          border: "1px solid #00b7ff",
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
                    }}
                  >
                    {subject.credit !== undefined
                      ? `${subject.credit} credits`
                      : "N/A"}
                  </p>
                </div>
                <div style={actionContainerStyle}>
                  {subject.gradeLatin ? (
                    <GenericButton
                      //   disabled={true}
                      className="p-0 w-10 h-10 flex items-center justify-center text-xs"
                      tooltipContent={`Grade: ${subject.gradeLatin}`}
                      tooltipId={`grade-tooltip-${nodeId}`}
                      onClick={() => handleEditClick(subject)}
                    >
                      <span style={{ fontSize: "0.75em", fontWeight: "bold" }}>
                        {subject.gradeLatin}
                      </span>
                    </GenericButton>
                  ) : null}
                  {/* <GenericButton
                    onClick={() => handleEditClick(subject)}
                    tooltipContent="Edit Subject"
                    tooltipId={`edit-tooltip-${nodeId}`}
                    className="p-0 w-6 h-6 flex items-center justify-center"
                  >
                    <PencilIcon style={{ width: "14px", height: "14px" }} />
                  </GenericButton>
                  <GenericButton
                    onClick={() => handleDeleteClick(subject)}
                    tooltipContent="Delete Subject"
                    tooltipId={`delete-tooltip-${nodeId}`}
                    className="p-0 w-6 h-6 flex items-center justify-center"
                  >
                    <TrashIcon style={{ width: "14px", height: "14px" }} />
                  </GenericButton> */}
                  <Tooltip id={`grade-tooltip-${nodeId}`} place="right" />
                  {/* <Tooltip id={`edit-tooltip-${nodeId}`} place="right" />
                  <Tooltip id={`delete-tooltip-${nodeId}`} place="right" /> */}
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

  const edges: Edge[] = tiers.flatMap((tier) => {
    return tier.elements
      .filter((e) => e.subject.prerequisites?.length)
      .flatMap((element) => {
        const subject = element.subject;
        const targetId = `${subject.code}-${tier.level}`;

        return (subject.prerequisites || [])
          .map((prereqCode, index) => {
            const prereqItem = items.find((item) => item.code === prereqCode);
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
              style: { stroke: "#00b7ff", strokeWidth: 2 },
              arrowHeadType: "arrowclosed",
              markerEnd: { type: "arrowclosed", color: "#00b7ff" },
              pathOptions: { curvature: 0.5 },
            };
          })
          .filter(Boolean) as Edge[];
      });
  });

  if (!items || items.length === 0) {
    return (
      <div style={graphContainerStyle}>
        <p>Loading plan data...</p>
      </div>
    );
  }

  return (
    <>
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
              background: "#007bff",
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
      {isEditModalOpen && editSubject && (
        <EditSubjectModal
          initialData={editSubject}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditSubject(null);
          }}
          onSubmit={handleModalSubmit}
        />
      )}
      {isConfirmDeleteOpen && subjectToDelete && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteOpen}
          subjectName={subjectToDelete.name}
          onClose={() => {
            setIsConfirmDeleteOpen(false);
            setSubjectToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {resultMessage.isOpen && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: resultMessage.isError ? "#ff4444" : "#44ff44",
            color: "#fff",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {resultMessage.message}
          <button
            style={{ marginLeft: "10px", color: "#fff" }}
            onClick={() =>
              setResultMessage({ ...resultMessage, isOpen: false })
            }
          >
            X
          </button>
        </div>
      )}
    </>
  );
};

export default PlanGraph;
