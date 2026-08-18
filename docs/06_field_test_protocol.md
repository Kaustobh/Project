# 06. Field Test Protocol & Evaluation Framework

> **Objective:** Evaluate the live **Steady App** prototype during a 1-day real-world field test with MBBS intern Lakshay ($N=1$). Test whether single-task anchoring and anti-paralysis pinboard recommendations reduce daily friction, decision paralysis, and evening anxiety.

---

## 🔬 1. Test Setup & Environment

* **Participant:** Lakshay (24, MBBS Intern)
* **Test Environment:** Live mobile & laptop browser ([`http://localhost:3000/`](http://localhost:3000/)) during active hospital duty shifts and evening study.
* **Duration:** 1-Day unmoderated field observation with evening debrief.

---

## 🎯 2. Primary Evaluation Scenarios & Tasks

1. **Morning Focus Anchoring (Dashboard):**
   - Participant opens Steady, reviews the Hero "One Next Step" card, and selects 1 primary task for hospital handover.
   - *Metric:* Time taken to select primary anchor vs. traditional list browsing (<30 seconds target).

2. **Execution & Steady Session Launch (Tasks & Timer):**
   - Launch a 25-minute Deep Focus block attached to ICU rounds preparation.
   - Record inline subtask completions and timestamped quick field log entries.
   - *Metric:* Number of completed focus blocks vs. interruptions.

3. **Downtime Anti-Paralysis Test (Pinboard):**
   - During a 15-minute break, launch the One-Tap "Pick For Me" engine.
   - Select 15-minute window and consume the recommended article/video without manual list scrolling.
   - *Metric:* Reduction in downtime indecision (Subjective scale 1 to 5).

4. **Evening Decompression & Day Closure (Analytics):**
   - Run the Day Closure Protocol, rate daily groundedness, and execute guilt-free task rollover for uncompleted items.
   - *Metric:* Subjective relief rating at bedtime.

---

## 📊 3. Quantitative & Qualitative Metrics Checklist

- [ ] Cumulative focus time logged (Target: ≥ 75 minutes).
- [ ] Subtask completion rate (Target: ≥ 80%).
- [ ] Self-assessed groundedness score (Target: ≥ 4/5 stars).
- [ ] Qualitative feedback on Neumorphic visual clarity & tactile sound haptics.
