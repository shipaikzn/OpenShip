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

### 1. Team Standup & Sprint Coordination
- **Automation ID**: `5685216c-f65d-428e-88f3-26ba4300c834`
- **Trigger**: Cron `0 9 * * 1-5` (Mon–Fri at 09:00 UTC)
- **Status**: `ACTIVE`
- **Participants**: Product Owner ↔ Backend, Frontend, DevOps, QA, Technical Writer
- **Workflow**:
  - Reviews active issues, open PRs, and recent commits across `khanofai/appfactory`.
  - Gathers status across all agent domains.
  - Flags cross-functional blockers and reprioritizes tasks for the sprint cycle.

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
