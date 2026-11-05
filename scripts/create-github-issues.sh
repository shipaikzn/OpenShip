#!/usr/bin/env bash
set -euo pipefail

# Repo target
REPO="shipaikzn/OpenShip"
API_URL="https://api.github.com/repos/${REPO}/issues"

# Token lookup
TOKEN="${GITHUB_TOKEN:-${GITHUB_PERSONAL_ACCESS_TOKEN:-}}"

if [ -z "$TOKEN" ]; then
  echo "Error: GITHUB_TOKEN or GITHUB_PERSONAL_ACCESS_TOKEN must be set."
  echo "Usage: GITHUB_TOKEN=<token> ./scripts/create-github-issues.sh"
  exit 1
fi

create_issue() {
  local title="$1"
  local body="$2"
  local label="$3"

  echo "Creating issue: $title"
  RESPONSE=$(curl -sS -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    "$API_URL" \
    -d "$(jq -n \
      --arg title "$title" \
      --arg body "$body" \
      --arg label "$label" \
      '{title: $title, body: $body, labels: [$label]}')")

  ISSUE_NUM=$(echo "$RESPONSE" | jq -r '.number // empty')
  if [ -n "$ISSUE_NUM" ]; then
    echo "  -> Created Issue #${ISSUE_NUM}: $(echo "$RESPONSE" | jq -r '.html_url')"
  else
    echo "  -> Failed: $(echo "$RESPONSE" | jq -r '.message // "Unknown error"')"
  fi
}

echo "=== Creating Issues on ${REPO} ==="

# Issue 1
create_issue \
  "[UI/Frontend] Rename Settings Navigation from 'Agent' to 'Agents'" \
  "### Overview
In OpenShip Settings, non-technical project and product managers manage a fleet of AI agents. The current navigation section label 'Agent' is singular and misaligned with multi-agent management.

