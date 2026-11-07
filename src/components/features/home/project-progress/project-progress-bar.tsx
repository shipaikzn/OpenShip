/* eslint-disable i18next/no-literal-string */
import React, { useState, useEffect } from "react";
import {
  Check,
  AlertTriangle,
  Ban,
  MinusCircle,
  ChevronRight,
  Circle,
  Lock,
  Play,
  RotateCcw,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "#/utils/utils";

export type ProjectStageStatus =
  | "new"
  | "in_progress"
  | "completed"
  | "warning"
  | "critical"
  | "skipped"
  | "pending";

export interface StageWorkflow {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectStage {
  id: string;
  name: string;
  status: ProjectStageStatus;
  statusLabel: string;
  description: string;
  workflowName: string;
  workflows: StageWorkflow[];
  artifacts: string[];
}

export const INITIAL_STAGES: ProjectStage[] = [
  {
    id: "plan",
    name: "PLAN",
    status: "new",
    statusLabel: "New",
    description:
      "Define project overview, scope, roadmap, budget, and guardrails with customer sign-off before creating backlog and engaging agent team.",
    workflowName: "Project Planning Workflow",
    workflows: [
      { id: "p1", title: "Project Overview", completed: false },
      { id: "p2", title: "Scope", completed: false },
      { id: "p3", title: "Roadmap", completed: false },
      { id: "p4", title: "Budget", completed: false },
      {
        id: "p5",
        title: "Guardrails (risks, issues, constraints, policies)",
        completed: false,
      },
      {
        id: "p6",
        title: "Customer Sign-off (timestamp & customer name)",
        completed: false,
      },
      { id: "p7", title: "Create Backlog of items", completed: false },
      {
        id: "p8",
        title: "Sub-Agent Team Roster spawned as child conversations",
        completed: false,
      },
    ],
    artifacts: [
      "Project Overview",
      "Scope Document",
      "Roadmap",
      "Budget Breakdown",
      "Guardrails Specification",
      "Customer Sign-off Sheet",
      "Product Backlog",
    ],
  },
  {
    id: "design",
    name: "DESIGN",
    status: "new",
    statusLabel: "New",
    description:
      "UI/UX component design, user flow mockups, and API schema specification.",
    workflowName: "Architecture & UI/UX Design Workflow",
    workflows: [
      { id: "d1", title: "Figma Design System & Wireframes", completed: false },
      { id: "d2", title: "OpenAPI Specification", completed: false },
      { id: "d3", title: "Database Schema Models", completed: false },
    ],
    artifacts: [
      "Figma Design System",
      "OpenAPI Specification",
      "Database Schema Models",
    ],
  },
  {
    id: "develop",
    name: "DEVELOP",
    status: "new",
    statusLabel: "New",
    description:
      "Core service implementation and agent workflow orchestration.",
    workflowName: "Feature Implementation Workflow",
    workflows: [
      {
        id: "dev1",
        title: "Core Service & Business Logic Implementation",
        completed: false,
      },
      {
        id: "dev2",
        title: "Frontend Components & State Integration",
        completed: false,
      },
      {
        id: "dev3",
        title: "Docker Microservices & CI/CD Pipeline",
        completed: false,
      },
    ],
    artifacts: [
      "Application Source Code",
      "Docker Microservices",
      "CI/CD Pipeline Configurations",
    ],
  },
  {
    id: "test",
    name: "TEST",
    status: "new",
    statusLabel: "New",
    description:
      "Automated end-to-end testing, integration tests, and security scans.",
    workflowName: "Quality Assurance & Regression Workflow",
    workflows: [
      {
        id: "t1",
        title: "Automated Vitest & End-to-End Test Suite",
        completed: false,
      },
      {
        id: "t2",
        title: "Security Vulnerability & Static Code Scan",
        completed: false,
      },
      {
        id: "t3",
        title: "Coverage Metrics & Regression Report",
        completed: false,
      },
    ],
    artifacts: [
      "Test Suites & Results",
      "Security Vulnerability Scan",
      "Coverage Metrics Report",
    ],
  },
  {
    id: "launch",
    name: "LAUNCH",
    status: "new",
    statusLabel: "New",
    description:
      "Deployment to production staging, container deployment, DNS routing, and canary release.",
    workflowName: "Deployment & Release Workflow",
    workflows: [
      { id: "l1", title: "Production Container Image Build", completed: false },
      {
        id: "l2",
        title: "Staging Deployment & Smoke Verification",
        completed: false,
      },
      {
        id: "l3",
        title: "Release Notes & Changelog Publication",
        completed: false,
      },
    ],
    artifacts: [
      "Release Notes",
      "Deployment Scripts",
      "Production Docker Image",
    ],
  },
  {
    id: "support",
    name: "SUPPORT",
    status: "new",
    statusLabel: "New",
    description:
      "Telemetry monitoring, user feedback loops, upstream synchronization, and incident triage.",
    workflowName: "Operations & Upstream Sync Workflow",
    workflows: [
      {
        id: "s1",
        title: "Telemetry & Runtime Health Monitoring",
        completed: false,
      },
      { id: "s2", title: "Upstream OpenHands Sync Watchdog", completed: false },
      {
        id: "s3",
        title: "Automated Incident & Defect Triage",
        completed: false,
      },
    ],
    artifacts: [
      "Telemetry Dashboards",
      "Sync Watchdog Logs",
      "Incident Runbooks",
    ],
  },
];

const STORAGE_KEY = "openship_project_stages_v3";

export function isStageUnlocked(idx: number, stages: ProjectStage[]): boolean {
  if (idx <= 0) return true;
  // Consecutive rule: each stage transition requires the immediately preceding stage to be completed
  return stages[idx - 1].status === "completed";
}

export function ProjectProgressBar() {
  const [stages, setStages] = useState<ProjectStage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            Array.isArray(parsed) &&
            parsed.length === INITIAL_STAGES.length
          ) {
            return parsed;
          }
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_STAGES;
  });

  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
    } catch {
      // Ignore storage errors
    }
  }, [stages]);

  const selectedIndex = stages.findIndex((s) => s.id === selectedStageId);
  const selectedStage = selectedIndex >= 0 ? stages[selectedIndex] : null;

  const handleToggleWorkflow = (stageIdx: number, workflowId: string) => {
    if (!isStageUnlocked(stageIdx, stages)) return;

    setStages((prev) => {
      const updated = [...prev];
      const targetStage = { ...updated[stageIdx] };
      targetStage.workflows = targetStage.workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, completed: !wf.completed } : wf,
      );

      // Auto update status based on workflows
      const allDone = targetStage.workflows.every((w) => w.completed);
      const someDone = targetStage.workflows.some((w) => w.completed);

      if (allDone) {
        targetStage.status = "completed";
        targetStage.statusLabel = "Completed";
      } else if (someDone) {
        targetStage.status = "in_progress";
        targetStage.statusLabel = "In Progress";
      } else {
        targetStage.status = "new";
        targetStage.statusLabel = "New";
      }

      updated[stageIdx] = targetStage;
      return updated;
    });
  };

  const handleCompleteAllWorkflows = (stageIdx: number) => {
    if (!isStageUnlocked(stageIdx, stages)) return;

    setStages((prev) => {
      const updated = [...prev];
      const targetStage = { ...updated[stageIdx] };
      targetStage.workflows = targetStage.workflows.map((wf) => ({
        ...wf,
        completed: true,
      }));
      targetStage.status = "completed";
      targetStage.statusLabel = "Completed";
      updated[stageIdx] = targetStage;
      return updated;
    });
  };

  const handleResetAll = () => {
    setStages(INITIAL_STAGES);
    setSelectedStageId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const getStatusBadge = (status: ProjectStageStatus) => {
    switch (status) {
      case "new":
        return {
          containerClass:
            "bg-white dark:bg-zinc-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 shadow-xs",
          icon: (
            <Circle
              size={10}
              className="fill-gray-400 dark:fill-gray-500 stroke-none"
            />
          ),
          iconBg:
            "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
          label: "New",
          colorClass: "text-gray-700 dark:text-gray-300",
        };
      case "in_progress":
        return {
          containerClass:
            "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20",
          icon: <Play size={10} className="fill-sky-500 stroke-none" />,
          iconBg: "bg-sky-500 text-white",
          label: "In Progress",
          colorClass: "text-sky-600 dark:text-sky-400",
        };
      case "completed":
        return {
          containerClass:
            "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
          icon: <Check size={14} className="stroke-[2.5]" />,
          iconBg: "bg-emerald-500 text-white",
          label: "Completed",
          colorClass: "text-emerald-600 dark:text-emerald-400",
        };
      case "warning":
        return {
          containerClass:
            "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
          icon: <AlertTriangle size={14} className="stroke-[2.5]" />,
          iconBg: "bg-amber-500 text-white",
          label: "Warning",
          colorClass: "text-amber-600 dark:text-amber-400",
        };
      case "critical":
        return {
          containerClass:
            "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20",
          icon: <Ban size={14} className="stroke-[2.5]" />,
          iconBg: "bg-rose-500 text-white",
          label: "Critical (Roadblock)",
          colorClass: "text-rose-600 dark:text-rose-400",
        };
      case "skipped":
        return {
          containerClass:
            "bg-neutral-500/10 border-neutral-400 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-500/20",
          icon: <MinusCircle size={14} className="stroke-[2.5]" />,
          iconBg: "bg-neutral-400 text-white",
          label: "Skipped",
          colorClass: "text-neutral-500",
        };
      default:
        return {
          containerClass:
            "bg-muted/40 border-border text-muted-foreground hover:bg-muted/60",
          icon: null,
          iconBg: "bg-muted text-muted-foreground",
          label: "Pending",
          colorClass: "text-muted-foreground",
        };
    }
  };

  return (
    <div className="w-full mb-6 select-none" data-testid="project-progress-bar">
      {/* Header bar with stages title and reset */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Project Stages (Consecutive Workflow)
        </span>
        <button
          type="button"
          onClick={handleResetAll}
          className="text-[10px] text-muted-foreground/70 hover:text-foreground flex items-center gap-1 transition-colors"
          title="Reset all stages back to New"
        >
          <RotateCcw size={10} />
          Reset Stages
        </button>
      </div>

      {/* Stages bar */}
      <div className="flex items-center w-full gap-1.5 sm:gap-2">
        {stages.map((stage, idx) => {
          const config = getStatusBadge(stage.status);
          const isSelected = selectedStage?.id === stage.id;
          const unlocked = isStageUnlocked(idx, stages);

          return (
            <React.Fragment key={stage.id}>
              <button
                type="button"
                data-testid={`stage-button-${stage.id}`}
                onClick={() => setSelectedStageId(isSelected ? null : stage.id)}
                className={cn(
                  "group relative flex-1 min-w-0 flex flex-col items-center justify-center py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border transition-all duration-200 cursor-pointer",
                  config.containerClass,
                  !unlocked && "opacity-60 hover:opacity-80",
                  isSelected &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]",
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {!unlocked ? (
                    <span className="flex items-center justify-center p-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-500">
                      <Lock size={10} />
                    </span>
                  ) : (
                    config.icon && (
                      <span
                        className={cn(
                          "flex items-center justify-center p-0.5 rounded-full text-xs",
                          config.iconBg,
                        )}
                      >
                        {config.icon}
                      </span>
                    )
                  )}
                  <span className="font-bold text-xs sm:text-sm tracking-wide">
                    {stage.name}
                  </span>
                </div>
                <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">
                  {stage.statusLabel}
                </span>
              </button>

              {idx < stages.length - 1 && (
                <div className="flex items-center text-muted-foreground/60 px-0.5">
                  <span className="hidden sm:inline font-bold text-sm">→</span>
                  <ChevronRight size={14} className="sm:hidden" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected stage details & workflows drawer */}
      {selectedStage && selectedIndex >= 0 && (
        <div
          data-testid="stage-details-drawer"
          className="mt-4 p-4 rounded-xl border border-border bg-card/60 backdrop-blur-xs shadow-sm transition-all duration-200"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-wide">
                Stage {selectedIndex + 1}:{" "}
                <span className="text-primary">{selectedStage.name}</span>
              </span>
              <span
                className={cn(
                  "text-xs px-2.5 py-0.5 rounded-full font-medium border",
                  getStatusBadge(selectedStage.status).containerClass,
                )}
              >
                {selectedStage.statusLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedStageId(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            {selectedStage.description}
          </p>

          {/* Consecutive transition lock warning */}
          {!isStageUnlocked(selectedIndex, stages) && (
            <div
              data-testid="stage-locked-alert"
              className="flex items-center gap-2 p-3 mb-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs"
            >
              <Lock size={14} className="shrink-0" />
              <span>
                <strong>Stage Locked:</strong> Preceding stage (
                <span className="font-bold">
                  {stages[selectedIndex - 1].name}
                </span>
                ) must be successfully completed before this stage can
                transition.
              </span>
            </div>
          )}

          {/* Assigned Workflows Checklist */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-primary" />
                Assigned Workflows: {selectedStage.workflowName}
              </h5>
              {isStageUnlocked(selectedIndex, stages) &&
                selectedStage.status !== "completed" && (
                  <button
                    type="button"
                    data-testid="complete-stage-workflows-btn"
                    onClick={() => handleCompleteAllWorkflows(selectedIndex)}
                    className="text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    Complete All Workflows
                  </button>
                )}
            </div>
            <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/50">
              {selectedStage.workflows.map((wf) => {
                const unlocked = isStageUnlocked(selectedIndex, stages);
                return (
                  <label
                    key={wf.id}
                    className={cn(
                      "flex items-center gap-2.5 text-xs select-none",
                      unlocked
                        ? "cursor-pointer hover:text-foreground"
                        : "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={wf.completed}
                      disabled={!unlocked}
                      onChange={() =>
                        handleToggleWorkflow(selectedIndex, wf.id)
                      }
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span
                      className={cn(
                        wf.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {wf.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Artifacts list */}
          {selectedStage.artifacts && selectedStage.artifacts.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <FileText size={12} />
                Stage Artifacts:
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedStage.artifacts.map((artifact, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border/80"
                  >
                    📄 {artifact}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
