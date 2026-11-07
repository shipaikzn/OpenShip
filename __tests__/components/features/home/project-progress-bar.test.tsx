import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ProjectProgressBar,
  INITIAL_STAGES,
  isStageUnlocked,
} from "#/components/features/home/project-progress/project-progress-bar";

describe("ProjectProgressBar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes all 6 stages in the 'New' state", () => {
    render(<ProjectProgressBar />);

    // All 6 stages present
    expect(screen.getByTestId("stage-button-plan")).toBeInTheDocument();
    expect(screen.getByTestId("stage-button-design")).toBeInTheDocument();
    expect(screen.getByTestId("stage-button-develop")).toBeInTheDocument();
    expect(screen.getByTestId("stage-button-test")).toBeInTheDocument();
    expect(screen.getByTestId("stage-button-launch")).toBeInTheDocument();
    expect(screen.getByTestId("stage-button-support")).toBeInTheDocument();

    // Verify all 6 have "NEW" label
    const newLabels = screen.getAllByText("New");
    expect(newLabels.length).toBe(6);
  });

  it("applies white background and gray border for the New state", () => {
    render(<ProjectProgressBar />);

    const planButton = screen.getByTestId("stage-button-plan");
    expect(planButton.className).toContain("bg-white");
    expect(planButton.className).toContain("border-gray-300");
  });

  it("enforces consecutive transitions: design is locked until plan is completed", () => {
    render(<ProjectProgressBar />);

    // Click DESIGN stage
    fireEvent.click(screen.getByTestId("stage-button-design"));

    // Should show locked alert
    expect(screen.getByTestId("stage-locked-alert")).toBeInTheDocument();
    expect(screen.getByTestId("stage-locked-alert").textContent).toContain(
      "Preceding stage (PLAN) must be successfully completed",
    );

    // Close drawer
    fireEvent.click(screen.getByText("Close"));

    // Now click PLAN stage
    fireEvent.click(screen.getByTestId("stage-button-plan"));

    // PLAN is unlocked and has the complete all button
    const completePlanBtn = screen.getByTestId("complete-stage-workflows-btn");
    expect(completePlanBtn).toBeInTheDocument();

    // Complete all PLAN workflows
    fireEvent.click(completePlanBtn);

    // PLAN is now Completed
    expect(screen.getByTestId("stage-button-plan").textContent).toContain(
      "Completed",
    );

    // Now select DESIGN stage
    fireEvent.click(screen.getByTestId("stage-button-design"));

    // DESIGN should now be unlocked (no locked alert)
    expect(screen.queryByTestId("stage-locked-alert")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("complete-stage-workflows-btn"),
    ).toBeInTheDocument();
  });

  it("correctly evaluates isStageUnlocked helper", () => {
    const testStages = JSON.parse(JSON.stringify(INITIAL_STAGES));
    expect(isStageUnlocked(0, testStages)).toBe(true);
    expect(isStageUnlocked(1, testStages)).toBe(false);

    testStages[0].status = "completed";
    expect(isStageUnlocked(1, testStages)).toBe(true);
    expect(isStageUnlocked(2, testStages)).toBe(false);
  });

  it("resets all stages back to New when reset button is clicked", () => {
    render(<ProjectProgressBar />);

    // Complete PLAN
    fireEvent.click(screen.getByTestId("stage-button-plan"));
    fireEvent.click(screen.getByTestId("complete-stage-workflows-btn"));
    expect(screen.getByTestId("stage-button-plan").textContent).toContain(
      "Completed",
    );

    // Click Reset Stages
    fireEvent.click(screen.getByTitle("Reset all stages back to New"));

    // PLAN should be back to New
    expect(screen.getByTestId("stage-button-plan").textContent).toContain(
      "New",
    );
  });
});
