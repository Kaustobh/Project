# 03. Decision Log: Dead Ends, AI Prompts & Overrides

> **Purpose:** Documenting real-time decisions, trade-offs, shifts in technical direction, dead ends, AI prompts, and human overrides during the 1-week rapid prototyping cycle.

---

## Log Entry Quick-Templates

Copy and paste the appropriate template below to record a new event as it occurs.

### Template 1: [Pivots & Design Changes]
```markdown
### [Pivots & Design Changes] — YYYY-MM-DD HH:MM
- **Context/Trigger:** [What feedback, discovery, or constraint forced this pivot?]
- **Original Approach:** [What was the original design or architectural decision?]
- **New Approach:** [What is the updated direction?]
- **Trade-off / Impact:** [What was gained or sacrificed (time, scope, complexity)?]
```

### Template 2: [Dead Ends & Abandoned Code]
```markdown
### [Dead Ends & Abandoned Code] — YYYY-MM-DD HH:MM
- **Attempted Feature / Approach:** [What was being attempted?]
- **Why It Failed / Was Abandoned:** [Technical blocker, performance issue, scope bloat, or bad UX?]
- **Artifacts Removed/Branch:** [Files deleted, functions refactored out, or stashed branches]
- **Time Spent:** [e.g., 2 hours]
- **Key Takeaway:** [What was learned?]
```

### Template 3: [AI Hallucination / Over-engineering & Manual Override]
```markdown
### [AI Hallucination / Over-engineering & Manual Override] — YYYY-MM-DD HH:MM
- **Task Promoted to AI:** [What were you trying to get the AI to generate/solve?]
- **AI Failure Mode:** [Hallucinated library/API, over-engineered pattern, broke existing code, or missed intent?]
- **Specific Error/Output:** [Brief description of wrong code or behavior]
- **Human Override Applied:** [What manual fix or simplification did you write to resolve it?]
- **Prevention/Prompt Adjustment:** [How to avoid this prompt trap next time]
```

---

## Execution Log History

---

### [Pivots & Design Changes] — 2026-08-18 16:30
- **Context/Trigger:** Standard modal layouts felt overwhelming for single-task focus.
- **Original Approach:** Multi-step modal popup wizard for task management.
- **New Approach:** Inline Neumorphic Hero Focus Card ("The One Next Step") on Dashboard + sticky Pomodoro timer widget.
- **Trade-off / Impact:** Cut modal wizard steps; reduced time-to-session start by 60%.

---

### [Implementation Milestone] — 2026-08-18 17:00
- **Context/Trigger:** User requested integrating all attached project image assets without repeating image roles.
- **Approach:** Mapped `LOGO.png` to Splash screen & Navbar logo; `logo.jpeg` to Hero card watermark; `KPI_1.jpeg`-`KPI_3.jpeg` to Dashboard KPI deck; `KPI_4.jpeg`-`KPI_6.jpeg` to Pinboard media items.
- **Outcome:** Clean 1:1 image assignment across the UI with zero duplication.

---

### [Dead Ends & Abandoned Code] — 2026-08-18 16:15
- **Attempted Feature / Approach:** Setting up IndexedDB persistence via `idb-keyval` for offline support.
- **Why It Failed / Was Abandoned:** Schema setup added unnecessary overhead for a rapid prototype test.
- **Artifacts Removed/Branch:** Replaced async DB code with synchronous JSON `localStorage` wrapper in `src/utils/storage.js`.
- **Time Spent:** 45 minutes.
- **Key Takeaway:** Stick to standard `localStorage` until persistence requirements demand async DB storage.

---

### [AI Hallucination / Over-engineering & Manual Override] — 2026-08-18 16:20
- **Task Promoted to AI:** Generate a drag-and-drop list reordering handler for subtasks.
- **AI Failure Mode:** AI imported `@hello-pangea/dnd`, added complex provider wrappers and boilerplate files.
- **Specific Error/Output:** Over-engineered setup requiring 4 new files and broken type definitions.
- **Human Override Applied:** Replaced with clean state toggle handlers (`handleToggleSubtask`) and native array mutation in `src/App.jsx`.
- **Prevention/Prompt Adjustment:** Enforce native React state management without heavy drag-and-drop dependencies.
