<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: GLP1
description: Premium, medically-guided GLP-1 weight care — a midnight wellness lab, not a pastel pharmacy.
---

# Design System: GLP1

## 1. Overview

**Creative North Star: "The Midnight Wellness Lab"**

This is data-as-luxury for metabolic health. The surface is a deep ink-green near-black,
the way Oura, Whoop, and Eight Sleep treat dark as a premium material rather than a
gimmick. Light off-white type sits on that depth with generous space, and a single
luminous mint/jade accent does the persuading. Choreographed motion (orchestrated
entrances, scroll-driven sequences) gives the page the cinematic, high-production-value
feel of an aspirational health brand. The job is conversion of cautious, evaluating
prospective patients, so the experience must read as assured, refined, and human, never
hurried or hyped.

This system explicitly rejects: the muted-pastel, rounded-everything **generic
telehealth (Hims/Ro) look**; **crash-diet weight-loss advertising** (before/afters,
urgency banners, miracle-cure energy); **cold clinical / insurance-portal** sterility;
and the **AI-generated SaaS template** (cream backgrounds, tiny uppercase tracked
eyebrows, identical card grids, gradient text). Premium here means restraint and craft.

**Key Characteristics:**
- Deep ink-green drenched surface; dark as a luxury material
- One luminous mint accent, used sparingly, carries every conversion moment
- Geometric display headlines over a warm humanist body
- Choreographed, calm-but-cinematic motion
- Readable-as-a-feature: generous type and strong contrast for an older audience

## 2. Colors

A drenched dark palette: a deep ink-green surface, luminous mint accent, and off-white ink. Exact tokens resolve during implementation; values below are the seed direction in OKLCH.

### Primary
- **Luminous Jade** (`oklch(80% 0.16 150)` — *to be tuned during implementation*): the single accent. Conversion CTAs, key highlights, focus glow. Its rarity is the point.

### Neutral
- **Deep Ink-Green** (`oklch(20% 0.03 165)`): the body background — the drenched surface itself.
- **Raised Ink Panel** (`oklch(26% 0.035 165)`): elevated surfaces, panels, cards.
- **Off-White** (`oklch(96% 0.01 150)`): primary text on dark.
- **Muted Sage** (`oklch(70% 0.02 165)`): secondary text, captions, dividers.

### Named Rules
**The One Light Rule.** Exactly one luminous accent (Jade) carries persuasion. It appears on the primary CTA and at most a few highlights per screen; everything else is ink and off-white. Never introduce a second saturated accent.

**The No-Pastel Rule.** Prohibited: the muted-pastel telehealth band. If a color reads as soft, dusty, and rounded-DTC, it is wrong for this brand.

## 3. Typography

**Display Font:** [Geometric display family to be chosen at implementation] (e.g. a confident geometric sans)
**Body Font:** [Humanist sans to be chosen at implementation]

**Character:** Geometric headlines give a modern, premium, slightly architectural confidence; a warm humanist body keeps long reading approachable for an evaluating, older-skewing audience. Pair on a real contrast axis (geometric vs. humanist), never two near-identical sans.

### Hierarchy
- **Display** (large clamp, max ceiling ~6rem, letter-spacing >= -0.04em): hero and section headlines only. `text-wrap: balance`.
- **Headline / Title** (medium-large, weight contrast >= 1.25 ratio between steps): section and card headings.
- **Body** (generous baseline for readability; 65–75ch max line length, `text-wrap: pretty`): all prose.
- **Label** (small, used sparingly, <= 4 words if uppercase): buttons, tags, metadata. No all-caps body copy.

### Named Rules
**The Readable-As-Brand Rule.** Generous default sizes and strong contrast are brand assets here, not a11y afterthoughts. Never shrink body copy below comfortable reading size to look "sleek".

## 4. Elevation

Choreographed motion implies a layered system: surfaces lift subtly from the ink ground using soft ambient shadow and tonal separation (Raised Ink Panel over Deep Ink-Green), not hard borders. Depth on a dark surface comes primarily from lightness contrast and diffuse glow, never from heavy drop shadows. The Jade accent may carry a soft luminous glow at conversion moments. Exact shadow tokens resolve during implementation.

## 5. Components

<!-- No components exist yet. Re-run /impeccable document after the first build to capture real button/input/nav primitives and generate the sidecar. -->

## 6. Do's and Don'ts

### Do:
- **Do** treat the deep ink-green surface as the brand's premium material; let it dominate.
- **Do** reserve Luminous Jade for the primary CTA and rare highlights (The One Light Rule).
- **Do** pair a geometric display with a humanist body on a real contrast axis.
- **Do** keep body text >= 4.5:1 contrast against the dark ground (off-white, not muted gray, for primary copy).
- **Do** ship a `prefers-reduced-motion` alternative for every choreographed entrance.
- **Do** earn trust before the conversion ask; let calm, craft, and clarity persuade.

### Don't:
- **Don't** drift into the **generic telehealth (Hims/Ro) look**: muted pastels, rounded-everything, DTC-pharma sameness.
- **Don't** use **crash-diet / weight-loss ad** devices: before/after photos, urgency banners, countdowns, miracle-cure language.
- **Don't** go **cold clinical**: sterile, jargon-heavy, insurance-portal ugliness.
- **Don't** ship the **AI-generated SaaS template**: cream/sand backgrounds, tiny uppercase tracked eyebrows above every section, identical icon-heading-text card grids, or gradient text.
- **Don't** introduce a second saturated accent or let muted gray stand in for primary body text.
