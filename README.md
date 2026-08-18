# Steady — One Clear Step at a Time

> **Project Goal:** Rapidly prototype a production-ready solution for a single, highly specific friction for a real human (MBBS intern Lakshay) within 1 week. This repository emphasizes complete transparency, critical product judgment, tactile Neumorphic design precision, and working in the open.

---

## 🌐 Live Application Links

* 🚀 **[https://Kaustobh.github.io/Project/](https://Kaustobh.github.io/Project/)** — **Official Production Web App (Hosted on GitHub Pages)**
* 💻 **[http://localhost:3000/](http://localhost:3000/)** — Primary Local Development Server
* 💻 **[http://localhost:3002/](http://localhost:3002/)** — Secondary Local Development Server

---

## 📁 Repository Structure & Documentation Suite

```
├── docs/                           # Documentation suite
│   ├── 01_discovery_notes.md       # Raw observations & qualitative interview takeaways
│   ├── 02_scope_tradeoffs.md       # What we are building vs. NOT building (Scope matrix)
│   ├── 03_decision_log.md          # Execution log, dead ends, AI prompts & manual overrides
│   ├── 04_ui_design_system.md      # Neumorphic design tokens, palette & 1:1 image mapping
│   ├── 05_technical_architecture.md# Technical stack, component breakdown & timer mechanics
│   ├── 06_field_test_protocol.md   # Field test protocol, evaluation tasks & user metrics
│   └── 07_user_impact_and_painpoint_resolution.md # Deep dive: How Steady solves user pain points
├── public/                         # Static image assets (LOGO.png, KPI_1-6.jpeg)
├── src/                            # Production React + TypeScript codebase
└── README.md                       # High-level overview & documentation index
```

---

## 📖 Complete Documentation Index

- 💡 **[07. User Context & Pain Point Resolution](docs/07_user_impact_and_painpoint_resolution.md):** Deep dive on user friction points (decision paralysis, shift anxiety, downtime waste) and how Steady features directly resolve them.
- 📖 **[01. Discovery Notes & Interview Takeaways](docs/01_discovery_notes.md):** Qualitative research with MBBS intern Lakshay, problem statements, POV, and How-Might-We (HMW) design frameworks.
- 🎯 **[02. Scope Trade-offs](docs/02_scope_tradeoffs.md):** Core solution boundaries, 1+3 task framing, and explicit out-of-scope feature matrix.
- 🪵 **[03. Decision Log](docs/03_decision_log.md):** Execution log history, architectural pivots, dead ends, AI hallucination overrides, and milestone records.
- 🎨 **[04. UI Design System & Asset Guidelines](docs/04_ui_design_system.md):** 60-30-10 color rules, extruded/inset shadow tokens, audio haptic synthesis, and 1:1 image placement table.
- 🏗️ **[05. Technical Architecture](docs/05_technical_architecture.md):** Vite + React + TypeScript architecture, relational reactive store, flow canvas & calendar engines.
- 🔬 **[06. Field Test Protocol](docs/06_field_test_protocol.md):** 1-Day unmoderated field test evaluation tasks, metrics checklist, and observation protocol.

---

## 🖼️ Attached Image Asset Mapping (Zero Duplication)

| Asset Name | Location in App | Function |
| :--- | :--- | :--- |
| **`LOGO.png`** | Splash Screen & Top Navbar | Breathing logo frame & header brand identity |
| **`logo.jpeg`** | Hero Focus Card & Pinboard Audio | Watermark graphic backdrop & audio item thumbnail |
| **`KPI_1.jpeg`** | Dashboard KPI Card 1 | Graphic backdrop for **Time Reclaimed** metric |
| **`KPI_2.jpeg`** | Dashboard KPI Card 2 | Graphic backdrop for **Active Flow** metric |
| **`KPI_3.jpeg`** | Dashboard KPI Card 3 | Graphic backdrop for **Completion Rate** metric |
| **`KPI_4.jpeg`** | Pinboard Item 1 | Thumbnail for *ECG Interpretation Guide* |
| **`KPI_5.jpeg`** | Pinboard Item 2 | Thumbnail for *10-Min Box Breathing* |
| **`KPI_6.jpeg`** | Pinboard Item 3 | Thumbnail for *80/20 Med Study Rule* |
