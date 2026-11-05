# Epic: Settings - Agent Management UI Refactoring & Project Field

**Epic Owner**: Product Owner (`product-owner.md`)  
**Target Repository**: `shipaikzn/OpenShip`  
**Working Directory**: `/home/khanofai/Projects/openship`

---

## 1. Executive Summary & Vision

The overarching mission of **OpenShip** is to empower non-technical project managers, product managers, and business operators to direct a team of autonomous AI agents through a super-agent—the **Product Owner**.

To fulfill this vision, the user interface must transition from low-level developer-centric jargon ("profiles", "models", internal configuration nomenclature) to an intuitive team-management paradigm ("Agents", "Location", "Project", "Available agents").

This Epic delivers the first fundamental refactor of the **Settings → Agent** section.

---

## 2. Requirements & Scope

| ID | Requirement | Current State | Target State | Assigned Specialist |
|---|---|---|---|---|
| **REQ-01** | Section Rename | Navigation label reads `Agent` | Rename navigation label to `Agents` | **Frontend Developer** |
| **REQ-02** | Add Button Rename | Button reads `Add agent profile` | Rename button to `Add agent` | **Frontend Developer** |
| **REQ-03** | List Header Rename | Section header reads `Available Profiles` | Rename to `Available agents` | **Frontend Developer** |
| **REQ-04** | Form Title Rename | Page title reads `Add agent profile` | Rename to `Add agent` | **Frontend Developer** |
| **REQ-05** | Name Field Rename | Input field labeled `Profile Name` | Rename label to `Agent Name` | **Frontend Developer** |
| **REQ-06** | Engine Selector Rename | Dropdown labeled `Agent` | Rename label to `Location` | **Frontend Developer** |
| **REQ-07** | Project Field (UI & Schema) | No project association exists | Add `Project` input on form & persist in DB/store | **Backend Developer** + **Frontend Developer** |
| **REQ-08** | Verification & Regression | Existing tests check old strings | Update Vitest / Playwright tests | **QA Engineer** |
| **REQ-09** | Documentation | Docs reflect old "profile" terms | Update settings and onboarding documentation | **Technical Writer** |

---

## 3. Work Breakdown & User Stories

### Story 1: Navigation & Header Updates (`frontend-developer`)
- **Files**:
  - `src/i18n/translation.json` (`SETTINGS$NAV_AGENT`, `SETTINGS$AVAILABLE_PROFILES`, `SETTINGS$ADD_AGENT_PROFILE`)
  - `src/constants/settings-nav.tsx`
  - `src/components/features/settings/agent-profiles/agent-profiles-manager.tsx`
- **Deliverables**:
  - Sidebar shows `Agents`.
  - Heading shows `Available agents`.
  - Button shows `Add agent`.

### Story 2: Form Field Refactoring (`frontend-developer`)
- **Files**:
  - `src/components/features/settings/llm-profiles/profile-name-input.tsx`
  - `src/components/features/settings/agent-profiles/agent-profiles-local-view.tsx`
  - `src/routes/agent-settings.tsx`
- **Deliverables**:
  - Name input displays `Agent Name`.
  - Agent runtime dropdown displays `Location` (OpenHands / ACP).

### Story 3: Project Field Backend Schema & Storage (`backend-developer`)
- **Files**:
  - SDK / Agent Server: `AgentProfileBase` in `openhands/sdk/profiles/agent_profile.py`
  - Profile storage in `openhands/sdk/profiles/agent_profile_store.py`
  - API router `agent_profiles_router.py`
- **Deliverables**:
  - `project: str | None = None` supported in `AgentProfileBase`.
  - Stored in profile JSON files (`~/.openhands/agent-profiles/*.json`) or DB.
  - Included in summary listings (`list_summaries()`).

### Story 4: Project Field UI & Display (`frontend-developer`)
- **Files**:
  - `src/api/agent-profiles-service/agent-profiles-service.api.ts`
  - `src/components/features/settings/agent-profiles/agent-profiles-local-view.tsx`
  - `src/components/features/settings/agent-profiles/agent-profile-row.tsx`
- **Deliverables**:
  - `Project` input field on Add/Edit Agent screen.
  - Value passed to save payload and persisted.
  - Project tag displayed in the agents list.

### Story 5: Test Automation & Regression (`QA-engineer`)
- **Files**:
  - `src/components/features/settings/agent-profiles/*.test.tsx`
  - `__tests__/`
- **Deliverables**:
  - Updated string assertions.
  - Test verifying Project field input and save handling.

### Story 6: Documentation Refresh (`technical-writer`)
- **Files**:
  - `docs/`
- **Deliverables**:
  - Updated terminology and user guides.
