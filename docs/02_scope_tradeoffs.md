# 02. Scope Trade-offs: What We Are Building vs. NOT Building

> **Purpose:** Explicit scope boundaries and trade-off decisions for the 1-week rapid prototyping cycle. This document specifies the exact core MVP solution features being built versus what is deliberately excluded to maintain strict design discipline and prevent scope bloat.

---

## 1. Product Scope Overview

* **Target User:** Lakshay (24-year-old MBBS Intern balancing hospital duties, presentations, study, household chores, and personal time under shifting schedules).
* **Primary Objective:** Build a friction-free, adaptive daily prioritization and progress system that resolves decision paralysis and eliminates end-of-day anxiety.

---

## 2. Core Solution (What Is Being Built)

The prototype focuses exclusively on the critical path required to turn overwhelming task lists into achievable daily momentum:

1. ⚡ **Energy & Available Time Triage:**
   - Input mechanism for the user's current energy state (High / Medium / Low) and available hours.
   - Dynamic recommendation engine that matches tasks to real capacity.

2. 🎯 **Primary vs. Secondary Task Framing (1 + 3 Rule):**
   - Selection of **1 Primary Focus Task** and maximum **2–3 Secondary Tasks**.
   - Prevents overwhelming long lists by enforcing focal boundaries.

3. 🔄 **Shift-Change Adaptive Re-prioritization:**
   - Quick reset button when hospital emergency or shift changes interrupt planned activities.
   - Recalculates priorities on the fly without triggering guilt or schedule breakdown.

4. 🛡️ **Guilt-Free Postponement & Anti-Perfectionism:**
   - Explicit "Safe to Postpone" section showing non-critical items that can be deferred without penalty.

5. 🌙 **End-of-Day Micro-Reflection:**
   - Short 60-second evening reflection prompt to record qualitative progress and reduce burnout.

---

## 3. Explicit Out-of-Scope List (What Is NOT Being Built & Why)

To guarantee deliverability within the 1-week rapid prototyping constraint, the following capabilities are explicitly **EXCLUDED**:

| Feature / Idea Excluded | Reason for Exclusion | Future Trigger / Condition |
| :--- | :--- | :--- |
| **User Authentication & Multi-User Accounts** | Unnecessary overhead for validating core interaction model with target user. | If scaling to multi-user cloud platform. |
| **Backend Database Synchronization** | Local storage / client state is completely sufficient for rapid validation. | If cross-device persistence is required. |
| **Complex Calendar / Integration Sync (Google Cal, Outlook)** | External calendar APIs introduce setup friction and hide core prioritization logic. | Post-validation phase if users request automated schedule imports. |
| **Gamification & Social Sharing** | Badges, streaks, and leaderboards conflict with stress-reduction & anti-perfectionism goals. | Never (violates core design philosophy). |
| **Cosmetic Customization (Themes / Fonts)** | Visual customization does not solve the fundamental prioritization friction. | Post-validation UI polish cycle. |
| **Native Mobile App Builds (iOS/Android)** | Web application prototype allows faster iteration and immediate accessibility. | If field testing proves mobile app wrapping is necessary. |

---

## 4. Architectural & Design Trade-off Principles

* **Simplicity over Feature Density:** Prefer a single focused workflow over comprehensive productivity suites.
* **Qualitative Progress over Checkbox Quantity:** Measure meaningful impact rather than total count of completed items.
* **Adaptable over Rigid:** Acknowledge that medical intern schedules change without notice—never penalize broken schedules.
