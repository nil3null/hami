# Meme Generator — Design Brainstorm

## Three Stylistic Approaches

### Approach A — "Brutalist Arcade"
A raw, high-energy aesthetic inspired by 90s game UIs and internet culture. Bold borders, chunky type, neon accents on near-black. Feels like a meme factory.
**Probability:** 0.07

### Approach B — "Dark Studio Pro" ✅ CHOSEN
A sleek, dark-mode creative tool aesthetic — think Figma meets a meme factory. Charcoal panels, electric yellow-green accent, crisp monospace labels. Feels professional yet irreverent.
**Probability:** 0.09

### Approach C — "Pastel Pop"
Soft lavender and peach tones, rounded bubbly cards, playful sans-serif. Feels like a Gen-Z social media tool.
**Probability:** 0.04

---

## Chosen Approach: "Dark Studio Pro"

### Design Movement
Dark-mode creative tool / SaaS dashboard — inspired by Figma, Linear, and VS Code. Precision meets personality.

### Core Principles
1. **Contrast-first hierarchy** — every element earns its place through contrast and weight
2. **Functional density** — controls are compact but never cramped; every pixel works
3. **Irreverent professionalism** — serious tool aesthetics with meme-culture energy
4. **Immediate feedback** — every interaction reflects instantly on the canvas

### Color Philosophy
- Background: near-black `#0f0f11` — deep, not pure black
- Panel surface: `#1a1a1f` — subtle lift from background
- Border: `#2a2a32` — barely-there separators
- Accent: Electric Yellow-Green `#c8f135` — ownable, punchy, unmistakably "meme energy"
- Text primary: `#f0f0f5`
- Text muted: `#6b6b7a`
- Destructive/error: `#ff4d4f`

### Layout Paradigm
Asymmetric split: narrow left sidebar (controls, ~340px) + dominant right canvas area. On mobile, sidebar collapses to a bottom sheet/drawer. Canvas is always the hero.

### Signature Elements
1. Neon yellow-green accent on active states, buttons, and focus rings
2. Monospace labels for all control headings (feels like code/tool)
3. Subtle grain texture on the canvas background area

### Interaction Philosophy
Controls are instant — no submit buttons for text changes. Everything live-updates the canvas. Micro-animations on template selection (scale pop). Download button has a brief "success" flash.

### Animation
- Template card hover: `scale(1.04)` + border glow, 150ms ease-out
- Template select: canvas image cross-fades, 200ms
- Sidebar control changes: canvas re-renders within 16ms (requestAnimationFrame)
- Download success: button turns green briefly, 800ms

### Typography System
- Display/headings: `Space Grotesk` — geometric, modern, slightly quirky
- Body/labels: `Inter` — readable, neutral
- Canvas text: Impact (classic meme font) as default, user-adjustable

### Brand Essence
The fastest meme studio on the internet — for anyone who thinks in memes.
Adjectives: **Sharp, Irreverent, Instant**

### Brand Voice
Headlines sound like: "Make it. Meme it. Send it."
CTAs: "Download Meme" not "Export Image"

### Signature Brand Color
Electric Yellow-Green `#c8f135` — unmistakably this brand's.

### Wordmark & Logo
Bold "M" glyph with a speech-bubble cutout, rendered in `#c8f135` on dark.