### Assigned Team Member
- **Agent**: \`frontend-developer\` (\`FrontendDeveloper\`)

### Detailed Tasks
1. Update \`SETTINGS\$NAV_AGENT\` English translation from \`\"Agent\"\` to \`\"Agents\"\` in \`src/i18n/translation.json\`.
2. Verify that the navigation link in \`src/constants/settings-nav.tsx\` and sidebar headers correctly display 'Agents'.

### Acceptance Criteria
- [ ] Navigating to \`/settings\` displays 'Agents' in the sidebar menu instead of 'Agent'.
- [ ] Mobile drawer navigation also displays 'Agents'." \
  "frontend"

# Issue 2
create_issue \
  "[UI/Frontend] Rename 'Add agent profile' Button and Headers to 'Add agent' & 'Available agents'" \
  "### Overview
Simplify agent onboarding terminology for non-technical users by eliminating 'profile' jargon in the agent management screens.

### Assigned Team Member
- **Agent**: \`frontend-developer\` (\`FrontendDeveloper\`)

### Detailed Tasks
1. In \`src/i18n/translation.json\`, update \`SETTINGS\$ADD_AGENT_PROFILE\` from \`\"Add agent profile\"\` to \`\"Add agent\"\`.
2. In \`src/i18n/translation.json\`, update \`SETTINGS\$AVAILABLE_PROFILES\` from \`\"Available Profiles\"\` to \`\"Available agents\"\`.
3. In \`src/components/features/settings/agent-profiles/agent-profiles-manager.tsx\`, verify the list header displays 'Available agents' and the primary button displays 'Add agent'.
4. In \`src/components/features/settings/agent-profiles/agent-profiles-local-view.tsx\`, verify the editor page header displays 'Add agent' when creating a new agent.

### Acceptance Criteria
- [ ] On \`/settings/agents\`, the section heading reads 'Available agents'.
- [ ] The primary action button reads 'Add agent'.
- [ ] The header of the creation page reads 'Add agent'." \
  "frontend"

# Issue 3
create_issue \
  "[UI/Frontend] Rename 'Profile Name' to 'Agent Name' and 'Agent' Type to 'Location'" \
  "### Overview
Clarify field labels on the Add/Edit Agent screen:
- The name of the agent should be 'Agent Name'.
- The agent execution engine (OpenHands vs ACP) should be labeled 'Location'.

### Assigned Team Member
- **Agent**: \`frontend-developer\` (\`FrontendDeveloper\`)

### Detailed Tasks
1. In \`ProfileNameInput\` (\`src/components/features/settings/llm-profiles/profile-name-input.tsx\`), allow passing an optional \`label\` prop (defaulting to existing behavior for LLM profiles).
2. In \`agent-profiles-local-view.tsx\`, pass \`label=\"Agent Name\"\` (via i18n \`SETTINGS\$AGENT_NAME_LABEL\`).
3. In \`src/routes/agent-settings.tsx\`, replace \`label={t(I18nKey.SETTINGS\$NAV_AGENT)}\` on the agent-type dropdown with \`SETTINGS\$AGENT_LOCATION\` with English value \`\"Location\"\`.

### Acceptance Criteria
- [ ] Name input on the Add/Edit Agent page is labeled 'Agent Name'.
- [ ] The runtime/engine dropdown is labeled 'Location' (options: OpenHands, ACP)." \
  "frontend"

# Issue 4
create_issue \
  "[Full-Stack] Add 'Project' Field to Agent Definition and Persist in Database" \
  "### Overview
Allow users to organize agents by project or initiative. When defining an agent, a 'Project' field allows attributing an agent to its designated workspace/project.

### Assigned Team Members
- **Backend**: \`backend-developer\` (\`BackendDeveloper\`)
- **Frontend**: \`frontend-developer\` (\`FrontendDeveloper\`)

### Detailed Tasks
1. **Backend / Schema**:
   - Add \`project: str | None = None\` to \`AgentProfileBase\` in the SDK/backend models.
   - Update \`AgentProfileStore\` serialization and \`list_summaries()\` to persist and expose \`project\`.
2. **Frontend UI & API**:
   - Add \`project?: string | null\` to \`AgentProfile\` and \`AgentProfileSaveInput\` in TypeScript client definitions.
   - Add a 'Project' input field in \`agent-profiles-local-view.tsx\` right below or alongside 'Agent Name'.
   - Save the project attribute during profile save mutations.
   - Display a project badge/tag in \`agent-profile-row.tsx\` within the 'Available agents' list.

### Acceptance Criteria
- [ ] 'Project' text input is present on the Add and Edit Agent forms.
- [ ] Entered project value is persisted in the database/agent-profiles store.
- [ ] The project name is displayed in the list of agents." \
  "fullstack"

# Issue 5
create_issue \
  "[QA/Testing] Test Suite Verification for Agent Management Refactoring" \
  "### Overview
Update test suites and add regression tests for all renamed UI elements and the new 'Project' field.

### Assigned Team Member
- **Agent**: \`QA-engineer\` (\`Tester\`)

### Detailed Tasks
1. Update existing Vitest unit/component tests in \`src/components/features/settings/agent-profiles/\` that assert on 'Agent', 'Add agent profile', or 'Profile Name'.
2. Add test coverage verifying that the 'Project' field is properly captured on form submission.
3. Verify that changing 'Location' (OpenHands vs ACP) maintains expected conditional input rendering.

### Acceptance Criteria
- [ ] All updated tests pass without errors.
- [ ] No regression on existing settings tests." \
  "qa"

# Issue 6
create_issue \
  "[Docs] Update Settings & Agent Management Documentation" \
  "### Overview
Update documentation and guides to match the revised terminology and project features.

### Assigned Team Member
- **Agent**: \`technical-writer\` (\`Writer\`)

### Detailed Tasks
1. Update user guide documentation explaining the 'Agents' section in Settings.
2. Document the 'Location' option (distinguishing OpenHands native vs ACP external agents).
3. Document the 'Project' field and best practices for organizing agent teams.

### Acceptance Criteria
- [ ] User documentation in \`docs/\` accurately reflects all UI label changes and the Project field." \
  "documentation"

echo "=== Completed ==="
