# 04. UI Design System & Neumorphic Brand Guidelines

> **Philosophy:** "Quiet companion that cuts through chaos. One clear next step."
> **Design Language:** Tactile, soft Neumorphic UI combined with Muji-style functional calm and Linear-level precision. Avoids harsh specular glares in favor of soft, diffused, multi-layered drop and inset shadows.

---

## 🎨 1. Color Palette (60-30-10 Rule)

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Dominant 60% (Light)** | Steady White | `#F9F9F7` | Primary page background, container surfaces |
| **Dominant 60% (Dark)** | Deep Charcoal | `#1A1A1C` | Dark mode page background, dark container surfaces |
| **Secondary 30% (Light)**| Grounded Gray | `#6B7280` | Subtitle text, muted labels, borders (`#E5E7EB`) |
| **Secondary 30% (Dark)** | Soft Silver | `#9CA3AF` | Dark mode muted text, borders (`#374151`) |
| **Accent 10%** | Calm Teal | `#5DA8A8` | Active states, primary CTAs, active focus indicators |
| **Accent Hover** | Deep Teal | `#4E9393` | Hover state for buttons and interactive controls |
| **Status Accents** | Amber & Coral | `#D97706` / `#E11D48` | Priority indicators (Medium / High) |

---

## 🌑 2. Neumorphic Elevation & Shadow Tokens

### Light Mode (`#F9F9F7`)
- **Extruded Card Surface (`shadow-neu-light`):**
  `box-shadow: 6px 6px 16px #e2e2de, -6px -6px 16px #ffffff; border-radius: 18px;`
- **Sunken Input / Active State (`shadow-neu-light-inset`):**
  `box-shadow: inset 4px 4px 8px #e2e2de, inset -4px -4px 8px #ffffff;`
- **Subtle Surface (`shadow-neu-light-sm`):**
  `box-shadow: 4px 4px 10px #e2e2de, -4px -4px 10px #ffffff;`

### Dark Mode (`#1A1A1C`)
- **Extruded Card Surface (`shadow-neu-dark`):**
  `box-shadow: 6px 6px 16px #131315, -6px -6px 16px #212123; border-radius: 18px;`
- **Sunken Input / Active State (`shadow-neu-dark-inset`):**
  `box-shadow: inset 4px 4px 8px #131315, inset -4px -4px 8px #212123;`
- **Subtle Surface (`shadow-neu-dark-sm`):**
  `box-shadow: 4px 4px 10px #131315, -4px -4px 10px #212123;`

---

## 🖼️ 3. Brand Assets & Image Integration Mapping

All attached project images are integrated into specific UI contexts without duplicate role assignments:

| Image File | UI Placement | Purpose & Function |
| :--- | :--- | :--- |
| **`LOGO.png`** | Splash Screen & Top Navbar | Animated breathing brand icon & header identity |
| **`logo.jpeg`** | Hero Focus Card & Pinboard Audio | Watermark background graphic & audio track preview |
| **`KPI_1.jpeg`** | Dashboard KPI Card 1 | Graphic backdrop for **Time Reclaimed** metric |
| **`KPI_2.jpeg`** | Dashboard KPI Card 2 | Graphic backdrop for **Active Flow** metric |
| **`KPI_3.jpeg`** | Dashboard KPI Card 3 | Graphic backdrop for **Completion Rate** metric |
| **`KPI_4.jpeg`** | Pinboard Item 1 | Thumbnail preview for *ECG Interpretation Guide* |
| **`KPI_5.jpeg`** | Pinboard Item 2 | Thumbnail preview for *10-Min Box Breathing* |
| **`KPI_6.jpeg`** | Pinboard Item 3 | Thumbnail preview for *80/20 Med Study Rule* |

---

## 🔊 4. Synthesized Audio Haptics

- **Soft Click (`playSoftClick`):** Web Audio API sine oscillator dropping from 420Hz to 120Hz over 40ms at 0.08 gain for tactile button feedback.
- **Success Chime (`playSuccessChime`):** Arpeggiated triangle wave sequence (C5-E5-G5-C6) triggering on focus block completion and day closure.
