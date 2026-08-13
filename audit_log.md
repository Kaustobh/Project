# Development Audit Log: The Messy Middle

This execution log documents real-time decisions, trade-offs, shifts in technical direction, dead ends, and human overrides during the 1-week rapid prototyping cycle. 

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

*Record all entries chronologically below.*

---

### [Pivots & Design Changes] — *[Example Entry]*
- **Context/Trigger:** Initial testing revealed user struggled to find the primary CTA when embedded inside a modal.
- **Original Approach:** Multi-step wizard inside a popup modal.
- **New Approach:** Dedicated full-width inline card on the main screen.
- **Trade-off / Impact:** Cut modal animation code; simplified UX flow by 1 step.

---

### [Dead Ends & Abandoned Code] — *[Example Entry]*
- **Attempted Feature / Approach:** Setting up IndexedDB persistence via `idb-keyval` for offline support.
- **Why It Failed / Was Abandoned:** Schema setup added unnecessary overhead for a 1-day prototype test.
- **Artifacts Removed/Branch:** Deleted `src/services/db.ts` and uninstalled `idb-keyval`.
- **Time Spent:** 45 minutes.
- **Key Takeaway:** Stick to standard `localStorage` until persistence requirements demand async DB storage.

---

### [AI Hallucination / Over-engineering & Manual Override] — *[Example Entry]*
- **Task Promoted to AI:** Generate a drag-and-drop list reordering handler.
- **AI Failure Mode:** AI imported `@hello-pangea/dnd`, added complex provider wrappers and boilerplate boilerplate files.
- **Specific Error/Output:** Over-engineered setup requiring 4 new files and broken type definitions.
- **Human Override Applied:** Replaced with HTML5 native `draggable` attribute and a 12-line drag event handler in the main component.
- **Prevention/Prompt Adjustment:** Specify "use native HTML APIs without external dependencies" in prompt constraints.

---
