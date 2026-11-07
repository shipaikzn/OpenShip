# Team Workflow Automations

This document details the live workflow automations configured in the OpenHands Automations service. As the **Product Owner**, these automations establish continuous operational loops connecting the Product Owner with the 5 specialist agents across the software development lifecycle.

---

## Team Agent Roster

| Role | Agent Profile | Focus |
|---|---|---|
| **Product Owner** | `ProductOwner` (`product-owner.md`) | Backlog ownership, acceptance criteria, team orchestration, sprint goals |
| **Backend Developer** | `BackendDeveloper` (`backend-developer.md`) | API development, business logic, databases, performance |
| **Frontend Developer** | `FrontendDeveloper` (`frontend-developer.md`) | UI components, user experience, responsive state management |
| **DevOps Engineer** | `DevOps` (`DevOps-engineer.md`) | Infrastructure, CI/CD pipelines, container orchestration, environment health |
| **QA Engineer** | `Tester` (`QA-engineer.md`) | Test strategy, test suites, bug reproduction, quality verification |
| **Technical Writer** | `Writer` (`technical-writer.md`) | Documentation, API specifications, release notes, changelogs |

---

## Active Automations in OpenHands

### 1. Project Planning
- **Automation ID**: `3c1cda48-8bd6-4c64-821f-d2c3d7d4ef4b`
- **Trigger**: Run once a new project is created (main conversation with Product Owner) / Cron `0 9 * * 1`
- **Status**: `ACTIVE`
- **Owner**: Product Owner (`ProductOwner`)
- **Workflow**:
  - **Plan Stage Goal**: Produce core planning artifacts and obtain formal customer sign-off before proceeding to the Design stage:
    1. **Project Overview**: High-level summary, target users, and key value propositions.
    2. **Scope**: Clear in-scope deliverables and out-of-scope boundaries to prevent scope creep.
    3. **Roadmap**: Phased milestones, target delivery dates, and dependency mapping across the 6 project stages (Plan, Design, Develop, Test, Launch, Support).
    4. **Budget**: Resource allocation, computational/LLM cost estimates, and operational expenditure guardrails.
    5. **Guardrails**: Risks, issues, technical constraints, compliance, and governance policies.
  - **Customer Agreement & Sign-off**:
    - Product Owner collaborates directly with the customer in the conversation to agree on scope, roadmap, budget, and guardrails.
    - Check Plan artifacts as **Signed-off** with timestamp and customer name.
    - Create the **Product Backlog** of items.
    - Identify required **Team roles** needed for implementation.
    - Create sub-agents for relevant profiles as child conversations (`launch_child_conversation`), greet them in their conversations, and explain they are about to start a new project.
  - **Deliverable**: A complete team of specialist Agents ready to be engaged in work.

### 2. Feature Backlog Triage & Architecture Review
- **Automation ID**: `496abc3d-591d-4981-a67e-974335451a84`
- **Trigger**: Cron `0 10 * * 1` (Mondays at 10:00 UTC)
- **Status**: `ACTIVE`
- **Participants**: Product Owner ↔ Backend Developer & Frontend Developer
- **Workflow**:
  - Triages incoming user stories and feature requests.
  - Coordinates technical scoping: requests API and schema specs from Backend Developer, and component hierarchy and state design from Frontend Developer.
  - Breaks large initiatives into user stories with clear Given-When-Then acceptance criteria.

### 3. Release Quality Gate & DevOps Pipeline Review
- **Automation ID**: `d4525bae-8627-440d-ba1f-791de38e88b7`
- **Trigger**: Cron `0 14 * * 4` (Thursdays at 14:00 UTC)
- **Status**: `ACTIVE`
- **Participants**: Product Owner ↔ QA Engineer & DevOps Engineer
- **Workflow**:
  - Pre-release validation before merging or deploying to production.
  - Audits test suite execution and test coverage with QA Engineer.
  - Verifies CI/CD pipeline integrity, Docker builds, and deployment readiness with DevOps Engineer.
  - Produces a formal Go/No-Go release recommendation.

### 4. Documentation & Release Notes Sync
- **Automation ID**: `2bf6fc9c-8fe4-4715-b4f2-1c6e5880f9be`
- **Trigger**: Cron `0 16 * * 5` (Fridays at 16:00 UTC)
- **Status**: `ACTIVE`
- **Participants**: Product Owner ↔ Technical Writer
- **Workflow**:
  - Scans newly merged PRs and code modifications from the week.
  - Directs Technical Writer to update READMEs, API documentation, and configuration references.
  - Compiles structured release notes and changelogs summarizing new features and fixes.

### 5. Defect Triage & Hotfix Coordination
- **Automation ID**: `4f8df9b4-aae9-4829-a1aa-463e5de1331c`
- **Trigger**: Cron `0 8,16 * * 1-5` (Twice daily, Mon–Fri at 08:00 & 16:00 UTC)
- **Status**: `ACTIVE`
- **Participants**: Product Owner ↔ QA Engineer & Developers
- **Workflow**:
  - Reviews reported defects and bug reports.
  - Works with QA Engineer to confirm reproducible steps, severity, and user impact.
  - Dispatches critical defects directly to Backend or Frontend developers for rapid resolution.
