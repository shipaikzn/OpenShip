# Settings: Agents Management Guide

In **OpenShip**, non-technical Product Owners and Project Managers interact with a fleet of specialized autonomous AI agents (Product Owner, Frontend Developer, Backend Developer, DevOps, Tester, Technical Writer). The **Settings → Agents** section allows defining and organizing these agents.

---

## 1. Navigating to Agents

In the sidebar navigation, click **Agents** (formerly "Agent") to access the agent management screen.

Here you will find:
- **Available agents**: The comprehensive directory of all configured agents.
- **Add agent**: The primary button to create and onboard a new agent.
- **Project Badges**: Tags displayed next to agents that have been assigned to specific projects or initiatives.
- **Active Agent Indicator**: Clearly displays which agent is currently active as the primary conversation partner.

---

## 2. Defining an Agent

When clicking **Add agent** or choosing **Edit** from an agent's action menu, the configuration form allows customizing:

### Agent Name
The human-readable name of the agent (e.g., `ProductOwner`, `FrontendDeveloper`, `BackendDeveloper`).

### Project
The project, product, or initiative to which this agent is attributed (e.g., `OpenShip`, `E-Commerce-Revamp`).
- Assigning agents to projects allows fleet organization across multiple repositories and business objectives.
- Stored and persisted directly in the agent definitions store and database.

### Location
Specifies the execution engine and environment where the agent runs:
- **OpenHands**: The native autonomous agent engine supporting full terminal execution, code editing, browser automation, and LLM configuration.
- **ACP (Agent Client Protocol)**: External coding agent runtimes such as Claude Code, Codex, Gemini CLI, Pi, or OpenCode.

---

## 3. Best Practices for Organizing Agent Teams

1. **Assign a Project**: Use the `Project` field consistently so team members (e.g. `FrontendDeveloper`, `BackendDeveloper`, `Tester`) belonging to the same product initiative can be quickly identified.
2. **Product Owner as Super-Agent**: Designate a `ProductOwner` agent as the primary active agent to orchestrate and delegate requirements to other specialized agents.
3. **Location Selection**: Use OpenHands native location for full workspace tasks requiring browser interaction and terminal execution, and ACP for specialized external CLI tools.
